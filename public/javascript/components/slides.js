export class slider {
    calendarcontainer = document.querySelector('.calendar__container');
    rightarrow = document.querySelector('.calendar__rightarrow');
    leftarrow = document.querySelector('.calendar__leftarrow');
    slidescontainer = document.querySelector('.calendar__pages');
    slides = document.querySelectorAll('.calendar__pages>div');
    dots = document.querySelectorAll('.calendar__dots i');
    tableOfSlides = [];
    acctualslide = 1;
    firstslide = 0;
    counterslides = this.slides.length - 1;
    constructor() {
        this.updateTableOfSlides();
        this.changeSlideByInitialize();
        this.leftarrow.addEventListener('click', this.changeSlideFromLeftArrow);
        this.rightarrow.addEventListener('click', this.changeSlideFromRightArrow);
        this.dots.forEach((e, index) => {
            e.addEventListener('click', () => {
                this.changeSlideFromDot(index);
            });
        })
        window.addEventListener('resize', () => {
            this.updateTableOfSlides();
        });
    }
    changeSlideFromRightArrow = () => {
        if (this.acctualslide === this.counterslides) {
            return;
        }
        this.acctualslide++;
        this.activeAllArrows();
        if (this.acctualslide === this.counterslides) {
            this.activeAllArrows();
            this.unActiveRightArrow();
        }
        this.showActiveSlide();
    }
    changeSlideFromLeftArrow = () => {
        if (this.acctualslide === this.firstslide) {
            return;
        }
        this.acctualslide--;
        this.activeAllArrows();
        if (this.acctualslide === this.firstslide) {
            this.activeAllArrows();
            this.unActiveLeftArrow();
        }
        this.showActiveSlide();
    }
    activeAllArrows = () => {
        this.rightarrow.classList.remove('unactivearrow');
        this.leftarrow.classList.remove('unactivearrow');
    }
    unActiveLeftArrow = () => {
        this.leftarrow.classList.add('unactivearrow');
    }
    unActiveRightArrow = () => {
        this.rightarrow.classList.add('unactivearrow');
    }
    changeSlideFromDot = (index) => {
        this.acctualslide = index;
        if (this.acctualslide === this.firstslide) {
            this.activeAllArrows();
            this.unActiveLeftArrow();
        } else if (this.acctualslide === this.counterslides) {
            this.activeAllArrows();
            this.unActiveRightArrow();
        } else {
            this.activeAllArrows();
        }
        this.showActiveSlide();
    }
    changeActiveDot = () => {
        this.dots.forEach((e) => {
            e.classList.remove('active');
        })
        this.dots[this.acctualslide].classList.add('active');
    }
    showActiveSlide = () => {
        this.changeActiveDot();
        this.slidescontainer.style.transform = `translateX(${this.tableOfSlides[this.acctualslide]}px)`;
    }
    changeSlideByInitialize = () => {
        this.slidescontainer.style.transition = '0s';
        this.slidescontainer.style.transform = `translateX(${this.tableOfSlides[this.acctualslide]}px)`;
        setTimeout(() => {
            this.slidescontainer.style.transition = '1s';
        }, 1000)
    }
    updateTableOfSlides = () => {
        this.slides.forEach((e) => {
            e.style.width = `calc(${this.calendarcontainer.offsetWidth}px)`;
        })
        this.tableOfSlides = [this.calendarcontainer.offsetWidth * 0, -(this.calendarcontainer.offsetWidth * 1), -(this.calendarcontainer.offsetWidth * 2)];
        this.showActiveSlide();
    }
}