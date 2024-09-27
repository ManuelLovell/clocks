
class Clocks
{
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
            newClock.appendChild(this.getClockSlices(6));
            this.CAROUSELTRACK.appendChild(newClock);

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
        };
        this.REMOVE.onclick = () =>
        {
            const selected = this.CAROUSELTRACK.getElementsByClassName('clock-selected');
            if (selected.length > 0)
            {
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
                this.selectedClock().setAttribute("clock-name", clockName);
            }
        };
        this.NUMBER.onblur = () =>
        {
            const newValue = parseInt(this.NUMBER.value);
            if (newValue > 0 && this.selectedClock() !== undefined)
            {
                this.selectedClock().replaceChildren();
                this.selectedClock().appendChild(this.getClockSlices(newValue));
            }
        };
    }

    private updateCarousel()
    {
        const carouselItems = this.CAROUSELTRACK.children;
        const newVisible = carouselItems[this.carouselIndex];
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
            //console.log(`Slice Toggled: ${path.getAttribute("cut")} = ${path.classList.contains("path-selected")}`);
        }
        return svg;
    }

    private selectedClock = () => this.CAROUSELTRACK.children[this.carouselIndex] as HTMLElement;
}

export const CLOCKS = new Clocks();