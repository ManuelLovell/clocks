import{O as o,C as a}from"./bsConstants-G1WsuQMq.js";const d=document.querySelector("#bs-whatsnew"),i=document.querySelector("#bs-whatsnew-notes");d.innerHTML=`
  <div id="newsContainer">
    <h1>Count! 8/7</h1>
    Honestly? I have no clue. I'm not even sure why I did this.
    </br> But here we are.
    </div>
`;o.onReady(async()=>{const n=window.location.search,e=new URLSearchParams(n).get("subscriber")==="true";i.innerHTML=`
    <div id="footButtonContainer">
        <button id="discordButton" type="button" title="Join the Owlbear-Rodeo Discord"><embed class="svg discord" src="/w-discord.svg" /></button>
        <button id="patreonButton" type="button" ${e?'title="Thank you for subscribing!"':'title="Check out the Battle-System Patreon"'}>
        ${e?'<embed id="patreonLogo" class="svg thankyou" src="/w-thankyou.svg" />':'<embed id="patreonLogo" class="svg patreon" src="/w-patreon.png" />'}</button>
    </div>
    <button id="closeButton" type="button" title="Close this window"><embed class="svg close" src="/w-close.svg" /></button>
    `;const s=document.getElementById("closeButton");s.onclick=async()=>{await o.modal.close(a.EXTENSIONWHATSNEW)};const r=document.getElementById("discordButton");r.onclick=async t=>{t.preventDefault(),window.open("https://discord.gg/ANZKDmWzr6","_blank")};const c=document.getElementById("patreonButton");c.onclick=async t=>{t.preventDefault(),window.open("https://www.patreon.com/battlesystem","_blank")}});
