import OBR from "@owlbear-rodeo/sdk";
import * as uuid from 'uuid';
import { BSWhatsNewConstants } from "./bsPatreonConstants";
import { supabase } from './supabaseClient';
import { CacheStatus, LookupSource, TrackRegistrationCheckEvent } from './bsMetrics';

export let USER_REGISTERED = false;
let registrationCheckPromise: Promise<boolean> | null = null;

type RegistrationCacheEntry = {
    playerId: string;
    registered: boolean;
    tier: string;
    lookupSource?: LookupSource;
    checkedAt: number;
    lastFailureAt?: number;
};

export function GetUUID()
{
    return uuid.v4();
}

export function GetPatreonButton()
{
    const newImgElement = document.createElement('img');
    newImgElement.id = "PatreonButton";
    newImgElement.setAttribute('class', 'icon');
    newImgElement.classList.add('patreon-clickable');
    newImgElement.setAttribute('title', USER_REGISTERED ? 'Thanks for subscribing!' : 'Get the news on updates on the Battle-System Patreon');
    newImgElement.setAttribute('src', USER_REGISTERED ? 'w-thankyou.svg' : '/w-patreon-2.png');
    newImgElement.onclick = async function (e)
    {
        e.preventDefault();
        window.open("https://www.patreon.com/battlesystem", "_blank");
    }

    return newImgElement;
}

export async function CheckRegistration()
{
    if (registrationCheckPromise)
    {
        USER_REGISTERED = await registrationCheckPromise;
        return;
    }

    registrationCheckPromise = CheckRegistrationInternal();

    try
    {
        USER_REGISTERED = await registrationCheckPromise;
    }
    catch (error)
    {
        console.error("Error:", error);
        USER_REGISTERED = false;
    }
    finally
    {
        registrationCheckPromise = null;
    }
}

async function CheckRegistrationInternal(): Promise<boolean>
{
    const owlbearId = await OBR.player.getId();

    const startTime = performance.now();
    const cachedRegistration = GetRegistrationCache(owlbearId);
    if (HasValidRegistrationCache(cachedRegistration))
    {
        TrackRegistrationMetricFromCache(owlbearId, cachedRegistration!, 'hit', startTime);
        return cachedRegistration!.registered;
    }

    if (BSWhatsNewConstants.USE_DIRECT_REGISTRATION_LOOKUP)
    {
        if (IsRegistrationRetryCoolingDown(cachedRegistration))
        {
            TrackRegistrationMetricFromCache(owlbearId, cachedRegistration!, 'stale', startTime);
            return cachedRegistration!.registered;
        }

        try
        {
            const directRegistration = await CheckRegistrationDirect(owlbearId);
            directRegistration.lookupSource = 'direct_supabase';
            SaveRegistrationCache(directRegistration);
            TrackRegistrationMetric({
                playerId: owlbearId,
                lookupSource: 'direct_supabase',
                cacheStatus: cachedRegistration ? 'stale' : 'miss',
                result: directRegistration.registered ? 'registered' : 'not_registered',
                success: true,
                tier: directRegistration.tier,
                startTime,
            });
            return directRegistration.registered;
        }
        catch (error)
        {
            console.error('Registration lookup error:', error);
            const errorMessage = error instanceof Error ? error.message : 'direct_lookup_failed';
            TrackRegistrationMetric({
                playerId: owlbearId,
                lookupSource: 'direct_supabase',
                cacheStatus: cachedRegistration ? 'stale' : 'miss',
                result: 'error',
                success: false,
                errorCode: 'direct_lookup_failed',
                errorMessage,
                startTime,
            });
            MarkRegistrationLookupFailure(cachedRegistration);

            if (cachedRegistration)
            {
                TrackRegistrationMetricFromCache(owlbearId, cachedRegistration, 'stale', startTime);
                return cachedRegistration.registered;
            }
        }
    }

    try
    {
        const legacyRegistered = await CheckRegistrationLegacy(owlbearId);
        SaveRegistrationCache({
            playerId: owlbearId,
            registered: legacyRegistered,
            tier: cachedRegistration?.tier ?? 'free',
            lookupSource: 'fallback_legacy_function',
            checkedAt: Date.now(),
        });
        TrackRegistrationMetric({
            playerId: owlbearId,
            lookupSource: 'fallback_legacy_function',
            cacheStatus: BSWhatsNewConstants.USE_DIRECT_REGISTRATION_LOOKUP ? (cachedRegistration ? 'stale' : 'miss') : 'bypass',
            result: legacyRegistered ? 'registered' : 'not_registered',
            success: true,
            tier: cachedRegistration?.tier ?? 'free',
            startTime,
        });
        return legacyRegistered;
    }
    catch (error)
    {
        const errorMessage = error instanceof Error ? error.message : 'legacy_lookup_failed';
        TrackRegistrationMetric({
            playerId: owlbearId,
            lookupSource: 'fallback_legacy_function',
            cacheStatus: BSWhatsNewConstants.USE_DIRECT_REGISTRATION_LOOKUP ? (cachedRegistration ? 'stale' : 'miss') : 'bypass',
            result: 'error',
            success: false,
            errorCode: 'legacy_lookup_failed',
            errorMessage,
            startTime,
        });
        throw error;
    }
}

