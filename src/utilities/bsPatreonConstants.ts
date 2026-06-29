export class BSWhatsNewConstants
{
    static EXTENSIONWHATSNEW = "com.battle-system.journal-whatsnew";

    static USE_DIRECT_REGISTRATION_LOOKUP = true;
    static USE_REGISTRATION_METRICS = true;
    static REGISTRATION_METRICS_BATCH_SIZE = 25;
    static REGISTRATION_METRICS_FLUSH_MS = 10000;
    static REGISTRATION_LOOKUP_VIEW = 'bs_registration_status_public';
    static REGISTRATION_CACHE_PREFIX = 'CLOCKS_REGISTRATION';
    static REGISTRATION_POSITIVE_TTL_MS = 12 * 60 * 60 * 1000;
    static REGISTRATION_NEGATIVE_TTL_MS = 60 * 60 * 1000;
    static REGISTRATION_ERROR_COOLDOWN_MS = 5 * 60 * 1000;

    static CHECKREGISTRATION = 'https://vrwtdtmnbyhaehtitrlb.supabase.co/functions/v1/patreon-check';
    static ANONAUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
}