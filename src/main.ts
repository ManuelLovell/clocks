import OBR from '@owlbear-rodeo/sdk';
import * as Utilities from './utilities/bsUtilities';
import { CLOCKS } from './clock';
import { CHECKBOX } from './checkbox';
import { COUNTERS } from './counter';
import './style.css'
import { Constants } from './utilities/bsConstants';

const CLOCKTOGGLE = document.getElementById('clockButton') as HTMLButtonElement;
const CLOCKCONTAINER = document.getElementById('clockContainer') as HTMLDivElement;
const CHECKTOGGLE = document.getElementById('checkboxButton') as HTMLButtonElement;
const CHECKBOXCONTAINER = document.getElementById('checkboxContainer') as HTMLDivElement;
const COUNTERTOGGLE = document.getElementById('counterButton') as HTMLButtonElement;
const COUNTERCONTAINER = document.getElementById('numberContainer') as HTMLDivElement;

OBR.onReady(async () =>
{
    await Utilities.CheckRegistration();
    await CLOCKS.Initiate();
    await COUNTERS.Initiate();
    await CHECKBOX.Initiate();
    CHECKBOX.SetupControls();
    COUNTERS.SetupControls();
    CLOCKS.SetupControls();
    SetupToggles();
    SetupPatreon();

    const role = await OBR.player.getRole();
    if (role === "PLAYER")
    {
        document.querySelectorAll('.pin-button').forEach((element) =>
        {
            element.remove();
        });

        // Setup broadcast listener for players to know about Pins
        OBR.broadcast.onMessage(Constants.BROADCASTAWAITID, async (data) =>
        {
            const sw = await OBR.viewport.getWidth();
            const mobile = sw < 400;
            await OBR.popover.close(Constants.PINNEDID);
            await OBR.popover.open({
                id: Constants.PINNEDID,
                url: data.data as string,
                height: 160,
                width: 160,
                anchorPosition: { top: mobile ? 50 : 20, left: mobile ? (sw - 60) :  (sw - 80) },
                anchorReference: "POSITION",
                anchorOrigin: {
                    vertical: "TOP",
                    horizontal: "RIGHT",
                },
                transformOrigin: {
                    vertical: "TOP",
                    horizontal: "RIGHT",
                },
                disableClickAway: true,
                hidePaper: true
            });
        });
    }
});

function SetupPatreon()
{
    const patreonContainer = document.getElementById("patreonContainer")!;
    patreonContainer.appendChild(Utilities.GetPatreonButton());
}

function SetupToggles()
{
    CLOCKTOGGLE.onclick = () =>
    {
        CLOCKTOGGLE.classList.add("selected");
        CLOCKCONTAINER.style.display = "block";

        CHECKTOGGLE.classList.remove("selected");
        CHECKBOXCONTAINER.style.display = "none";
        COUNTERTOGGLE.classList.remove("selected");
        COUNTERCONTAINER.style.display = "none";
    };
    CHECKTOGGLE.onclick = () =>
    {
        CHECKTOGGLE.classList.add("selected");
        CHECKBOXCONTAINER.style.display = "block";

        CLOCKTOGGLE.classList.remove("selected");
        CLOCKCONTAINER.style.display = "none";
        COUNTERTOGGLE.classList.remove("selected");
        COUNTERCONTAINER.style.display = "none";
    };
    COUNTERTOGGLE.onclick = () =>
    {
        COUNTERTOGGLE.classList.add("selected");
        COUNTERCONTAINER.style.display = "block";

        CHECKTOGGLE.classList.remove("selected");
        CHECKBOXCONTAINER.style.display = "none";
        CLOCKTOGGLE.classList.remove("selected");
        CLOCKCONTAINER.style.display = "none";
    };
}