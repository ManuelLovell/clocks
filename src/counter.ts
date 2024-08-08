
class Counters
{
    carouselIndex = 0;

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
                this.selectedCounter().setAttribute("counter-name", counterName);
            }
        };
        this.RESET.onclick = () =>
        {
            if (this.selectedCounter().querySelector('.display-text')?.textContent)
            {
                this.selectedCounter().querySelector('.display-text')!.textContent = "0";
            }
        };
    }

    private updateCarousel()
    {
        const carouselItems = this.CAROUSELTRACK.children;
        const newVisible = carouselItems[this.carouselIndex];
        newVisible.classList.add("counter-selected");
        const itemWidth = carouselItems[0].clientWidth;
        this.CAROUSELTRACK.style.transform = `translateX(-${this.carouselIndex * itemWidth}px)`;
        this.NAME.value = this.selectedCounter().getAttribute("counter-name") ?? "";
    };

    private getSvgNumberCounter(): SVGSVGElement
    {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const width = 200;
        const height = 100;
        const buttonWidth = 40;
        const displayWidth = 100;
        const buttonHeight = 60;
        const spacing = 10; // Space between buttons and display

        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.setAttribute("width", `${width}px`);
        svg.setAttribute("height", `${height}px`);

        // Counter display
        const displayGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        displayGroup.setAttribute("transform", `translate(${buttonWidth + spacing}, 20)`);


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
        incrementGroup.setAttribute("transform", `translate(${width - buttonWidth}, 20)`);

        const incrementRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        incrementRect.setAttribute("width", `${buttonWidth}`);
        incrementRect.setAttribute("height", `${buttonHeight}`);
        incrementRect.setAttribute("stroke-width", "2");
        incrementRect.setAttribute("rx", "6");
        incrementRect.setAttribute("ry", "6");
        incrementRect.setAttribute("class", "clicker-control");

        const incrementText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        incrementText.setAttribute("x", `${buttonWidth / 2}`);
        incrementText.setAttribute("y", `${buttonHeight / 2 + 10}`);
        incrementText.setAttribute("text-anchor", "middle");
        incrementText.setAttribute("font-size", "24");
        incrementText.setAttribute("font-family", "Arial, sans-serif");
        incrementText.setAttribute("class", "clicker-control");
        incrementText.textContent = "+";

        incrementGroup.appendChild(incrementRect);
        incrementGroup.appendChild(incrementText);

        // Decrement button
        const decrementGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        decrementGroup.setAttribute("transform", `translate(0, 20)`);

        const decrementRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        decrementRect.setAttribute("width", `${buttonWidth}`);
        decrementRect.setAttribute("height", `${buttonHeight}`);
        decrementRect.setAttribute("stroke-width", "2");
        decrementRect.setAttribute("rx", "6");
        decrementRect.setAttribute("ry", "6");
        decrementRect.setAttribute("class", "clicker-control");

        const decrementText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        decrementText.setAttribute("x", `${buttonWidth / 2}`);
        decrementText.setAttribute("y", `${buttonHeight / 2 + 10}`);
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
            //console.log(`Incremented: ${current}`);
        });

        decrementGroup.addEventListener("click", () =>
        {
            let current = parseInt(displayText.textContent ?? "0");
            current--;
            displayText.textContent = current.toString();
            //console.log(`Decremented: ${current}`);
        });

        svg.appendChild(decrementGroup);
        svg.appendChild(displayGroup);
        svg.appendChild(incrementGroup);

        return svg;
    }

    private selectedCounter = () => this.CAROUSELTRACK.children[this.carouselIndex] as HTMLElement;
}

export const COUNTERS = new Counters();