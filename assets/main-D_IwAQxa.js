import{O as k,C as L}from"./bsConstants-G1WsuQMq.js";function y(){const h=document.createElement("img");return h.id="whatsNewButton",h.style.cursor="pointer",h.setAttribute("class","icon"),h.classList.add("clickable"),h.setAttribute("title","Whats New?"),h.setAttribute("src","/w-info.svg"),h.onclick=async function(){await k.modal.open({id:L.EXTENSIONWHATSNEW,url:"/src/whatsnew/whatsnew.html?subscriber=false",height:500,width:350})},h}class S{carouselIndex=0;ADD=document.getElementById("clockAdd");REMOVE=document.getElementById("clockRemove");NEXT=document.getElementById("clockNext");PREV=document.getElementById("clockPrevious");NAME=document.getElementById("clockName");NUMBER=document.getElementById("clockSlices");DISPLAYCONTAINER=document.getElementById("clockDisplay");CAROUSELTRACK=document.getElementById("clockCarousel");constructor(){}SetupControls(){this.ADD.onclick=()=>{const e=document.createElement("div");e.id=crypto.randomUUID(),e.classList.add("clock-selected"),e.classList.add("carousel-item"),e.appendChild(this.getClockSlices(6)),this.CAROUSELTRACK.appendChild(e);const t=this.CAROUSELTRACK.getElementsByClassName("clock-selected");t.length>0&&t[0].classList.remove("clock-selected");const s=this.CAROUSELTRACK.children;this.carouselIndex=s.length-1,s[this.carouselIndex].classList.add("clock-selected"),this.updateCarousel()},this.REMOVE.onclick=()=>{const e=this.CAROUSELTRACK.getElementsByClassName("clock-selected");if(e.length>0&&e[0].remove(),this.CAROUSELTRACK.children.length>0){const t=this.CAROUSELTRACK.children;this.carouselIndex--,this.carouselIndex>=0?(t[this.carouselIndex].classList.add("clock-selected"),this.updateCarousel()):t.length>0?(this.carouselIndex=t.length-1,t[this.carouselIndex].classList.add("clock-selected"),this.updateCarousel()):this.carouselIndex=0}},this.PREV.onclick=()=>{const e=this.CAROUSELTRACK.children;this.carouselIndex=(this.carouselIndex-1+e.length)%e.length,this.updateCarousel()},this.NEXT.onclick=()=>{const e=this.CAROUSELTRACK.children;this.carouselIndex=(this.carouselIndex+1)%e.length,this.updateCarousel()},this.NAME.onblur=()=>{if(this.selectedClock()){const e=this.NAME.value;this.selectedClock().setAttribute("clock-name",e)}},this.NUMBER.onblur=()=>{const e=parseInt(this.NUMBER.value);e>0&&this.selectedClock()!==void 0&&(this.selectedClock().replaceChildren(),this.selectedClock().appendChild(this.getClockSlices(e)))}}updateCarousel(){const e=this.CAROUSELTRACK.children;e[this.carouselIndex].classList.add("clock-selected");const s=e[0].clientWidth;this.CAROUSELTRACK.style.transform=`translateX(-${this.carouselIndex*s}px)`,this.NAME.value=this.selectedClock().getAttribute("clock-name")??""}getClockSlices(e){const t=document.createElementNS("http://www.w3.org/2000/svg","svg");t.setAttribute("aria-hidden","true"),t.setAttribute("viewBox","0 0 200 200"),t.setAttribute("width","200px"),t.setAttribute("height","200px"),t.setAttribute("class","clocks-svg");const s=90,n=100,g=100,r=2*Math.PI/e;for(let o=0;o<e;o++){const d=o*r,c=(o+1)*r,a=c-d<=Math.PI?0:1,m=n+Math.cos(d)*s,u=g+Math.sin(d)*s,l=n+Math.cos(c)*s,i=g+Math.sin(c)*s,C=[`M ${n},${g}`,`L ${m},${u}`,`A ${s},${s} 0 ${a} 1 ${l},${i}`,"Z"].join(" "),A=document.createElementNS("http://www.w3.org/2000/svg","path");A.setAttribute("d",C),A.setAttribute("class","slice"),A.setAttribute("cut",o.toString()),A.setAttribute("toggled","0"),A.setAttribute("stroke",`hsl(${360/e*o}, 70%, 70%)`),A.addEventListener("click",()=>E(A)),t.appendChild(A)}const E=o=>{o.classList.toggle("path-selected")};return t}selectedClock=()=>this.CAROUSELTRACK.children[this.carouselIndex]}const N=new S;class v{carouselIndex=0;ADD=document.getElementById("checkboxAdd");REMOVE=document.getElementById("checkboxRemove");NEXT=document.getElementById("checkboxNext");PREV=document.getElementById("checkboxPrevious");NAME=document.getElementById("checkboxName");NUMBER=document.getElementById("checkboxSlices");DISPLAYCONTAINER=document.getElementById("checkboxDisplay");CAROUSELTRACK=document.getElementById("checkboxCarousel");constructor(){}SetupControls(){this.ADD.onclick=()=>{const e=document.createElement("div");e.id=crypto.randomUUID(),e.classList.add("checkbox-selected"),e.classList.add("carousel-item"),e.appendChild(this.getSvgCheckboxes(4)),this.CAROUSELTRACK.appendChild(e);const t=this.CAROUSELTRACK.getElementsByClassName("checkbox-selected");t.length>0&&t[0].classList.remove("checkbox-selected");const s=this.CAROUSELTRACK.children;this.carouselIndex=s.length-1,s[this.carouselIndex].classList.add("checkbox-selected"),this.updateCarousel()},this.REMOVE.onclick=()=>{const e=this.CAROUSELTRACK.getElementsByClassName("checkbox-selected");if(e.length>0&&e[0].remove(),this.CAROUSELTRACK.children.length>0){const t=this.CAROUSELTRACK.children;this.carouselIndex--,this.carouselIndex>=0?(t[this.carouselIndex].classList.add("checkbox-selected"),this.updateCarousel()):t.length>0?(this.carouselIndex=t.length-1,t[this.carouselIndex].classList.add("checkbox-selected"),this.updateCarousel()):this.carouselIndex=0}},this.PREV.onclick=()=>{const e=this.CAROUSELTRACK.children;this.carouselIndex=(this.carouselIndex-1+e.length)%e.length,this.updateCarousel()},this.NEXT.onclick=()=>{const e=this.CAROUSELTRACK.children;this.carouselIndex=(this.carouselIndex+1)%e.length,this.updateCarousel()},this.NAME.onblur=()=>{if(this.selectedCheckbox()){const e=this.NAME.value;this.selectedCheckbox().setAttribute("checkbox-name",e)}},this.NUMBER.onblur=()=>{const e=parseInt(this.NUMBER.value);e>0&&this.selectedCheckbox()!==void 0&&(this.selectedCheckbox().replaceChildren(),this.selectedCheckbox().appendChild(this.getSvgCheckboxes(e)))}}updateCarousel(){const e=this.CAROUSELTRACK.children;e[this.carouselIndex].classList.add("checkbox-selected");const s=e[0].clientWidth;this.CAROUSELTRACK.style.transform=`translateX(-${this.carouselIndex*s}px)`,this.NAME.value=this.selectedCheckbox().getAttribute("checkbox-name")??""}getSvgCheckboxes(e){const t=Math.min(e,100),s=document.createElementNS("http://www.w3.org/2000/svg","svg"),n=Math.ceil(Math.sqrt(t)),g=Math.ceil(t/n),r=40,E=n*r,o=g*r;s.setAttribute("aria-hidden","true"),s.setAttribute("viewBox",`0 0 ${E} ${o}`),s.setAttribute("width",`${E}px`),s.setAttribute("height",`${o}px`),s.setAttribute("class","checkbox-svg");for(let c=0;c<t;c++){const a=document.createElementNS("http://www.w3.org/2000/svg","g"),m=c%n,u=Math.floor(c/n);a.setAttribute("transform",`translate(${m*r}, ${u*r})`);const l=document.createElementNS("http://www.w3.org/2000/svg","rect");l.setAttribute("x","5"),l.setAttribute("y","5"),l.setAttribute("width","30"),l.setAttribute("height","30"),l.setAttribute("fill","transparent"),l.setAttribute("stroke-width","2"),l.setAttribute("rx","6"),l.setAttribute("ry","6"),l.setAttribute("class","checkbox-rect");const i=document.createElementNS("http://www.w3.org/2000/svg","path");i.setAttribute("d","M221.65723,34.34326A8.00246,8.00246,0,0,0,216,32h-.02539l-63.79883.20117A8.00073,8.00073,0,0,0,146.0332,35.106L75.637,120.32275,67.31348,111.999A16.02162,16.02162,0,0,0,44.68555,112L32.001,124.68555A15.99888,15.99888,0,0,0,32,147.31348l20.88672,20.88769L22.94531,198.14258a16.01777,16.01777,0,0,0,.001,22.62695l12.28418,12.28418a16.00007,16.00007,0,0,0,22.62793,0L87.79883,203.1123,108.68652,224.001A16.02251,16.02251,0,0,0,131.31445,224L143.999,211.31445A15.99888,15.99888,0,0,0,144,188.68652l-8.32324-8.32324,85.21679-70.39648a8.00125,8.00125,0,0,0,2.90528-6.14258L224,40.02539A8.001,8.001,0,0,0,221.65723,34.34326Zm-13.84668,65.67822-83.49829,68.97706L111.314,156l54.34327-54.34277a8.00053,8.00053,0,0,0-11.31446-11.31446L100,144.686,87.00195,131.6875,155.97852,48.189l51.99609-.16357Z"),i.setAttribute("fill","transparent"),i.setAttribute("stroke","none"),i.setAttribute("class","checkmark"),i.setAttribute("transform",`translate(5, 5) scale(${.115})`),a.appendChild(l),a.appendChild(i),a.addEventListener("click",()=>d(i)),s.appendChild(a)}const d=c=>{c.classList.toggle("check-selected")};return s}selectedCheckbox=()=>this.CAROUSELTRACK.children[this.carouselIndex]}const O=new v;class T{carouselIndex=0;ADD=document.getElementById("counterAdd");REMOVE=document.getElementById("counterRemove");NEXT=document.getElementById("counterNext");PREV=document.getElementById("counterPrevious");NAME=document.getElementById("counterName");RESET=document.getElementById("counterReset");DISPLAYCONTAINER=document.getElementById("counterDisplay");CAROUSELTRACK=document.getElementById("counterCarousel");constructor(){}SetupControls(){this.ADD.onclick=()=>{const e=document.createElement("div");e.id=crypto.randomUUID(),e.classList.add("counter-selected"),e.classList.add("carousel-item"),e.appendChild(this.getSvgNumberCounter()),this.CAROUSELTRACK.appendChild(e);const t=this.CAROUSELTRACK.getElementsByClassName("counter-selected");t.length>0&&t[0].classList.remove("counter-selected");const s=this.CAROUSELTRACK.children;this.carouselIndex=s.length-1,s[this.carouselIndex].classList.add("counter-selected"),this.updateCarousel()},this.REMOVE.onclick=()=>{const e=this.CAROUSELTRACK.getElementsByClassName("counter-selected");if(e.length>0&&e[0].remove(),this.CAROUSELTRACK.children.length>0){const t=this.CAROUSELTRACK.children;this.carouselIndex--,this.carouselIndex>=0?(t[this.carouselIndex].classList.add("counter-selected"),this.updateCarousel()):t.length>0?(this.carouselIndex=t.length-1,t[this.carouselIndex].classList.add("counter-selected"),this.updateCarousel()):this.carouselIndex=0}},this.PREV.onclick=()=>{const e=this.CAROUSELTRACK.children;this.carouselIndex=(this.carouselIndex-1+e.length)%e.length,this.updateCarousel()},this.NEXT.onclick=()=>{const e=this.CAROUSELTRACK.children;this.carouselIndex=(this.carouselIndex+1)%e.length,this.updateCarousel()},this.NAME.onblur=()=>{if(this.selectedCounter()){const e=this.NAME.value;this.selectedCounter().setAttribute("counter-name",e)}},this.RESET.onclick=()=>{this.selectedCounter().querySelector(".display-text")?.textContent&&(this.selectedCounter().querySelector(".display-text").textContent="0")}}updateCarousel(){const e=this.CAROUSELTRACK.children;e[this.carouselIndex].classList.add("counter-selected");const s=e[0].clientWidth;this.CAROUSELTRACK.style.transform=`translateX(-${this.carouselIndex*s}px)`,this.NAME.value=this.selectedCounter().getAttribute("counter-name")??""}getSvgNumberCounter(){const e=document.createElementNS("http://www.w3.org/2000/svg","svg"),t=200,s=100,n=40,g=100,r=60,E=10;e.setAttribute("aria-hidden","true"),e.setAttribute("viewBox",`0 0 ${t} ${s}`),e.setAttribute("width",`${t}px`),e.setAttribute("height",`${s}px`);const o=document.createElementNS("http://www.w3.org/2000/svg","g");o.setAttribute("transform",`translate(${n+E}, 20)`);const d=document.createElementNS("http://www.w3.org/2000/svg","rect");d.setAttribute("width",`${g}`),d.setAttribute("height",`${r}`),d.setAttribute("stroke-width","2"),d.setAttribute("rx","6"),d.setAttribute("ry","6"),d.setAttribute("class","display-rect");const c=document.createElementNS("http://www.w3.org/2000/svg","text");c.setAttribute("x",`${g/2}`),c.setAttribute("y",`${r/2+10}`),c.setAttribute("text-anchor","middle"),c.setAttribute("font-size","32"),c.setAttribute("font-family","Arial, sans-serif"),c.setAttribute("class","display-text"),c.textContent="0",o.appendChild(d),o.appendChild(c);const a=document.createElementNS("http://www.w3.org/2000/svg","g");a.setAttribute("transform",`translate(${t-n}, 20)`);const m=document.createElementNS("http://www.w3.org/2000/svg","rect");m.setAttribute("width",`${n}`),m.setAttribute("height",`${r}`),m.setAttribute("stroke-width","2"),m.setAttribute("rx","6"),m.setAttribute("ry","6"),m.setAttribute("class","clicker-control");const u=document.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("x",`${n/2}`),u.setAttribute("y",`${r/2+10}`),u.setAttribute("text-anchor","middle"),u.setAttribute("font-size","24"),u.setAttribute("font-family","Arial, sans-serif"),u.setAttribute("class","clicker-control"),u.textContent="+",a.appendChild(m),a.appendChild(u);const l=document.createElementNS("http://www.w3.org/2000/svg","g");l.setAttribute("transform","translate(0, 20)");const i=document.createElementNS("http://www.w3.org/2000/svg","rect");i.setAttribute("width",`${n}`),i.setAttribute("height",`${r}`),i.setAttribute("stroke-width","2"),i.setAttribute("rx","6"),i.setAttribute("ry","6"),i.setAttribute("class","clicker-control");const C=document.createElementNS("http://www.w3.org/2000/svg","text");return C.setAttribute("x",`${n/2}`),C.setAttribute("y",`${r/2+10}`),C.setAttribute("text-anchor","middle"),C.setAttribute("font-size","24"),C.setAttribute("font-family","Arial, sans-serif"),C.setAttribute("class","clicker-control"),C.textContent="-",l.appendChild(i),l.appendChild(C),a.addEventListener("click",()=>{let A=parseInt(c.textContent??"0");A++,c.textContent=A.toString()}),l.addEventListener("click",()=>{}),e.appendChild(l),e.appendChild(o),e.appendChild(a),e}selectedCounter=()=>this.CAROUSELTRACK.children[this.carouselIndex]}const f=new T,b=document.getElementById("clockButton"),x=document.getElementById("clockContainer"),p=document.getElementById("checkboxButton"),I=document.getElementById("checkboxContainer"),w=document.getElementById("counterButton"),R=document.getElementById("numberContainer");k.onReady(async()=>{N.SetupControls(),O.SetupControls(),f.SetupControls(),U(),B()});function B(){document.getElementById("whatsNewContainer").appendChild(y())}function U(){b.onclick=()=>{b.classList.add("selected"),x.style.display="grid",p.classList.remove("selected"),I.style.display="none",w.classList.remove("selected"),R.style.display="none"},p.onclick=()=>{p.classList.add("selected"),I.style.display="grid",b.classList.remove("selected"),x.style.display="none",w.classList.remove("selected"),R.style.display="none"},w.onclick=()=>{w.classList.add("selected"),R.style.display="grid",p.classList.remove("selected"),I.style.display="none",b.classList.remove("selected"),x.style.display="none"}}
