class Checkbox
{
    carouselIndex = 0;

    ADD = document.getElementById('checkboxAdd') as HTMLButtonElement;
    REMOVE = document.getElementById('checkboxRemove') as HTMLButtonElement;
    NEXT = document.getElementById('checkboxNext') as HTMLButtonElement;
    PREV = document.getElementById('checkboxPrevious') as HTMLButtonElement;
    NAME = document.getElementById('checkboxName') as HTMLInputElement;
    NUMBER = document.getElementById('checkboxSlices') as HTMLInputElement;

    DISPLAYCONTAINER = document.getElementById('checkboxDisplay') as HTMLDivElement;
    CAROUSELTRACK = document.getElementById('checkboxCarousel') as HTMLDivElement;

    constructor()
    {

    }

    public SetupControls()
    {
        this.ADD.onclick = () =>
        {
            // Add new checkbox
            const newCheckbox = document.createElement('div');
            newCheckbox.id = crypto.randomUUID();
            newCheckbox.classList.add("checkbox-selected");
            newCheckbox.classList.add("carousel-item");
            newCheckbox.appendChild(this.getSvgCheckboxes(4));
            this.CAROUSELTRACK.appendChild(newCheckbox);

            // Find/Remove old selected
            const oldSelected = this.CAROUSELTRACK.getElementsByClassName('checkbox-selected');
            if (oldSelected.length > 0)
            {
                oldSelected[0].classList.remove('checkbox-selected');
            }

            // Apply new selected
            const carouselItems = this.CAROUSELTRACK.children;
            this.carouselIndex = carouselItems.length - 1;
            const newItem = carouselItems[this.carouselIndex];
            newItem.classList.add("checkbox-selected");
            this.updateCarousel();
        };
        this.REMOVE.onclick = () =>
        {
            const selected = this.CAROUSELTRACK.getElementsByClassName('checkbox-selected');
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
                    newVisible.classList.add("checkbox-selected");
                    this.updateCarousel();
                }
                else if (carouselItems.length > 0)
                {
                    this.carouselIndex = carouselItems.length - 1;
                    const newVisible = carouselItems[this.carouselIndex];
                    newVisible.classList.add("checkbox-selected");
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
            if (this.selectedCheckbox())
            {
                const checkboxName = this.NAME.value;
                this.selectedCheckbox().setAttribute("checkbox-name", checkboxName);
            }
        };
        this.NUMBER.onblur = () =>
        {
            const newValue = parseInt(this.NUMBER.value);
            if (newValue > 0 && this.selectedCheckbox() !== undefined)
            {
                this.selectedCheckbox().replaceChildren();
                this.selectedCheckbox().appendChild(this.getSvgCheckboxes(newValue));
            }
        };
    }

    private updateCarousel()
    {
        const carouselItems = this.CAROUSELTRACK.children;
        const newVisible = carouselItems[this.carouselIndex];
        newVisible.classList.add("checkbox-selected");
        const itemWidth = carouselItems[0].clientWidth;
        this.CAROUSELTRACK.style.transform = `translateX(-${this.carouselIndex * itemWidth}px)`;
        this.NAME.value = this.selectedCheckbox().getAttribute("checkbox-name") ?? "";
    };

    private getSvgCheckboxes(numCheckboxes: number): SVGSVGElement
    {
        const fixedNumber = Math.min(numCheckboxes, 100);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        const numColumns = Math.ceil(Math.sqrt(fixedNumber));
        const numRows = Math.ceil(fixedNumber / numColumns);

        const boxSize = 40; // Size of each checkbox including padding
        const svgWidth = numColumns * boxSize;
        const svgHeight = numRows * boxSize;

        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
        svg.setAttribute("width", `${svgWidth}px`);
        svg.setAttribute("height", `${svgHeight}px`);
        svg.setAttribute("class", "checkbox-svg");

        for (let i = 0; i < fixedNumber; i++)
        {
            const checkboxGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

            const col = i % numColumns;
            const row = Math.floor(i / numColumns);

            checkboxGroup.setAttribute("transform", `translate(${col * boxSize}, ${row * boxSize})`);

            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", "5");
            rect.setAttribute("y", "5");
            rect.setAttribute("width", "30");
            rect.setAttribute("height", "30");
            rect.setAttribute("fill", "transparent");
            rect.setAttribute("stroke-width", "2");
            rect.setAttribute("rx", "6");
            rect.setAttribute("ry", "6");
            rect.setAttribute("class", "checkbox-rect");

            const checkmark = document.createElementNS("http://www.w3.org/2000/svg", "path");
            checkmark.setAttribute("d", "M221.65723,34.34326A8.00246,8.00246,0,0,0,216,32h-.02539l-63.79883.20117A8.00073,8.00073,0,0,0,146.0332,35.106L75.637,120.32275,67.31348,111.999A16.02162,16.02162,0,0,0,44.68555,112L32.001,124.68555A15.99888,15.99888,0,0,0,32,147.31348l20.88672,20.88769L22.94531,198.14258a16.01777,16.01777,0,0,0,.001,22.62695l12.28418,12.28418a16.00007,16.00007,0,0,0,22.62793,0L87.79883,203.1123,108.68652,224.001A16.02251,16.02251,0,0,0,131.31445,224L143.999,211.31445A15.99888,15.99888,0,0,0,144,188.68652l-8.32324-8.32324,85.21679-70.39648a8.00125,8.00125,0,0,0,2.90528-6.14258L224,40.02539A8.001,8.001,0,0,0,221.65723,34.34326Zm-13.84668,65.67822-83.49829,68.97706L111.314,156l54.34327-54.34277a8.00053,8.00053,0,0,0-11.31446-11.31446L100,144.686,87.00195,131.6875,155.97852,48.189l51.99609-.16357Z");
            checkmark.setAttribute("fill", "transparent");
            checkmark.setAttribute("stroke", "none");
            checkmark.setAttribute("class", "checkmark");

            const swordScaleFactor = 0.115; // Adjust this scale factor as needed
            checkmark.setAttribute("transform", `translate(5, 5) scale(${swordScaleFactor})`);

            checkboxGroup.appendChild(rect);
            checkboxGroup.appendChild(checkmark);

            checkboxGroup.addEventListener("click", () => toggleCheckbox(checkmark));

            svg.appendChild(checkboxGroup);
        }

        const toggleCheckbox = (checkmark: SVGPathElement) =>
        {
            //const isChecked = checkmark.classList.contains('check-selected');
            checkmark.classList.toggle('check-selected');
            //console.log(`Checkbox toggled: ${!isChecked}`);
        };

        return svg;
    }

    private selectedCheckbox = () => this.CAROUSELTRACK.children[this.carouselIndex] as HTMLElement;
}

export const CHECKBOX = new Checkbox();