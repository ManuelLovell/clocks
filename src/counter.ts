import { Constants } from "./utilities/bsConstants";

class Counters
{
    carouselIndex = 0;
    saveState: SaveState[];

    ADD = document.getElementById('counterAdd') as HTMLButtonElement;
    REMOVE = document.getElementById('counterRemove') as HTMLButtonElement;
    NEXT = document.getElementById('counterNext') as HTMLButtonElement;
    PREV = document.getElementById('counterPrevious') as HTMLButtonElement;
    NAME = document.getElementById('counterName') as HTMLInputElement;
    RESET = document.getElementById('counterReset') as HTMLButtonElement;

    DISPLAYCONTAINER = document.getElementById('counterDisplay') as HTMLDivElement;
    CAROUSELTRACK = document.getElementById('counterCarousel') as HTMLDivElement;

    constructor()
    {
        this.saveState = [];
        this.localLoad();
    }

    public SetupControls()
    {
        this.ADD.onclick = () =>
        {
            // Add new counter
            const newCounter = document.createElement('div');
            newCounter.id = crypto.randomUUID();
            newCounter.classList.add("counter-selected");
            newCounter.classList.add("carousel-item");
            newCounter.appendChild(this.getSvgNumberCounter());
            this.CAROUSELTRACK.appendChild(newCounter);

            // Save State
            const newState: SaveState = { Id: newCounter.id, Marked: [], Name: "", Total: 0 };
            this.saveState.push(newState);

            // Find/Remove old selected
            const oldSelected = this.CAROUSELTRACK.getElementsByClassName('counter-selected');
            if (oldSelected.length > 0)
            {
                oldSelected[0].classList.remove('counter-selected');
            }

            // Apply new selected
            const carouselItems = this.CAROUSELTRACK.children;
            this.carouselIndex = carouselItems.length - 1;
            const newItem = carouselItems[this.carouselIndex];
            newItem.classList.add("counter-selected");
            this.updateCarousel();
            this.localSave();
        };
        this.REMOVE.onclick = () =>
        {
            const selected = this.CAROUSELTRACK.getElementsByClassName('counter-selected');
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
                    newVisible.classList.add("counter-selected");
                    this.updateCarousel();
                }
                else if (carouselItems.length > 0)
                {
                    this.carouselIndex = carouselItems.length - 1;
                    const newVisible = carouselItems[this.carouselIndex];
                    newVisible.classList.add("counter-selected");
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
            if (this.selectedCounter())
            {
                const counterName = this.NAME.value;
                this.selectedSave().Name = counterName;
                this.selectedCounter().setAttribute("counter-name", counterName);
            }
            this.localSave();
        };
        this.RESET.onclick = () =>
        {
            if (this.selectedCounter().querySelector('.display-text')?.textContent)
            {
                this.selectedCounter().querySelector('.display-text')!.textContent = "0";
                this.localSave();
            }
        };
    }

    private updateCarousel()
    {
        const carouselItems = this.CAROUSELTRACK.children;
        const newVisible = carouselItems[this.carouselIndex];
        if (!newVisible) return;

        newVisible.classList.add("counter-selected");
        const itemWidth = carouselItems[0].clientWidth;
        this.CAROUSELTRACK.style.transform = `translateX(-${this.carouselIndex * itemWidth}px)`;
        this.NAME.value = this.selectedCounter().getAttribute("counter-name") ?? "";
    };

