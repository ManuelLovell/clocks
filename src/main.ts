import OBR from '@owlbear-rodeo/sdk';
import * as Utilities from './utilities/bsUtilities';
import { CLOCKS } from './clock';
import { CHECKBOX } from './checkbox';
import { COUNTERS } from './counter';
import './style.css'

const CLOCKTOGGLE = document.getElementById('clockButton') as HTMLButtonElement;
const CLOCKCONTAINER = document.getElementById('clockContainer') as HTMLDivElement;
const CHECKTOGGLE = document.getElementById('checkboxButton') as HTMLButtonElement;
const CHECKBOXCONTAINER = document.getElementById('checkboxContainer') as HTMLDivElement;
const COUNTERTOGGLE = document.getElementById('counterButton') as HTMLButtonElement;
const COUNTERCONTAINER = document.getElementById('numberContainer') as HTMLDivElement;

OBR.onReady(async () =>
{
    await Utilities.CheckRegistration();
    CLOCKS.SetupControls();
    CHECKBOX.SetupControls();
    COUNTERS.SetupControls();
    SetupToggles();
    SetupPatreon();
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