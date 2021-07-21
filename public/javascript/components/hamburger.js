export class Hamburger {
    modalshow = document.querySelector('.menu__show');
    modalexit = document.querySelector('.menu__exit');
    menu = document.querySelector('.menu');
    menuhamburger = document.querySelector('.menu__hamburger');
    constructor() {
        this.modalshow.addEventListener('click', () => this.showModalHamburger())
        this.modalexit.addEventListener('click', () => this.exitModalHamburger())
    }
    showModalHamburger = () => {
        this.menu.classList.add('extended');
        this.modalshow.className = 'fas fa-bars menu__show notextendedicon';
        this.modalexit.className = 'fas fa-times menu__exit extendedicon';
        this.menuhamburger.classList.add('hamburgerfixed');
    }
    exitModalHamburger = () => {
        this.menu.classList.remove('extended');
        this.modalshow.className = 'fas fa-bars menu__show extendedicon';
        this.modalexit.className = 'fas fa-times menu__exit notextendedicon';
        this.menuhamburger.classList.remove('hamburgerfixed');
    }
}