    private getSvgNumberCounter(): SVGSVGElement
    {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const width = 120;
        const height = 240;
        const buttonWidth = 80;
        const displayWidth = 100;
        const crementButtonHeight = 30;
        const buttonHeight = 60;
        const spacing = 5; // Space between buttons and display

        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("width", `${width}px`);
        svg.setAttribute("height", `${height}px`);

        // Counter display
        const displayGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        displayGroup.setAttribute("transform", `translate(10, ${buttonHeight + spacing})`);

        const displayRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        displayRect.setAttribute("width", `${displayWidth}`);
        displayRect.setAttribute("height", `${buttonHeight}`);
        displayRect.setAttribute("stroke-width", "2");
        displayRect.setAttribute("rx", "6");
        displayRect.setAttribute("ry", "6");
        displayRect.setAttribute("class", "display-rect");

        const displayText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        displayText.setAttribute("x", `${displayWidth / 2}`);
        displayText.setAttribute("y", `${buttonHeight / 2 + 10}`);
        displayText.setAttribute("text-anchor", "middle");
        displayText.setAttribute("font-size", "32");
        displayText.setAttribute("font-family", "Arial, sans-serif");
        displayText.setAttribute("class", "display-text");
        displayText.textContent = "0";

        displayGroup.appendChild(displayRect);
        displayGroup.appendChild(displayText);

        // Increment button
        const incrementGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        incrementGroup.setAttribute("transform", `translate(20, 30)`);

        const incrementRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        incrementRect.setAttribute("width", `${buttonWidth}`);
        incrementRect.setAttribute("height", `${crementButtonHeight}`);
        incrementRect.setAttribute("stroke-width", "2");
        incrementRect.setAttribute("rx", "6");
        incrementRect.setAttribute("ry", "6");
        incrementRect.setAttribute("class", "clicker-control");

        const incrementText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        incrementText.setAttribute("x", `${buttonWidth / 2}`);
        incrementText.setAttribute("y", `${crementButtonHeight / 2 + 10}`);
        incrementText.setAttribute("text-anchor", "middle");
        incrementText.setAttribute("font-size", "24");
        incrementText.setAttribute("font-family", "Arial, sans-serif");
        incrementText.setAttribute("class", "clicker-control");
        incrementText.textContent = "+";

        incrementGroup.appendChild(incrementRect);
        incrementGroup.appendChild(incrementText);

        // Decrement button
        const decrementGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        decrementGroup.setAttribute("transform", `translate(20, ${2 * buttonHeight + spacing * 2})`);

        const decrementRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        decrementRect.setAttribute("width", `${buttonWidth}`);
        decrementRect.setAttribute("height", `${crementButtonHeight}`);
        decrementRect.setAttribute("stroke-width", "2");
        decrementRect.setAttribute("rx", "6");
        decrementRect.setAttribute("ry", "6");
        decrementRect.setAttribute("class", "clicker-control");

        const decrementText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        decrementText.setAttribute("x", `${buttonWidth / 2}`);
        decrementText.setAttribute("y", `${crementButtonHeight / 2 + 10}`);
        decrementText.setAttribute("text-anchor", "middle");
        decrementText.setAttribute("font-size", "24");
        decrementText.setAttribute("font-family", "Arial, sans-serif");
        decrementText.setAttribute("class", "clicker-control");
        decrementText.textContent = "-";

        decrementGroup.appendChild(decrementRect);
        decrementGroup.appendChild(decrementText);

        // Event handlers
        incrementGroup.addEventListener("click", () =>
        {
            let current = parseInt(displayText.textContent ?? "0");
            current++;
            displayText.textContent = current.toString();
            SaveState();
        });

        decrementGroup.addEventListener("click", () =>
        {
            let current = parseInt(displayText.textContent ?? "0");
            current--;
            displayText.textContent = current.toString();
            SaveState();
        });

        function SaveState()
        {
            COUNTERS.selectedSave().Total = parseInt(displayText.textContent ?? "0");
            COUNTERS.localSave();
        }

        svg.appendChild(incrementGroup);
        svg.appendChild(displayGroup);
        svg.appendChild(decrementGroup);

        return svg;
    }


    private selectedCounter = () => this.CAROUSELTRACK.children[this.carouselIndex] as HTMLElement;
    private selectedSave = () => this.saveState.find(x => x.Id === this.selectedCounter().id) as SaveState;
    private localSave = () => localStorage.setItem(Constants.EXTENSIONID + "_Counters", JSON.stringify(this.saveState));
    private localLoad()
    {
        const saveData = localStorage.getItem(Constants.EXTENSIONID + "_Counters");
        if (saveData)
        {
            const unpacked = JSON.parse(saveData) as SaveState[]; // Parse the saved data back into an array of SaveState

            this.saveState = [];
            this.CAROUSELTRACK.innerHTML = '';

            unpacked.forEach((state, _index) =>
            {
                const newCounter = document.createElement('div');
                newCounter.id = state.Id;
                newCounter.classList.add("carousel-item");
                newCounter.appendChild(this.getSvgNumberCounter());

                const displayText = newCounter.querySelector<SVGTextElement>('.display-text');
                if (displayText)
                {
                    displayText.textContent = state.Total.toString();
                }

                newCounter.setAttribute("counter-name", state.Name);
                this.saveState.push(state);

                this.CAROUSELTRACK.appendChild(newCounter);
            });

            if (this.CAROUSELTRACK.children.length > 0)
            {
                this.carouselIndex = 0;
                this.updateCarousel();
            }
        }
    }
}

export const COUNTERS = new Counters();