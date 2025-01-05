import OBR from "@owlbear-rodeo/sdk";
import './style.css'
import { CLOCKS } from "./clock";
import { Constants } from "./utilities/bsConstants";
import { CHECKBOX } from './checkbox';
import { COUNTERS } from "./counter";

OBR.onReady(() =>
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const modelId = decodeURIComponent(urlParams.get('modelid')!);
    const modelName = decodeURIComponent(urlParams.get('modelname')!);
    const modelType = urlParams.get('modeltype')!;
    const modelTotal = decodeURIComponent(urlParams.get('modeltotal')!);
    const jsonedMarked = decodeURIComponent(urlParams.get('modelmarked')!);
    const modelMarked = JSON.parse(jsonedMarked) as { key: string, value: string }[];

    let currentModel = {
        Id: modelId,
        Name: modelName,
        Type: modelType,
        Total: modelTotal,
        Marked: modelMarked
    };

    // Only on initial load
    RefreshCounter();

    // Allow a way to close it
    const mainbody = document.getElementById('pinnedMain')!;
    mainbody.onclick = async () =>
    {
        await OBR.popover.close(Constants.PINNEDID);
    }

    OBR.broadcast.onMessage(Constants.BROADCASTID, (data) =>
    {
        const newState = data.data as SaveState;
        if (newState.Id === currentModel.Id)
        {
            currentModel.Name = newState.Name;
            currentModel.Total = newState.Total.toString();
            currentModel.Marked = newState.Marked ?? [];

            RefreshCounter();
        }
    });

    // Quit message for deleted items
    OBR.broadcast.onMessage(Constants.BROADCASTREMOVEID, async (data) =>
    {
        if (data.data === currentModel.Id)
        {
            await OBR.popover.close(Constants.PINNEDID);
        }
    });

    function RefreshCounter()
    {
        switch (modelType.toLocaleLowerCase())
        {
            case "clock":
                ShowClock();
                break;
            case "checkbox":
                ShowBox();
                break;
            case "counter":
                ShowCounter();
                break;
        }

    }

    function ShowClock()
    {
        const pinnedClock = document.createElement('div');
        pinnedClock.classList.add("pinned-window");
        pinnedClock.classList.add("clock-window");
        const element = CLOCKS.GetClockSlices(parseInt(currentModel.Total), true);
        pinnedClock.appendChild(element);
        const htmlSlices = pinnedClock.querySelectorAll<SVGPathElement>('.slice');
        currentModel.Marked.forEach(mark =>
        {
            const slice = Array.from(htmlSlices).find(slice => slice.getAttribute('cut') === mark.key);
            if (slice)
            {
                slice.setAttribute('toggled', mark.value);
                if (mark.value === "1")
                {
                    slice.classList.add("path-selected");
                } else
                {
                    slice.classList.remove("path-selected");
                }
            }
        });
        pinnedClock.setAttribute("clock-name", currentModel.Name);
        const name = document.createElement('div');
        name.innerText = currentModel.Name;
        name.classList.add("name-plate");

        const mainbody = document.getElementById('pinnedMain')!;
        mainbody.replaceChildren(pinnedClock);
        mainbody.prepend(name);
    }

    function ShowBox()
    {
        const pinnedBox = document.createElement('div');
        pinnedBox.classList.add("pinned-window");
        pinnedBox.classList.add("checkbox-window");
        const element = CHECKBOX.GetSvgCheckboxes(parseInt(currentModel.Total), true);
        pinnedBox.appendChild(element);
        const htmlSlices = pinnedBox.querySelectorAll<SVGPathElement>('.checkmark');
        currentModel.Marked.forEach(mark =>
        {
            const checkbox = Array.from(htmlSlices).find(check => check.getAttribute('check') === mark.key);
            if (checkbox)
            {
                checkbox.setAttribute('toggled', mark.value);
                if (mark.value === "1")
                {
                    checkbox.classList.add("check-selected");
                } else
                {
                    checkbox.classList.remove("check-selected");
                }
            }
        });

        pinnedBox.setAttribute("checkbox-name", currentModel.Name);
        const name = document.createElement('div');
        name.innerText = currentModel.Name;
        name.classList.add("name-plate");

        const mainbody = document.getElementById('pinnedMain')!;
        mainbody.replaceChildren(pinnedBox);
        mainbody.prepend(name);
    }

    function ShowCounter()
    {
        const pinnedNumber = document.createElement('div');
        pinnedNumber.classList.add("pinned-window");
        pinnedNumber.classList.add("counter-window");
        const element = COUNTERS.GetSvgNumberCounter(true);
        pinnedNumber.appendChild(element);

        const displayText = pinnedNumber.querySelector<SVGTextElement>('.display-text');
        if (displayText)
        {
            displayText.textContent = currentModel.Total.toString();
        }

        pinnedNumber.setAttribute("counter-name", currentModel.Name);
        const name = document.createElement('div');
        name.innerText = currentModel.Name;
        name.classList.add("name-plate");

        const mainbody = document.getElementById('pinnedMain')!;
        mainbody.replaceChildren(pinnedNumber);
        mainbody.prepend(name);
    }
});