import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "./bsConstants";

export function GetWhatsNewButton()
{
    const newImgElement = document.createElement('img');
    newImgElement.id = "whatsNewButton";
    newImgElement.style.cursor = "pointer";
    newImgElement.setAttribute('class', 'icon');
    newImgElement.classList.add('clickable');
    newImgElement.setAttribute('title', 'Whats New?');
    newImgElement.setAttribute('src', '/w-info.svg');
    newImgElement.onclick = async function ()
    {
        await OBR.modal.open({
            id: Constants.EXTENSIONWHATSNEW,
            url: `/src/whatsnew/whatsnew.html?subscriber=${false}`,
            height: 500,
            width: 350,
        });
    };

    return newImgElement;
}