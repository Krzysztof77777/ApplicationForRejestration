export class Dates {
    dateP = document.querySelector('.menu__date .date');
    hourP = document.querySelector('.menu__date .hour');
    constructor() {
        this.updateDate();
        this.SetIntervalForUpdateDate();
    }
    updateDate = () => {
        const date = new Date();
        const tableOfMonth = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        this.dateP.textContent = `${day} ${tableOfMonth[month]}, ${year}r.`;
        this.hourP.textContent = `${hour < 10? `0${hour}` : hour}:${minutes < 10? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    SetIntervalForUpdateDate = () => {
        setInterval(() => {
            this.updateDate();
        }, 1000);
    }
}