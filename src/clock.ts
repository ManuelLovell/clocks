import { Constants } from "./utilities/bsConstants";

class Clocks
{
    defaultClock = 6;
    carouselIndex = 0;
    saveState: SaveState[];

    ADD = document.getElementById('clockAdd') as HTMLButtonElement;
    REMOVE = document.getElementById('clockRemove') as HTMLButtonElement;
    NEXT = document.getElementById('clockNext') as HTMLButtonElement;
    PREV = document.getElementById('clockPrevious') as HTMLButtonElement;
    NAME = document.getElementById('clockName') as HTMLInputElement;
    NUMBER = document.getElementById('clockSlices') as HTMLInputElement;

    DISPLAYCONTAINER = document.getElementById('clockDisplay') as HTMLDivElement;
    CAROUSELTRACK = document.getElementById('clockCarousel') as HTMLDivElement;

    constructor()
    {
        this.saveState = [];
        this.localLoad();
    }

    public SetupControls()
    {
        this.ADD.onclick = () =>
        {
            // Add new clock
            const newClock = document.createElement('div');
            newClock.id = crypto.randomUUID();
            newClock.classList.add("clock-selected");
            newClock.classList.add("carousel-item");
            newClock.appendChild(this.getClockSlices(this.defaultClock));
            this.CAROUSELTRACK.appendChild(newClock);

            // Save State
            const newState: SaveState = { Id: newClock.id, Marked: [], Name: "", Total: this.defaultClock };
            this.saveState.push(newState);

            // Find/Remove old selected
            const oldSelected = this.CAROUSELTRACK.getElementsByClassName('clock-selected');
            if (oldSelected.length > 0)
            {
                oldSelected[0].classList.remove('clock-selected');
            }

            // Apply new selected
            const carouselItems = this.CAROUSELTRACK.children;
            this.carouselIndex = carouselItems.length - 1;
            const newItem = carouselItems[this.carouselIndex];
            newItem.classList.add("clock-selected");
            this.updateCarousel();
            this.localSave();
        };
        this.REMOVE.onclick = () =>
        {
            const selected = this.CAROUSELTRACK.getElementsByClassName('clock-selected');
            if (selected.length > 0)
            {
                this.saveState = this.saveState.filter(x => x.Id !== selected[0].id);
                selected[0].remove();
            }

            if (this.CAROUSELTRACK.children.length > 0)
            {
                // Show the next runner up
                // Apply new selected
                const carouselItems = this.CAROUSELTRACK.children;
                this.carouselIndex--;
                if (this.carouselIndex >= 0)
                {
                    const newVisible = carouselItems[this.carouselIndex];
                    newVisible.classList.add("clock-selected");
                    this.updateCarousel();
                }
                else if (carouselItems.length > 0)
                {
                    this.carouselIndex = carouselItems.length - 1;
                    const newVisible = carouselItems[this.carouselIndex];
                    newVisible.classList.add("clock-selected");
                    this.updateCarousel();
                } else this.carouselIndex = 0;
            }
            this.localSave();
        };
        this.PREV.onclick = () =>
        {
            const carouselItems = this.CAROUSELTRACK.children;
            this.carouselIndex = (this.carouselIndex - 1 + carouselItems.length) % carouselItems.length;
            this.updateCarousel();
        }
        this.NEXT.onclick = () =>
        {
            const carouselItems = this.CAROUSELTRACK.children;
            this.carouselIndex = (this.carouselIndex + 1) % carouselItems.length;
            this.updateCarousel();
        }
        this.NAME.onblur = () =>
        {
            if (this.selectedClock())
            {
                const clockName = this.NAME.value;

                this.selectedSave().Name = clockName;
                this.selectedClock().setAttribute("clock-name", clockName);
            }
            this.localSave();
        };
        this.NUMBER.onblur = () =>
        {
            const newValue = parseInt(this.NUMBER.value);
            if (newValue > 0 && this.selectedClock() !== undefined)
            {
                this.selectedSave().Total = newValue;
                this.selectedClock().replaceChildren();
                this.selectedClock().appendChild(this.getClockSlices(newValue));
            }
            this.localSave();
        };
    }

