import {
    Modal
} from './modal.js';

export class completecalendar {
    ModalClass = new Modal;

    prevMonthDaysContainer = document.querySelector('.calendar__firstpage .calendar__days');
    currentMonthDaysContainer = document.querySelector('.calendar__secondpage .calendar__days');
    nextMonthDaysContainer = document.querySelector('.calendar__thirdpage .calendar__days');
    prevMonthDaysContainerTitle = document.querySelector('.calendar__firstpage .calendar__title p');
    currentMonthDaysContainerTitle = document.querySelector('.calendar__secondpage .calendar__title p');
    nextMonthDaysContainerTitle = document.querySelector('.calendar__thirdpage .calendar__title p');
    urlchoose;
    tableOfMonths = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    constructor() {
        this.ModalClass.addEventsListener();
        this.checkAdminOrWorkerLogined();
        this.transferCalendar();
    }
    transferCalendar = () => {
        this.ModalClass.showLoader();
        fetch('/transfercalendar', {
                method: 'GET'
            })
            .then(r => r.json())
            .then(data => {
                this.createHTMLStructureForOneMonthInCalendar(data.data.CurrentMonth, data.data.PrevMonth, data.data.NextMonth, this.currentMonthDaysContainer, 'current');
                this.createHTMLStructureForOneMonthInCalendar(data.data.PrevMonth, data.data.BeforePrevMonth, data.data.CurrentMonth, this.prevMonthDaysContainer, 'previous');
                this.createHTMLStructureForOneMonthInCalendar(data.data.NextMonth, data.data.CurrentMonth, data.data.AfterNextMonth, this.nextMonthDaysContainer, 'next');
                this.ModalClass.hideLoader();
            })
    }
    checkAdminOrWorkerLogined = () => {
        let url = window.location.href;
        if (url[url.length - 1] === '/') {
            url = url.slice(0, url.length - 1);
        }
        let urlchoose = url.slice(url.lastIndexOf('/') + 1);
        this.urlchoose = urlchoose;
    }
    checkOtherDaysForAtTheBeginningOfCalendar = (data) => {
        const firstday = data;
        const tableOfDays = ['Mon', 'Tues', 'Wed', 'Thur', 'Frid', 'Sat', 'Sun'];
        const table = [{
                Day: 'Mon',
                OtherDaysToAdd: 0,
            },
            {
                Day: 'Tues',
                OtherDaysToAdd: 1,
            },
            {
                Day: 'Wed',
                OtherDaysToAdd: 2,
            },
            {
                Day: 'Thur',
                OtherDaysToAdd: 3,
            },
            {
                Day: 'Frid',
                OtherDaysToAdd: 4,
            },
            {
                Day: 'Sat',
                OtherDaysToAdd: 5,
            }, {
                Day: 'Sun',
                OtherDaysToAdd: 6,
            }
        ]
        const ElementOfTable = table.find(e => e.Day === firstday.dayOfTheWeek);
        return ElementOfTable.OtherDaysToAdd;
    }
    checkOtherDaysForAtTheEndOfCalendar = (container) => {
        const AllElements = container.querySelectorAll('div');
        const OtherDaysToAdd = 42 - (AllElements.length / 2);
        return OtherDaysToAdd;
    }
    createHTMLStructureForOtherDays = (otherdaystoadd, container, month) => {
        const daystoadd = otherdaystoadd;

        const documentFragment = document.createDocumentFragment();
        const date = new Date();
        const accday = date.getDate();
        for (const el of daystoadd) {
            const element = document.createElement('div');
            element.className = "calendar__otherday";
            const daycont = document.createElement('div');
            daycont.className = "calendar__otherday--container";
            if (el.day < accday && month === 'current') {
                element.classList.add('passed');
            } else if (month === 'previous' || month === 'before') {
                element.classList.add('passed');
            }
            if (el.dayOfTheWeek === "Sun") {
                daycont.classList.add('sundayborder');
            }
            const elementa = document.createElement('a');
            elementa.setAttribute('href', `/${this.urlchoose}/day/day?month=${month}&day=${el.day}`);
            elementa.textContent = "Zobacz terminy";
            const elementa2 = document.createElement('p');
            elementa2.textContent = el.day;
            daycont.appendChild(elementa2);
            daycont.appendChild(elementa);
            element.appendChild(daycont);
            documentFragment.appendChild(element);
        }
        container.appendChild(documentFragment);

    }
    createDaysForCalendar = (data, container, accmonth) => {
        const month = data;

        const documentFragment = document.createDocumentFragment();
        const date = new Date();
        const accday = date.getDate();
        for (const el of month) {
            const day = document.createElement('div');
            day.className = 'calendar__day';
            const daycont = document.createElement('div');
            daycont.className = "calendar__day--container";
            if (el.day < accday && accmonth === 'current') {
                day.classList.add('passed');
            } else if (accmonth === 'previous' || accmonth === 'before') {
                day.classList.add('passed');
            }
            if (el.dayOfTheWeek === "Sun") {
                daycont.classList.add('sundayborder');
            }
            const elementa = document.createElement('a');
            elementa.setAttribute('href', `/${this.urlchoose}/day/day?month=${accmonth}&day=${el.day}`);
            elementa.textContent = "Zobacz terminy";
            if (el.currentDay === true) {
                daycont.classList.add('currentday');
            }
            const elementa2 = document.createElement('p');
            elementa2.textContent = el.day;
            daycont.appendChild(elementa2);
            daycont.appendChild(elementa);
            day.appendChild(daycont)
            documentFragment.appendChild(day);
        }
        container.appendChild(documentFragment);
    }
    createHTMLStructureForOneMonthInCalendar = (data, monthbefore, monthafter, container, week) => {
        const month = data;


        const monthtable = ['before', 'previous', 'current', 'next', 'after'];
        const index = monthtable.findIndex(e => e === week);
        let beforemonth;
        let aftermonth;
        let indexofacctualmonth = this.checkMonth(week);
        this.setNameOfAcctualMonthToContainer(week, indexofacctualmonth);

        const CoutnerOtherDaysToAddAtTheBeginningOfCalendar = this.checkOtherDaysForAtTheBeginningOfCalendar(month[0]);
        beforemonth = monthbefore.slice(monthbefore.length - CoutnerOtherDaysToAddAtTheBeginningOfCalendar);
        this.createHTMLStructureForOtherDays(beforemonth, container, monthtable[index - 1]);
        this.createDaysForCalendar(month, container, monthtable[index]);
        const CounterOtherDaysToAddAtTheEndOfCalendar = this.checkOtherDaysForAtTheEndOfCalendar(container);
        aftermonth = monthafter.slice(0, CounterOtherDaysToAddAtTheEndOfCalendar);
        this.createHTMLStructureForOtherDays(aftermonth, container, monthtable[index + 1]);
    }
    checkMonth = (week) => {
        const date = new Date();
        let month = date.getMonth();
        switch (week) {
            case 'previous':
                if (month === 0) {
                    month = 11;
                } else month--;
                break;
            case 'current':
                break;
            case 'next':
                if (month === 11) {
                    month = 0;
                } else month++;
                break;
        }
        return month;
    }
    setNameOfAcctualMonthToContainer = (week, index) => {
        switch (week) {
            case 'previous':
                this.prevMonthDaysContainerTitle.textContent = `${this.tableOfMonths[index]}`;
                break;
            case 'current':
                this.currentMonthDaysContainerTitle.textContent = `${this.tableOfMonths[index]}`;
                break;
            case 'next':
                this.nextMonthDaysContainerTitle.textContent = `${this.tableOfMonths[index]}`;
                break;
        }
    }
}