async function CheckRegistrationDirect(owlbearId: string): Promise<RegistrationCacheEntry>
{
    const { data, error } = await supabase
        .from(BSWhatsNewConstants.REGISTRATION_LOOKUP_VIEW)
        .select('active,tier,updated_at')
        .eq('owlbear_id', owlbearId)
        .maybeSingle();

    if (error)
    {
        throw error;
    }

    return {
        playerId: owlbearId,
        registered: Boolean(data?.active),
        tier: data?.tier ?? 'free',
        checkedAt: Date.now(),
    };
}

async function CheckRegistrationLegacy(owlbearId: string): Promise<boolean>
{
    try
    {
        const debug = window.location.origin.includes("localhost") ? "eternaldream" : "";
        const userid = {
            owlbearid: owlbearId
        };

        const requestOptions = {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": BSWhatsNewConstants.ANONAUTH,
                "x-manuel": debug
            }),
            body: JSON.stringify(userid),
        };
        const response = await fetch(BSWhatsNewConstants.CHECKREGISTRATION, requestOptions);

        if (!response.ok)
        {
            const errorData = await response.json();
            console.error("Error:", errorData);
            throw new Error(`Legacy registration request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.Data === "OK";
    }
    catch (error)
    {
        console.error("Error:", error);
        throw error;
    }
}

function GetRegistrationCacheKey(playerId: string): string
{
    return `${BSWhatsNewConstants.REGISTRATION_CACHE_PREFIX}_${playerId}`;
}

function GetRegistrationCache(playerId: string): RegistrationCacheEntry | null
{
    try
    {
        const cachedValue = localStorage.getItem(GetRegistrationCacheKey(playerId));
        if (!cachedValue) return null;

        const parsedValue = JSON.parse(cachedValue) as RegistrationCacheEntry;
        if (parsedValue.playerId !== playerId || typeof parsedValue.checkedAt !== 'number') return null;
        return parsedValue;
    }
    catch (error)
    {
        console.error('Registration cache parse error:', error);
        return null;
    }
}

function HasValidRegistrationCache(cachedRegistration: RegistrationCacheEntry | null): boolean
{
    if (!cachedRegistration) return false;

    const ttl = cachedRegistration.registered
        ? BSWhatsNewConstants.REGISTRATION_POSITIVE_TTL_MS
        : BSWhatsNewConstants.REGISTRATION_NEGATIVE_TTL_MS;

    return (Date.now() - cachedRegistration.checkedAt) < ttl;
}

function IsRegistrationRetryCoolingDown(cachedRegistration: RegistrationCacheEntry | null): boolean
{
    if (!cachedRegistration?.lastFailureAt) return false;
    return (Date.now() - cachedRegistration.lastFailureAt) < BSWhatsNewConstants.REGISTRATION_ERROR_COOLDOWN_MS;
}

function MarkRegistrationLookupFailure(cachedRegistration: RegistrationCacheEntry | null)
{
    if (!cachedRegistration) return;

    SaveRegistrationCache({
        ...cachedRegistration,
        lastFailureAt: Date.now(),
    });
}

function SaveRegistrationCache(cachedRegistration: RegistrationCacheEntry)
{
    localStorage.setItem(GetRegistrationCacheKey(cachedRegistration.playerId), JSON.stringify(cachedRegistration));
}

function TrackRegistrationMetricFromCache(playerId: string, cachedRegistration: RegistrationCacheEntry, cacheStatus: CacheStatus, startTime: number)
{
    TrackRegistrationMetric({
        playerId,
        lookupSource: cachedRegistration.lookupSource ?? 'direct_supabase',
        cacheStatus,
        result: cachedRegistration.registered ? 'registered' : 'not_registered',
        success: true,
        tier: cachedRegistration.tier,
        startTime,
    });
}

function TrackRegistrationMetric(args: {
    playerId: string;
    lookupSource: LookupSource;
    cacheStatus: CacheStatus;
    result: 'registered' | 'not_registered' | 'error';
    success: boolean;
    tier?: string;
    errorCode?: string;
    errorMessage?: string;
    startTime: number;
})
{
    const latencyMs = Math.max(0, Math.round(performance.now() - args.startTime));

    void TrackRegistrationCheckEvent({
        playerId: args.playerId,
        lookupSource: args.lookupSource,
        cacheStatus: args.cacheStatus,
        result: args.result,
        success: args.success,
        latencyMs,
        tier: args.tier,
        errorCode: args.errorCode,
        errorMessage: args.errorMessage,
    });
}