    private updateCarousel()
    {
        const carouselItems = this.CAROUSELTRACK.children;
        const newVisible = carouselItems[this.carouselIndex];
        if (!newVisible) return;
        
        newVisible.classList.add("clock-selected");
        const itemWidth = carouselItems[0].clientWidth;
        this.CAROUSELTRACK.style.transform = `translateX(-${this.carouselIndex * itemWidth}px)`;
        this.NAME.value = this.selectedClock().getAttribute("clock-name") ?? "";
    };

    private getClockSlices(numSlices: number)
    {
        const fixedNumber = Math.min(numSlices, 100);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 200 200");
        svg.setAttribute("width", "200px");
        svg.setAttribute("height", "200px");
        svg.setAttribute("class", "clocks-svg");

        const radius = 90;
        const centerX = 100;
        const centerY = 100;
        const angleStep = (2 * Math.PI) / fixedNumber;

        for (let i = 0; i < fixedNumber; i++)
        {
            const startAngle = i * angleStep;
            const endAngle = (i + 1) * angleStep;
            const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

            const startX = centerX + Math.cos(startAngle) * radius;
            const startY = centerY + Math.sin(startAngle) * radius;
            const endX = centerX + Math.cos(endAngle) * radius;
            const endY = centerY + Math.sin(endAngle) * radius;

            const pathData = [
                `M ${centerX},${centerY}`,
                `L ${startX},${startY}`,
                `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
                `Z`
            ].join(" ");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("class", "slice");
            path.setAttribute("cut", i.toString());
            path.setAttribute("toggled", "0");
            path.setAttribute("stroke", `hsl(${(360 / fixedNumber) * i}, 70%, 70%)`);
            path.addEventListener("click", () => toggleSlice(path));

            svg.appendChild(path);
        }

        const toggleSlice = (path: SVGPathElement) => 
        {
            path.classList.toggle("path-selected");
            path.setAttribute("toggled", path.classList.contains("path-selected") ? "1" : "0");

            const newSliceData: { key: string, value: string }[] = [];
            const htmlSlices = this.selectedClock().querySelectorAll<SVGPathElement>('.slice');
            htmlSlices.forEach(slice =>
            {
                const cutValue = slice.getAttribute('cut')!;
                const toggledState = slice.getAttribute('toggled')!;

                newSliceData.push({
                    key: cutValue,
                    value: toggledState
                });
            });

            this.selectedSave().Marked = newSliceData;
            this.localSave();
            //console.log(`Slice Toggled: ${path.getAttribute("cut")} = ${path.classList.contains("path-selected")}`);
        }
        return svg;
    }

    private selectedClock = () => this.CAROUSELTRACK.children[this.carouselIndex] as HTMLElement;
    private selectedSave = () => this.saveState.find(x => x.Id === this.selectedClock().id) as SaveState;
    private localSave = () => localStorage.setItem(Constants.EXTENSIONID + "_Clocks", JSON.stringify(this.saveState));
    private localLoad()
    {
        const saveData = localStorage.getItem(Constants.EXTENSIONID + "_Clocks");
        if (saveData)
        {
            const unpacked = JSON.parse(saveData) as SaveState[]; // Parse the saved data back into an array of SaveState

            this.saveState = [];
            this.CAROUSELTRACK.innerHTML = '';

            unpacked.forEach((state, _index) =>
            {
                const newClock = document.createElement('div');
                newClock.id = state.Id;
                newClock.classList.add("carousel-item");
                newClock.appendChild(this.getClockSlices(state.Total));

                const htmlSlices = newClock.querySelectorAll<SVGPathElement>('.slice');
                state.Marked.forEach(mark =>
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

                newClock.setAttribute("clock-name", state.Name);
                this.saveState.push(state);

                this.CAROUSELTRACK.appendChild(newClock);
            });

            if (this.CAROUSELTRACK.children.length > 0)
            {
                this.carouselIndex = 0;
                this.updateCarousel();
            }
        }
    }

}

export const CLOCKS = new Clocks();