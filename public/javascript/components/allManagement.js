import {
    Modal
} from './modal.js';

export class Manage {
    ModalClass = new Modal;

    tableOfMonthInEng = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    tableOfMonths = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    addWorkerBtn = document.querySelector('.main__addworker');
    removeWorkerBtn = document.querySelector('.main__removeworker');
    manageWorkerBtn = document.querySelector('.main__manageworker');
    mainBottomContainer = document.querySelector('.main__bottom');
    modalyes = document.querySelector('.modalyesvisit');
    tableOfIndex1 = ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00']
    containerForManageMonth;
    daysinfirstweek = [];
    daysinsecondweek = [];
    daysinthirdweek = [];
    daysinfourthweek = [];
    daysinfifthweek = [];
    daysinsixthweek = [];
    currentMonth = 'current';
    daysToAdd;
    daysToAddAfter = 0;
    daysToAddAfterFirstIndex = 0;
    action;
    change;
    element;
    socket = io(`${window.location.origin}`);
    constructor() {
        this.ModalClass.addEventsListener();
        this.socket.on('message', async (data) => {
            switch (data) {
                case 'resetfromadminpanel':
                    document.querySelector('.bottom').innerHTML = "";
                    break;
            }
        })
        window.addEventListener('storage', () => this.checkStorage());
        this.addWorkerBtn.addEventListener('click', () => this.showHTMLStructureForAddWorker());
        this.removeWorkerBtn.addEventListener('click', () => this.transferWorkersFetch('remove'));
        this.manageWorkerBtn.addEventListener('click', () => {
            this.currentMonth = 'current';
            this.transferWorkersFetch('manage')
        });
        this.modalyes.addEventListener('click', () => this.acceptModalChange(this.action, this.change, this.element));
    }
    checkStorage = () => {
        if (localStorage.refresh === 'refreshfrommanage' && localStorage.refresh !== undefined) {
            localStorage.clear();
            window.location.reload();
        }
    }
    transferCalendar = (howmonth) => {
        return fetch('/transfercalendar', {
                method: 'GET'
            })
            .then(r => r.json())
            .then(data => {
                if (howmonth === 'current') {
                    return this.createHTMLStructureForOneMonthInCalendar(data.data.CurrentMonth, data.data.PrevMonth, data.data.NextMonth, this.containerForManageMonth, 'current');
                } else if (howmonth === "previous") {
                    return this.createHTMLStructureForOneMonthInCalendar(data.data.PrevMonth, data.data.BeforePrevMonth, data.data.CurrentMonth, this.containerForManageMonth, 'previous');
                } else if (howmonth === "next") {
                    return this.createHTMLStructureForOneMonthInCalendar(data.data.NextMonth, data.data.CurrentMonth, data.data.AfterNextMonth, this.containerForManageMonth, 'next');
                }
            })
    }
    addWorkerFetch = (namee, surnamee) => {
        return fetch('/addworker', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: namee,
                surname: surnamee
            })
        })
    }
    removeWorkerFetch = (namee) => {
        return fetch('/removeworker', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: namee
            })
        })
    }
    transferWorkersFetch = (structure) => {
        fetch('/getworkers', {
                method: 'GET',
            })
            .then(r => r.json())
            .then(data => {
                if (structure === "manage") {
                    this.showHTMLStructureForManageWorker(data);
                } else if (structure === "remove") {
                    this.showHTMLStructureForRemoveWorker(data);
                }
            });
    }
    addChangeForDay = (DAY, MONTH, WORKER, FROM, TO) => {
        return fetch('/addchangeday', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                worker: WORKER,
                month: MONTH,
                day: DAY,
                from: FROM,
                to: TO,
                breaks: this.ModalClass.breaktable,
            })
        })
    }
    removeChangeForDay = (DAY, MONTH, WORKER) => {
        return fetch('/removechangeday', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                worker: WORKER,
                month: MONTH,
                day: DAY,
            })
        })
    }
    addChangeForMonth = (WORKER, from, to) => {
        return fetch('/addchangemonth', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                worker: WORKER,
                week: this.currentMonth,
                from: from,
                to: to,
                breaks: this.ModalClass.breaktable,
            })
        })
    }
    removeChangeForMonth = (WORKER) => {
        return fetch('/removechangemonth', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                worker: WORKER,
                week: this.currentMonth,
            })
        })
    }
    addFreeForDay = (DAY, MONTH, WORKER) => {
        return fetch('/addfreeforday', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                worker: WORKER,
                day: DAY,
                month: MONTH,
            })
        })
    }
    removeFreeForDay = (DAY, MONTH, WORKER) => {
        return fetch('/removefreeforday', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                worker: WORKER,
                day: DAY,
                month: MONTH,
            })
        })
    }
    addChangeForWeek = (week, worker, from, to) => {
        let days;
        switch (week) {
            case '1':
                days = this.daysinfirstweek;
                break;
            case '2':
                days = this.daysinsecondweek;
                break;
            case '3':
                days = this.daysinthirdweek;
                break;
            case '4':
                days = this.daysinfourthweek;
                break;
            case '5':
                days = this.daysinfifthweek;
                break;
            case '6':
                days = this.daysinsixthweek;
                break;
        }
        return fetch('/addchangeweek', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                week: days,
                worker: worker,
                from: from,
                to: to,
                breaks: this.ModalClass.breaktable,
            })
        })
    }
    removeChangeForWeek = (week, worker) => {
        let days;
        switch (week) {
            case '1':
                days = this.daysinfirstweek;
                break;
            case '2':
                days = this.daysinsecondweek;
                break;
            case '3':
                days = this.daysinthirdweek;
                break;
            case '4':
                days = this.daysinfourthweek;
                break;
            case '5':
                days = this.daysinfifthweek;
                break;
            case '6':
                days = this.daysinsixthweek;
                break;
        }
        return fetch('/removechangeweek', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                week: days,
                worker: worker,
            })
        })
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
    createHTMLStructureForOtherDays = (otherdaystoadd, container, MONTH) => {
        const daystoadd = otherdaystoadd;
        const indexofworker = daystoadd[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        const documentFragment = document.createDocumentFragment();
        for (const el of daystoadd) {
            const element = document.createElement('div');
            element.className = "calendar__otherday";
            const elementa1 = document.createElement('p');
            const elementa1day = document.createElement('p');
            const elementa1month = document.createElement('p');
            const indexofmonth = this.tableOfMonthInEng.findIndex(e => e === el.month);
            elementa1day.textContent = el.day;
            elementa1month.textContent = `${this.tableOfMonths[indexofmonth]}`;
            elementa1.appendChild(elementa1day);
            elementa1.appendChild(elementa1month);
            const daycont = document.createElement('div');
            daycont.className = "calendar__otherday--container";
            const daya1change = document.createElement('p');
            const daya3 = document.createElement('p');
            daya3.classList.add("freeday");
            daya3.textContent = "Ustaw dzień wolny";
            if (el.dayOfTheWeek === "Sun") {
                daycont.classList.add('sundayborder');
            }
            if (el.workers[indexofworker].worker[2].change.from === '' && el.workers[indexofworker].worker[2].change.to === '') {
                daya1change.textContent = "Brak zmiany";
            } else if (el.workers[indexofworker].worker[2].change.from === 'freeday' && el.workers[indexofworker].worker[2].change.to === 'freeday') {
                daya1change.textContent = 'Dzień wolny';
                daya1change.classList.add('white');
                daya3.textContent = "Usuń dzień wolny";
                daya3.className = "removefreeday";
            } else {
                daya1change.textContent = `${el.workers[indexofworker].worker[2].change.from}:${el.workers[indexofworker].worker[2].change.to}`;
                daya1change.classList.add('pink')
                daya3.textContent = "Ustaw dzień wolny";
                daya3.classList.add('inactive');
            }
            const daya1 = document.createElement('p');
            daya1.setAttribute('data-day', el.day);
            daya1.setAttribute('data-month', MONTH);
            daya1.className = "addchangeday";
            daya1.textContent = "Dodaj zmiane";
            const daya2 = document.createElement('p');
            daya2.setAttribute('data-day', el.day);
            daya2.setAttribute('data-month', MONTH)
            daya2.textContent = "Usuń zmiane";
            daya2.className = "removechangeday";
            daya3.setAttribute('data-day', el.day);
            daya3.setAttribute('data-month', MONTH)
            if (el.workers[indexofworker].worker[1].hours.length < 1) {
                daya2.classList.add('disabled');
            } else {
                daya2.classList.add('active');
                daya1.className = "editchangeday";
                daya1.textContent = "Edytuj zmiane";
            }
            daycont.appendChild(elementa1);
            daycont.appendChild(daya1change);
            daycont.appendChild(daya1);
            daycont.appendChild(daya2);
            daycont.appendChild(daya3);
            element.appendChild(daycont);
            documentFragment.appendChild(element);
        }
        container.appendChild(documentFragment);
        const allfreedaybtn = document.querySelectorAll('.freeday');
        allfreedaybtn.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.hideModalChangeInfo();
                this.action = "set";
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz ustawić dzień wolny', "Dzień wolny został ustawiony");
                this.ModalClass.showModalAcceptVisit()
            })
        })
        const allremovefreedaybtn = document.querySelectorAll('.removefreeday');
        allremovefreedaybtn.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.hideModalChangeInfo();
                this.action = "unset";
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć dzień wolny', "Dzień wolny został usunięty");
                this.ModalClass.showModalAcceptVisit()
            })
        })
        const alldayseditchange = document.querySelectorAll('.calendar__otherday .editchangeday');
        const alldaysaddchange = document.querySelectorAll('.calendar__otherday .addchangeday');
        const alldaysremovechange = document.querySelectorAll('.calendar__otherday .active');
        alldaysaddchange.forEach((e) => {
            e.addEventListener('click', () => {
                const breaks = [...document.querySelectorAll('.break')];
                if (breaks.length > 0) {
                    breaks.forEach((e) => {
                        e.remove();
                    })
                }
                this.ModalClass.hideInform();
                this.ModalClass.hideModalChangeInfo();
                this.ModalClass.showModalChange();
                this.action = 'add';
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalChange('Czy na pewno chcesz dodać zmiane?', "Zmiana została dodana", "Dodaj zmiane")
            });
        })
        alldayseditchange.forEach((e) => {
            e.addEventListener('click', () => {
                const breaks = [...document.querySelectorAll('.break')];
                if (breaks.length > 0) {
                    breaks.forEach((e) => {
                        e.remove();
                    })
                }
                this.ModalClass.hideInform();
                this.ModalClass.hideModalChangeInfo();
                this.ModalClass.showModalChangeInfo("Edytowanie aktualnej zmiany spowoduje utratę aktualnie zapisanych wizyt w dniu , który edytujesz.")
                this.action = 'add';
                this.change = 'day';
                this.element = e;
                this.ModalClass.showModalChange();
                this.ModalClass.setContentOfModalChange('Czy na pewno chcesz edytować aktualną zmiane?', "Zmiana została zmieniona", "Edytuj zmiane")
            })
        })
        alldaysremovechange.forEach((e) => {
            e.addEventListener('click', () => {
                this.action = 'remove';
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć zmiane dniową?', "Zmiana została usunięta");
                this.ModalClass.showModalAcceptVisit()
            });
        });

    }
    createDaysForCalendar = (data, container, MONTH) => {
        const month = data;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        const documentFragment = document.createDocumentFragment();
        for (const el of month) {
            const day = document.createElement('div');
            const daya1 = document.createElement('p');
            const daycont = document.createElement('div');
            daycont.className = "calendar__day--container";
            daya1.setAttribute('data-day', el.day);
            daya1.setAttribute('data-month', MONTH);
            const daya1change = document.createElement('p');
            const daya3 = document.createElement('p');
            daya3.classList.add("freeday");
            daya3.textContent = "Ustaw dzień wolny";
            if (el.workers[indexofworker].worker[2].change.from === '' && el.workers[indexofworker].worker[2].change.to === '') {
                daya1change.textContent = "Brak zmiany";
            } else if (el.workers[indexofworker].worker[2].change.from === 'freeday' && el.workers[indexofworker].worker[2].change.to === 'freeday') {
                daya1change.textContent = 'Dzień wolny';
                daya1change.classList.add('white');
                daya3.textContent = "Usuń dzień wolny";
                daya3.className = "removefreeday";
            } else {
                daya1change.textContent = `${el.workers[indexofworker].worker[2].change.from} - ${el.workers[indexofworker].worker[2].change.to}`;
                daya1change.classList.add('pink')
                daya3.textContent = "Ustaw dzień wolny";
                daya3.classList.add('inactive');
            }
            if (el.dayOfTheWeek === "Sun") {
                daycont.classList.add('sundayborder');
            }
            daya1.className = "addchangeday";
            daya1.textContent = "Dodaj zmiane";
            const daya2 = document.createElement('p');
            daya2.setAttribute('data-day', el.day);
            daya2.setAttribute('data-month', MONTH)
            daya2.textContent = "Usuń zmiane";
            daya2.className = "removechangeday";
            daya3.setAttribute('data-day', el.day);
            daya3.setAttribute('data-month', MONTH)
            if (el.workers[indexofworker].worker[1].hours.length < 1) {
                daya2.classList.add('disabled');
            } else {
                daya2.classList.add('active');
                daya1.className = "editchangeday";
                daya1.textContent = "Edytuj zmiane";
            }
            const daya0 = document.createElement('p');
            const elementa1day = document.createElement('p');
            const elementa1month = document.createElement('p');
            const indexofmonth = this.tableOfMonthInEng.findIndex(e => e === el.month);
            elementa1day.textContent = el.day;
            elementa1month.textContent = `${this.tableOfMonths[indexofmonth]}`;
            daya0.appendChild(elementa1day);
            daya0.appendChild(elementa1month);
            day.className = 'calendar__day';
            if (el.currentDay === true) {
                daycont.classList.add('currentday');
            }
            daycont.appendChild(daya0);
            daycont.appendChild(daya1change);
            daycont.appendChild(daya1);
            daycont.appendChild(daya2);
            daycont.appendChild(daya3);
            day.appendChild(daycont);
            documentFragment.appendChild(day);
        }
        container.appendChild(documentFragment);
        const allfreedaybtn = document.querySelectorAll('.freeday');
        allfreedaybtn.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.hideModalChangeInfo();
                this.action = "set";
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz ustawić dzień wolny', "Dzień wolny został ustawiony");
                this.ModalClass.showModalAcceptVisit()
            })
        })
        const allremovefreedaybtn = document.querySelectorAll('.removefreeday');
        allremovefreedaybtn.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.hideModalChangeInfo();
                this.action = "unset";
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć dzień wolny', "Dzień wolny został usunięty");
                this.ModalClass.showModalAcceptVisit();
            })
        })
        const alldayseditchange = document.querySelectorAll('.calendar__day .editchangeday');
        const alldaysaddchange = document.querySelectorAll('.calendar__day .addchangeday');
        const alldaysremovechange = document.querySelectorAll('.calendar__day .removechangeday');
        alldayseditchange.forEach((e) => {
            e.addEventListener('click', () => {
                const breaks = [...document.querySelectorAll('.break')];
                if (breaks.length > 0) {
                    breaks.forEach((e) => {
                        e.remove();
                    })
                }
                this.action = 'add';
                this.change = 'day';
                this.element = e;
                this.ModalClass.hideInform();
                this.ModalClass.showModalChangeInfo("Edytowanie aktualnej zmiany spowoduje utratę aktualnie zapisanych wizyt w dniu , który edytujesz.");
                this.ModalClass.setContentOfModalChange('Czy na pewno chcesz edytować aktualną zmiane?', "Zmiana została zmieniona", "Edytuj zmiane");
                this.ModalClass.showModalChange();
            })
        })
        alldaysaddchange.forEach((e) => {
            e.addEventListener('click', () => {
                const breaks = [...document.querySelectorAll('.break')];
                if (breaks.length > 0) {
                    breaks.forEach((e) => {
                        e.remove();
                    })
                }
                this.ModalClass.hideInform();
                this.ModalClass.hideModalChangeInfo();
                this.action = 'add';
                this.change = 'day';
                this.element = e;
                this.ModalClass.setContentOfModalChange('Czy na pewno chcesz dodać zmiane?', "Zmiana została dodana", "Dodaj zmiane");
                this.ModalClass.showModalChange();
            });
        })
        alldaysremovechange.forEach((e) => {
            e.addEventListener('click', () => {
                this.action = 'remove';
                this.change = 'day';
                this.element = e;
                this.ModalClass.showModalAcceptVisit();
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć zmiane?', "Zmiana została usunięta");
            });
        });
    }
    createHTMLStructureForOneMonthInCalendar = (data, monthbefore, monthafter, container, week) => {
        container.innerHTML = "";

        const monthtable = ['before', 'previous', 'current', 'next', 'after'];
        const index = monthtable.findIndex(e => e === week);
        const month = data;
        let beforemonth;
        let aftermonth;

        this.currentMonth = week;

        const CoutnerOtherDaysToAddAtTheBeginningOfCalendar = this.checkOtherDaysForAtTheBeginningOfCalendar(month[0]);
        beforemonth = monthbefore.slice(monthbefore.length - CoutnerOtherDaysToAddAtTheBeginningOfCalendar);
        this.createHTMLStructureForOtherDays(beforemonth, container, monthtable[index - 1]);
        this.createDaysForCalendar(month, container, monthtable[index]);
        const CounterOtherDaysToAddAtTheEndOfCalendar = this.checkOtherDaysForAtTheEndOfCalendar(container);
        aftermonth = monthafter.slice(0, CounterOtherDaysToAddAtTheEndOfCalendar);
        this.createHTMLStructureForOtherDays(aftermonth, container, monthtable[index + 1]);
        this.addDaysToFirstWeek(beforemonth, month, week);
        this.addDaysToSecondWeek(month, week);
        this.addDaysToThirdWeek(month, week);
        this.addDaysToFourthWeek(month, aftermonth, week);
        this.addDaysToFifthWeek(month, aftermonth, week);
        this.addDaysToSixthWeek(month, aftermonth, week);
    }
    addDaysToFirstWeek = (beforemonth, monthacctual, week) => {
        document.querySelector('.week1').className = 'week1 disabled';
        document.querySelector('.addweek1').innerHTML = "Dodaj zmiane na:<br>1 tydzień";
        document.querySelector('.week2').className = 'week2 disabled';
        document.querySelector('.addweek2').innerHTML = "Dodaj zmiane na:<br>2 tydzień";
        document.querySelector('.week3').className = 'week3 disabled';
        document.querySelector('.addweek3').innerHTML = "Dodaj zmiane na:<br>3 tydzień";
        document.querySelector('.week4').className = 'week4 disabled';
        document.querySelector('.addweek4').innerHTML = "Dodaj zmiane na:<br>4 tydzień";
        document.querySelector('.week5').className = 'week5 disabled';
        document.querySelector('.addweek5').innerHTML = "Dodaj zmiane na:<br>5 tydzień";
        document.querySelector('.week6').className = 'week6 disabled';
        document.querySelector('.addweek6').innerHTML = "Dodaj zmiane na:<br>6 tydzień";
        document.querySelector('.removemonth').className = "removemonth";
        document.querySelector('.removechangeformonth').classList.add('disabled');
        document.querySelector('.addweek1').setAttribute('data-edit', 'false');
        document.querySelector('.addweek2').setAttribute('data-edit', 'false');
        document.querySelector('.addweek3').setAttribute('data-edit', 'false');
        document.querySelector('.addweek4').setAttribute('data-edit', 'false');
        document.querySelector('.addweek5').setAttribute('data-edit', 'false');
        document.querySelector('.addweek6').setAttribute('data-edit', 'false');
        document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'false');
        document.querySelector('.addchangeformonth p').textContent = "Dodaj zmiane miesięczną";

        this.daysinfirstweek = [];

        const acctualmonthfromtable = week;
        let indexofmonthtable;
        const monthtable = ['before', 'previous', 'current', 'next', 'after'];
        switch (week) {
            case 'before':
                indexofmonthtable = 0;
                break;
            case 'previous':
                indexofmonthtable = 1;
                break;
            case 'current':
                indexofmonthtable = 2;
                break;
            case 'next':
                indexofmonthtable = 3;
                break;
            case 'after':
                indexofmonthtable = 4;
                break;
        }

        const month = monthacctual;
        const before = beforemonth;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        for (const el of before) {
            if (el.workers[indexofworker].worker[1].hours.length > 1) {
                if (!document.querySelector('.week1').classList.contains('active')) {
                    document.querySelector('.week1').classList.add('active');
                    document.querySelector('.week1').classList.remove('disabled');
                    document.querySelector('.addweek1').innerHTML = "Edytuj zmiane na:<br> 1 tydzień";
                    document.querySelector('.addweek1').setAttribute('data-edit', 'true');
                }
            }
            this.daysinfirstweek.push({
                day: el.day,
                month: monthtable[indexofmonthtable - 1],
            });
        }
        switch (this.daysinfirstweek.length) {
            case 0:
                this.daysToAdd = 7;
                break;
            case 1:
                this.daysToAdd = 6;
                break;
            case 2:
                this.daysToAdd = 5;
                break;
            case 3:
                this.daysToAdd = 4;
                break;
            case 4:
                this.daysToAdd = 3;
                break;
            case 5:
                this.daysToAdd = 2;
                break;
            case 6:
                this.daysToAdd = 1;
                break;
        }
        for (let i = 0; i <= this.daysToAdd - 1; i++) {
            const dayindex = month[i].day
            if (month[i].workers[indexofworker].worker[1].hours.length > 1) {
                if (!document.querySelector('.week1').classList.contains('active')) {
                    document.querySelector('.week1').classList.add('active');
                    document.querySelector('.week1').classList.remove('disabled');
                    document.querySelector('.addweek1').innerHTML = "Edytuj zmiane na:<br>1 tydzień";
                    document.querySelector('.addweek1').setAttribute('data-edit', 'true');
                    document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'true');
                    document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                    document.querySelector('.addchangeformonth p').classList.add('active');
                }
                if (!document.querySelector('.addchangeformonth p').classList.contains('active')) {
                    document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                    document.querySelector('.addchangeformonth p').classList.add('active');
                }
                if (!document.querySelector('.removemonth').classList.contains('active')) {
                    document.querySelector('.removemonth').classList.add('active');
                    document.querySelector('.removechangeformonth').classList.remove('disabled');
                }
            }
            this.daysinfirstweek.push({
                day: dayindex,
                month: monthtable[indexofmonthtable]
            });
        }
    }
    addDaysToSecondWeek = (monthcurrent, week) => {
        this.daysinsecondweek = [];

        const month = monthcurrent;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        for (let i = this.daysToAdd; i <= this.daysToAdd + 6; i++) {
            const dayindex = month[i].day
            if (month[i].workers[indexofworker].worker[1].hours.length > 1) {
                if (!document.querySelector('.week2').classList.contains('active')) {
                    document.querySelector('.week2').classList.add('active');
                    document.querySelector('.week2').classList.remove('disabled');
                    document.querySelector('.addweek2').innerHTML = "Edytuj zmiane na:<br>2 tydzień";
                    document.querySelector('.addweek2').setAttribute('data-edit', 'true');
                    document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'true');
                    document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                }
                if (!document.querySelector('.removemonth').classList.contains('active')) {
                    document.querySelector('.removemonth').classList.add('active');
                    document.querySelector('.removechangeformonth').classList.remove('disabled');
                }
            }
            this.daysinsecondweek.push({
                day: dayindex,
                month: week,
            });
        }
        this.daysToAdd = this.daysToAdd + 7;
    }
    addDaysToThirdWeek = (monthcurrent, week) => {
        this.daysinthirdweek = [];

        const month = monthcurrent;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        for (let i = this.daysToAdd; i <= this.daysToAdd + 6; i++) {
            const dayindex = month[i].day
            if (month[i].workers[indexofworker].worker[1].hours.length > 1) {
                if (!document.querySelector('.week3').classList.contains('active')) {
                    document.querySelector('.week3').classList.add('active');
                    document.querySelector('.week3').classList.remove('disabled');
                    document.querySelector('.addweek3').innerHTML = "Edytuj zmiane na:<br>3 tydzień";
                    document.querySelector('.addweek3').setAttribute('data-edit', 'true');
                    document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'true');
                    document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                }
                if (!document.querySelector('.removemonth').classList.contains('active')) {
                    document.querySelector('.removemonth').classList.add('active');
                    document.querySelector('.removechangeformonth').classList.remove('disabled');
                }
            }
            this.daysinthirdweek.push({
                day: dayindex,
                month: week,
            });
        }
        this.daysToAdd = this.daysToAdd + 7;
    }
    addDaysToFourthWeek = (monthcurrent, aftermonth, week) => {
        this.daysinfourthweek = [];

        const acctualmonthfromtable = week;
        let indexofmonthtable;
        const monthtable = ['before', 'previous', 'current', 'next', 'after'];
        switch (week) {
            case 'before':
                indexofmonthtable = 0;
                break;
            case 'previous':
                indexofmonthtable = 1;
                break;
            case 'current':
                indexofmonthtable = 2;
                break;
            case 'next':
                indexofmonthtable = 3;
                break;
            case 'after':
                indexofmonthtable = 4;
                break;
        }

        const monthafter = aftermonth;
        const month = monthcurrent;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        for (let i = this.daysToAdd; i <= this.daysToAdd + 6; i++) {
            if (month[i] !== undefined) {
                const dayindex = month[i].day
                if (month[i].workers[indexofworker].worker[1].hours.length > 1) {
                    if (!document.querySelector('.week4').classList.contains('active')) {
                        document.querySelector('.week4').classList.add('active');
                        document.querySelector('.week4').classList.remove('disabled');
                        document.querySelector('.addweek4').innerHTML = "Edytuj zmiane na:<br>4 tydzień";
                        document.querySelector('.addweek4').setAttribute('data-edit', 'true');
                        document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'true');
                        document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                    }
                    if (!document.querySelector('.removemonth').classList.contains('active')) {
                        document.querySelector('.removemonth').classList.add('active');
                        document.querySelector('.removechangeformonth').classList.remove('disabled');
                    }
                }
                this.daysinfourthweek.push({
                    day: dayindex,
                    month: week,
                });
            }
        }
        if (this.daysinfourthweek.length < 7) {
            switch (this.daysinfourthweek.length) {
                case 0:
                    this.daysToAddAfter = 7;
                    break;
                case 1:
                    this.daysToAddAfter = 6;
                    break;
                case 2:
                    this.daysToAddAfter = 5;
                    break;
                case 3:
                    this.daysToAddAfter = 4;
                    break;
                case 4:
                    this.daysToAddAfter = 3;
                    break;
                case 5:
                    this.daysToAddAfter = 2;
                    break;
                case 6:
                    this.daysToAddAfter = 1;
                    break;
            }
        }
        if (this.daysToAddAfter > 0) {
            for (let i = this.daysToAddAfterFirstIndex; i <= this.daysToAddAfter - 1; i++) {
                if (monthafter[i] !== undefined) {
                    const dayindex = monthafter[i].day
                    if (monthafter[i].workers[indexofworker].worker[1].hours.length > 1) {
                        if (!document.querySelector('.week4').classList.contains('active')) {
                            document.querySelector('.week4').classList.add('active');
                            document.querySelector('.week4').classList.remove('disabled');
                            document.querySelector('.addweek4').innerHTML = "Edytuj zmiane na:<br>4 tydzień";
                            document.querySelector('.addweek4').setAttribute('data-edit', 'true');
                        }
                    }
                    this.daysinfourthweek.push({
                        day: dayindex,
                        month: monthtable[indexofmonthtable + 1]
                    });
                }
            }
            this.daysToAddAfterFirstIndex = this.daysToAddAfterFirstIndex + this.daysToAddAfter - 1;
            return this.daysToAdd = 0;
        }
        this.daysToAdd = this.daysToAdd + 7;
    }
    addDaysToFifthWeek = (monthcurrent, aftermonth, week) => {
        this.daysinfifthweek = [];

        const acctualmonthfromtable = week;
        let indexofmonthtable;
        const monthtable = ['before', 'previous', 'current', 'next', 'after'];
        switch (week) {
            case 'before':
                indexofmonthtable = 0;
                break;
            case 'previous':
                indexofmonthtable = 1;
                break;
            case 'current':
                indexofmonthtable = 2;
                break;
            case 'next':
                indexofmonthtable = 3;
                break;
            case 'after':
                indexofmonthtable = 4;
                break;
        }

        const monthafter = aftermonth;
        const month = monthcurrent;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        if (this.daysToAdd !== 0) {
            for (let i = this.daysToAdd; i <= this.daysToAdd + 6; i++) {
                if (month[i] !== undefined) {
                    const dayindex = month[i].day
                    if (month[i].workers[indexofworker].worker[1].hours.length > 1) {
                        if (!document.querySelector('.week5').classList.contains('active')) {
                            document.querySelector('.week5').classList.add('active');
                            document.querySelector('.week5').classList.remove('disabled');
                            document.querySelector('.addweek5').innerHTML = "Edytuj zmiane na:<br>5 tydzień";
                            document.querySelector('.addweek5').setAttribute('data-edit', 'true');
                            document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'true');
                            document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                        }
                        if (!document.querySelector('.removemonth').classList.contains('active')) {
                            document.querySelector('.removemonth').classList.add('active');
                            document.querySelector('.removechangeformonth').classList.remove('disabled');
                        }
                    }
                    this.daysinfifthweek.push({
                        day: dayindex,
                        month: week,
                    });
                }
            }
        }
        if (this.daysinfifthweek.length < 7) {
            switch (this.daysinfifthweek.length) {
                case 0:
                    this.daysToAddAfter = 7;
                    break;
                case 1:
                    this.daysToAddAfter = 6;
                    break;
                case 2:
                    this.daysToAddAfter = 5;
                    break;
                case 3:
                    this.daysToAddAfter = 4;
                    break;
                case 4:
                    this.daysToAddAfter = 3;
                    break;
                case 5:
                    this.daysToAddAfter = 2;
                    break;
                case 6:
                    this.daysToAddAfter = 1;
                    break;
            }
        }
        if (this.daysToAddAfter > 0) {
            for (let i = this.daysToAddAfterFirstIndex; i <= this.daysToAddAfterFirstIndex + this.daysToAddAfter - 1; i++) {
                if (monthafter[i] !== undefined) {
                    const dayindex = monthafter[i].day
                    if (monthafter[i].workers[indexofworker].worker[1].hours.length > 1) {
                        if (!document.querySelector('.week5').classList.contains('active')) {
                            document.querySelector('.week5').classList.add('active');
                            document.querySelector('.week5').classList.remove('disabled');
                            document.querySelector('.addweek5').innerHTML = "Edytuj zmiane na:<br>5 tydzień";
                            document.querySelector('.addweek5').setAttribute('data-edit', 'true');
                        }
                        if (!document.querySelector('.removemonth').classList.contains('active')) {
                            document.querySelector('.removemonth').classList.add('active');
                            document.querySelector('.removechangeformonth').classList.remove('disabled');
                        }
                    }
                    this.daysinfifthweek.push({
                        day: dayindex,
                        month: monthtable[indexofmonthtable + 1]
                    });
                }
            }
            this.daysToAdd = 0;
            return this.daysToAddAfterFirstIndex = this.daysToAddAfterFirstIndex + this.daysToAddAfter;
        }
        this.daysToAdd = this.daysToAdd + 7;
    }
    addDaysToSixthWeek = (monthcurrent, aftermonth, week) => {
        this.daysinsixthweek = [];

        const acctualmonthfromtable = week;
        let indexofmonthtable;
        const monthtable = ['before', 'previous', 'current', 'next', 'after'];
        switch (week) {
            case 'before':
                indexofmonthtable = 0;
                break;
            case 'previous':
                indexofmonthtable = 1;
                break;
            case 'current':
                indexofmonthtable = 2;
                break;
            case 'next':
                indexofmonthtable = 3;
                break;
            case 'after':
                indexofmonthtable = 4;
                break;
        }

        const monthafter = aftermonth;
        const month = monthcurrent;
        const indexofworker = month[0].workers.findIndex(e => e.worker[0].name === document.querySelector('.bottom__title').dataset.name);
        if (this.daysToAdd !== 0) {
            for (let i = this.daysToAdd; i <= this.daysToAdd + 6; i++) {
                if (month[i] !== undefined) {
                    const dayindex = month[i].day
                    if (month[i].workers[indexofworker].worker[1].hours.length > 1) {
                        if (!document.querySelector('.week6').classList.contains('active')) {
                            document.querySelector('.week6').classList.add('active');
                            document.querySelector('.week6').classList.remove('disabled');
                            document.querySelector('.addweek6').innerHTML = "Edytuj zmiane na:<br>6 tydzień";
                            document.querySelector('.addweek6').setAttribute('data-edit', 'true');
                            document.querySelector('.addchangeformonth p').setAttribute('data-edit', 'true');
                            document.querySelector('.addchangeformonth p').textContent = "Edytuj aktualną zmiane miesięczną";
                        }
                    }
                    this.daysinsixthweek.push({
                        day: dayindex,
                        month: week,
                    });
                }
            }
        }
        if (this.daysinsixthweek.length < 7) {
            switch (this.daysinsixthweek.length) {
                case 0:
                    this.daysToAddAfter = 7;
                    break;
                case 1:
                    this.daysToAddAfter = 6;
                    break;
                case 2:
                    this.daysToAddAfter = 5;
                    break;
                case 3:
                    this.daysToAddAfter = 4;
                    break;
                case 4:
                    this.daysToAddAfter = 3;
                    break;
                case 5:
                    this.daysToAddAfter = 2;
                    break;
                case 6:
                    this.daysToAddAfter = 1;
                    break;
            }
        }
        if (this.daysToAddAfter > 0) {
            for (let i = this.daysToAddAfterFirstIndex; i <= this.daysToAddAfterFirstIndex + this.daysToAddAfter - 1; i++) {
                if (monthafter[i] !== undefined) {
                    const dayindex = monthafter[i].day
                    if (monthafter[i].workers[indexofworker].worker[1].hours.length > 1) {
                        if (!document.querySelector('.week6').classList.contains('active')) {
                            document.querySelector('.week6').classList.add('active');
                            document.querySelector('.week6').classList.remove('disabled');
                            document.querySelector('.addweek6').innerHTML = "Edytuj zmiane na:<br>6 tydzień";
                            document.querySelector('.addweek6').setAttribute('data-edit', 'true');
                        }
                    }
                    this.daysinsixthweek.push({
                        day: dayindex,
                        month: monthtable[indexofmonthtable + 1],
                    });
                }
            }
        }
        this.daysToAdd = 0;
        this.daysToAddAfter = 0;
        this.daysToAddAfterFirstIndex = 0;
    }
    showHTMLStructureForAddWorker = () => {
        this.mainBottomContainer.innerHTML = "";

        const bottomadd = document.createElement('div');
        bottomadd.className = "bottom__addworker";
        const bottomaddContainer = document.createElement('div');
        bottomaddContainer.className = "bottom__container";
        const bottomaddinput1 = document.createElement('input');
        bottomaddinput1.type = "text";
        bottomaddinput1.placeholder = "Imie";
        bottomaddinput1.classList.add('name');
        const bottomaddinput2 = document.createElement('input');
        bottomaddinput2.type = "text";
        bottomaddinput2.placeholder = "Nazwisko";
        bottomaddinput2.classList.add('surname')
        const bottomaddinputsubmit = document.createElement('input');
        bottomaddinputsubmit.type = "submit";
        bottomaddinputsubmit.value = "Dodaj pracownika";
        bottomaddinputsubmit.classList.add('send');

        bottomaddContainer.appendChild(bottomaddinput1);
        bottomaddContainer.appendChild(bottomaddinput2);
        bottomaddContainer.appendChild(bottomaddinputsubmit);
        bottomadd.appendChild(bottomaddContainer);

        this.mainBottomContainer.appendChild(bottomadd);

        const inputs = [document.querySelector('.name'), document.querySelector('.surname')];
        inputs.forEach((e) => {
            e.addEventListener('input', () => this.hidePossibleInfo());
        })
        document.querySelector('.send').addEventListener('click', () => {
            this.checkCorrectForm();
        });

    }
    checkCorrectForm = () => {
        if (document.querySelector('.name').value === '' && document.querySelector('.surname').value === '') {
            if (document.querySelector('.Info') === null) {
                const elementInfo = document.createElement('p');
                elementInfo.className = "Info"
                elementInfo.textContent = "Przynajmniej jedno pole musi zostać uzupełnione";
                document.querySelector('.bottom__addworker').appendChild(elementInfo);
            }
        } else if (document.querySelector('.name').value.length > 20 || document.querySelector('.surname').value.length > 20) {
            if (document.querySelector('.Info') === null) {
                const elementInfo = document.createElement('p');
                elementInfo.className = "Info"
                elementInfo.textContent = "Można użyć maksymalnie 20 znaków na jedno pole";
                document.querySelector('.bottom__addworker').appendChild(elementInfo);
            }
        } else {
            this.ModalClass.setContentOfModalAcceptVisit("Czy na pewno chcesz dodać nowego pracownika?", "Pracownik został dodany");
            this.change = "worker";
            this.action = "add";
            this.ModalClass.showModalAcceptVisit();
        }
    }
    hidePossibleInfo = () => {
        if (document.querySelector('.bottom__addworker').querySelector('.Info') !== null) {
            document.querySelector('.bottom__addworker').removeChild(document.querySelector('.Info'));
        }
    }
    showHTMLStructureForRemoveWorker = (data) => {
        const workers = data;
        this.mainBottomContainer.innerHTML = "";

        const bottomremovenav = document.createElement('nav');
        bottomremovenav.className = "bottom__removeworker";
        const bottomremoveul = document.createElement('ul');
        bottomremoveul.className = "bottom__workers";
        if (workers.length < 1) {
            const bottomremovelia = document.createElement('p');
            bottomremovelia.textContent = "Brak pracowoników w bazie";
            bottomremovenav.appendChild(bottomremovelia);
            bottomremovenav.appendChild(bottomremoveul);
            this.mainBottomContainer.appendChild(bottomremovenav);
            return;
        }
        for (const el of workers) {
            const bottomremoveli = document.createElement('li');
            bottomremoveli.className = "bottom__worker";
            bottomremoveli.setAttribute('data-worker', `${el.worker[0].name}`);
            const bottomremovelia = document.createElement('p');
            bottomremovelia.textContent = el.worker[0].name;
            const bottomremovelibtn = document.createElement('button');
            bottomremovelibtn.textContent = "Usuń pracownika";
            bottomremovelibtn.setAttribute('data-worker', `${el.worker[0].name}`);

            bottomremoveli.appendChild(bottomremovelia);
            bottomremoveli.appendChild(bottomremovelibtn);
            bottomremoveul.appendChild(bottomremoveli);
        }

        bottomremovenav.appendChild(bottomremoveul);

        this.mainBottomContainer.appendChild(bottomremovenav);
        document.querySelectorAll('.bottom__worker button').forEach((e) => {
            this.ModalClass.setContentOfModalAcceptVisit("Czy na pewno chcesz usunąć tego pracownika?", "Pracownik został usunięty");
            this.change = "worker";
            this.action = "remove";
            e.addEventListener('click', () => {
                this.element = e;
                this.ModalClass.showModalAcceptVisit();
            });
        })
    }
    showHTMLStructureForManageWorker = (data) => {
        const workers = data;
        this.mainBottomContainer.innerHTML = "";

        const bottomremovenav = document.createElement('nav');
        bottomremovenav.className = "bottom__manageworker";
        const bottomremoveul = document.createElement('ul');
        bottomremoveul.className = "bottom__workers";
        if (workers.length < 1) {
            const bottomremovelia = document.createElement('p');
            bottomremovelia.textContent = "Brak pracowoników w bazie";
            bottomremovenav.appendChild(bottomremovelia);
            bottomremovenav.appendChild(bottomremoveul);
            this.mainBottomContainer.appendChild(bottomremovenav);
            return;
        }
        for (const el of workers) {
            const bottomremoveli = document.createElement('li');
            bottomremoveli.className = "bottom__worker";
            const bottomremovelia = document.createElement('p');
            bottomremovelia.textContent = el.worker[0].name;
            const bottomremovelibtn = document.createElement('button');
            bottomremovelibtn.className = "manageworker"
            bottomremovelibtn.setAttribute('data-name', el.worker[0].name);
            bottomremovelibtn.textContent = "Zarządzaj zmianami";

            const bottomremovelibtnstat = document.createElement('button');
            bottomremovelibtnstat.className = "stats"
            bottomremovelibtnstat.setAttribute('data-name', el.worker[0].name);
            bottomremovelibtnstat.textContent = "Zobacz statystyki";

            bottomremoveli.appendChild(bottomremovelia);
            bottomremoveli.appendChild(bottomremovelibtn);
            bottomremoveli.appendChild(bottomremovelibtnstat);
            bottomremoveul.appendChild(bottomremoveli);
        }

        bottomremovenav.appendChild(bottomremoveul);

        this.mainBottomContainer.appendChild(bottomremovenav);

        const buttons = document.querySelectorAll('.manageworker');
        buttons.forEach((e) => {
            e.addEventListener('click', async () => {
                this.ModalClass.showLoader();
                await this.calendarChangesOfWorker(e.dataset.name)
                this.ModalClass.hideLoader();
            })
        })
        const buttonsstat = document.querySelectorAll('.stats');
        buttonsstat.forEach((e) => {
            e.addEventListener('click', async () => {
                this.ModalClass.showLoader();
                await this.createHTMLStructureStatisticsOfWorker(e.dataset.name)
                this.ModalClass.hideLoader();
            })
        })
    }
    createHTMLStructureStatisticsOfWorker = async (WORKER) => {
        this.mainBottomContainer.innerHTML = "";

        const worker = WORKER;
        const bottomtitle = document.createElement('div');
        bottomtitle.textContent = `Przeglądasz statystyki dla: ${worker}`;
        bottomtitle.className = "bottom__title";

        const bottommonths = document.createElement('div');
        bottommonths.className = "bottom__months";
        const bottommonthsa1 = document.createElement('p');
        bottommonthsa1.textContent = "Poprzedni miesiąc";
        bottommonthsa1.setAttribute('data-month', 'previous');
        bottommonthsa1.classList.add('previous');
        bottommonthsa1.setAttribute('data-worker', worker);
        const bottommonthsa2 = document.createElement('p');
        bottommonthsa2.classList.add('acctual');
        bottommonthsa2.setAttribute('data-month', 'acctual');
        bottommonthsa2.setAttribute('data-worker', worker);
        bottommonthsa2.textContent = "Aktualny miesiąc"
        bottommonthsa2.className = "inactive";
        bottommonths.appendChild(bottommonthsa1);
        bottommonths.appendChild(bottommonthsa2);

        bottommonthsa1.addEventListener('click', () => {
            bottommonthsa1.classList.add('inactive');
            bottommonthsa2.classList.remove('inactive');
            this.createStatsStructureForWorkerInMonth(bottommonthsa1.dataset.month, bottommonthsa1.dataset.worker)
        });
        bottommonthsa2.addEventListener('click', () => {
            bottommonthsa2.classList.add('inactive');
            bottommonthsa1.classList.remove('inactive');
            this.createStatsStructureForWorkerInMonth(bottommonthsa2.dataset.month, bottommonthsa2.dataset.worker)
        });

        this.mainBottomContainer.appendChild(bottomtitle);
        this.mainBottomContainer.appendChild(bottommonths);

        this.ModalClass.showLoader();
        await this.fetchToTransferStatsForWorkerInCurrentMonth(bottommonthsa2.dataset.worker);
        this.ModalClass.hideLoader();
    }
    createStatsStructureForWorkerInMonth = async (MONTH, WORKER) => {
        const month = MONTH;
        const worker = WORKER;
        switch (month) {
            case 'acctual':
                this.ModalClass.showLoader();
                await this.fetchToTransferStatsForWorkerInCurrentMonth(worker);
                this.ModalClass.hideLoader();
                break;
            case 'previous':
                this.ModalClass.showLoader();
                await this.fetchToTransferStatsForWorkerInPreviousMonth(worker);
                this.ModalClass.hideLoader();
                break;
        }
    }
    fetchToTransferStatsForWorkerInPreviousMonth = (WORKER) => {
        return fetch('/transferstatsforworkerinpreviousmonth', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    worker: WORKER,
                })
            })
            .then(r => r.json())
            .then(data => this.createStructureForMonthToStats(data))
    }
    fetchToTransferStatsForWorkerInCurrentMonth = (WORKER) => {
        return fetch('/transferstatsforworkerincurrentmonth', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    worker: WORKER,
                })
            })
            .then(r => r.json())
            .then(data => this.createStructureForMonthToStats(data))
    }
    createStructureForMonthToStats = (data) => {
        if (document.querySelector('.bottom__stats') !== null) {
            document.querySelector('.bottom__stats').remove();
        }

        const bottomstats = document.createElement('div');
        bottomstats.className = "bottom__stats";
        const bottomstatstop = document.createElement('div');
        bottomstatstop.className = "bottom__stats--top";
        const bottomstatstoptitle = document.createElement('div');
        bottomstatstoptitle.className = "bottom__stats--title";
        const bottomstatstoptitleh1 = document.createElement('p');
        bottomstatstoptitleh1.textContent = "Statistics";
        const bottomstatstoptitlep = document.createElement('p');
        let acctualmonth;
        const date = new Date();
        acctualmonth = date.getMonth();
        switch (data.object.month) {
            case 'previous':
                if (acctualmonth === 0) {
                    acctualmonth = 11;
                } else {
                    acctualmonth--;
                }
                break;
        }
        bottomstatstoptitlep.textContent = `${data.object.days} ${this.tableOfMonths[acctualmonth]}`;
        bottomstatstoptitle.appendChild(bottomstatstoptitleh1);
        bottomstatstoptitle.appendChild(bottomstatstoptitlep);

        const bottomstatstopchangehours = document.createElement('div');
        bottomstatstopchangehours.className = "changehours";
        const bottomstatstopchangehoursa1 = document.createElement('p');
        const changehourss = data.object.hourschanges;
        const changehoursdotindex = changehourss.indexOf('.');
        if (changehoursdotindex !== -1) {
            let changehourssminutes = changehourss.slice(changehoursdotindex + 1);
            if (changehourssminutes === '25') {
                changehourssminutes = 15;
            } else if (changehourssminutes === '5') {
                changehourssminutes = 30;
            } else if (changehourssminutes === '75') {
                changehourssminutes = 45;
            }
            let hours = changehourss.slice(0, changehoursdotindex);
            if (hours === 0) {
                bottomstatstopchangehoursa1.textContent = `${changehourssminutes} minut`;
            } else {
                bottomstatstopchangehoursa1.textContent = `${hours} godzin, ${changehourssminutes} minut`;
            }
        } else {
            bottomstatstopchangehoursa1.textContent = `${changehourss} godzin`;
        }
        const bottomstatstopchangehoursa2 = document.createElement('p');
        bottomstatstopchangehoursa2.textContent = "Ilość czasu pracy w zmianach:";
        bottomstatstopchangehours.appendChild(bottomstatstopchangehoursa2);
        bottomstatstopchangehours.appendChild(bottomstatstopchangehoursa1);

        const bottomstatstopchangehoursofclients = document.createElement('div');
        bottomstatstopchangehoursofclients.className = "changehoursofclients";
        const bottomstatstopchangehoursofclientsa1 = document.createElement('p');
        const changehourssofclients = data.object.hourswithclients;
        const changehourofclientssdotindex = changehourssofclients.indexOf('.');
        if (changehourofclientssdotindex !== -1) {
            let changehourssofclientsminutes = changehourssofclients.slice(changehourofclientssdotindex + 1);
            if (changehourssofclientsminutes === '25') {
                changehourssofclientsminutes = 15;
            } else if (changehourssofclientsminutes === '5') {
                changehourssofclientsminutes = 30;
            } else if (changehourssofclientsminutes === '75') {
                changehourssofclientsminutes = 45;
            }
            let hoursofclients = changehourssofclients.slice(0, changehourofclientssdotindex);
            if (hoursofclients === 0) {
                bottomstatstopchangehoursofclientsa1.textContent = `${changehourssofclientsminutes} minut`;
            } else {
                bottomstatstopchangehoursofclientsa1.textContent = `${hoursofclients} godzin, ${changehourssofclientsminutes} minut`;
            }
        } else {
            bottomstatstopchangehoursofclientsa1.textContent = `${changehourssofclients} godzin`;
        }

        const bottomstatstopchangehoursofclientsa2 = document.createElement('p');
        bottomstatstopchangehoursofclientsa2.textContent = "Ilość czasu pracy z klientami:";
        bottomstatstopchangehoursofclients.appendChild(bottomstatstopchangehoursofclientsa2);
        bottomstatstopchangehoursofclients.appendChild(bottomstatstopchangehoursofclientsa1);

        bottomstatstop.appendChild(bottomstatstoptitle);
        bottomstatstop.appendChild(bottomstatstopchangehours);
        bottomstatstop.appendChild(bottomstatstopchangehoursofclients);

        const bottomstatsbottom = document.createElement('div');
        bottomstatsbottom.className = "bottom__stats--bottom";
        const bottomstatsbottomnumberofclients = document.createElement('div');
        bottomstatsbottomnumberofclients.className = "numberofclients";
        const bottomstatsbottomnumberofclientsa1 = document.createElement('p');
        bottomstatsbottomnumberofclientsa1.textContent = `Ilość obsłużonych klientów: ${data.object.clients}`;
        bottomstatsbottomnumberofclients.appendChild(bottomstatsbottomnumberofclientsa1);
        bottomstatsbottom.appendChild(bottomstatsbottomnumberofclients);

        bottomstats.appendChild(bottomstatstop);
        bottomstats.appendChild(bottomstatsbottom);


        this.mainBottomContainer.appendChild(bottomstats);
    }
    calendarChangesOfWorker = (name) => {
        this.mainBottomContainer.innerHTML = "";

        const bottomtitle = document.createElement('div');
        bottomtitle.setAttribute('data-name', name);
        bottomtitle.className = "bottom__title";
        const bottomtitleh1 = document.createElement('p')
        bottomtitleh1.innerHTML = `Zarządzasz teraz pracownikiem:<br> ${name}`;
        bottomtitle.appendChild(bottomtitleh1);
        const bottommontheul = document.createElement('ul');
        bottommontheul.className = "bottom__months";
        const bottommonthli1 = document.createElement('li');
        bottommonthli1.className = "bottom__month prev";
        const bottommonthlia1 = document.createElement('p');
        bottommonthlia1.textContent = "Poprzedni miesiąc";
        const bottommonthli2 = document.createElement('li');
        bottommonthli2.className = "bottom__month current";
        const bottommonthlia2 = document.createElement('p');
        bottommonthlia2.textContent = "Aktualny miesiąc";
        const bottommonthli3 = document.createElement('li');
        bottommonthli3.className = "bottom__month next";
        const bottommonthlia3 = document.createElement('p');
        bottommonthlia3.textContent = "Następny miesiąc";

        bottommonthli1.appendChild(bottommonthlia1);
        bottommonthli2.appendChild(bottommonthlia2);
        bottommonthli3.appendChild(bottommonthlia3);
        bottommontheul.appendChild(bottommonthli1);
        bottommontheul.appendChild(bottommonthli2);
        bottommontheul.appendChild(bottommonthli3);
        this.mainBottomContainer.appendChild(bottomtitle);
        this.mainBottomContainer.appendChild(bottommontheul);

        const bottomactivemonth = document.createElement('div');
        bottomactivemonth.className = "bottom__activemonth";
        const bottomactivemonthactive = document.createElement('div');
        bottomactivemonthactive.className = "bottom__active";
        const bottomactivemonthactivecontainer = document.createElement('div');
        bottomactivemonthactivecontainer.className = "bottom__active--container";
        const bottomcalendartitle = document.createElement('div');
        bottomcalendartitle.className = "calendar__title";
        const bottomcalendartitleh1 = document.createElement('p');
        const date = new Date();
        let month = date.getMonth();
        bottomcalendartitleh1.textContent = this.tableOfMonths[month];
        bottomcalendartitle.appendChild(bottomcalendartitleh1);
        const bottomcalendarmain = document.createElement('div');
        bottomcalendarmain.className = "calendar__main";
        const bottomactivemonthnames = document.createElement('div');
        bottomactivemonthnames.className = "calendar__names";
        const bottomactivemonthname1 = document.createElement('div');
        bottomactivemonthname1.className = "calendar__monday"
        bottomactivemonthname1.textContent = "Pn";
        const bottomactivemonthname2 = document.createElement('div');
        bottomactivemonthname2.className = "calendar__tuesday"
        bottomactivemonthname2.textContent = "Wt";
        const bottomactivemonthname3 = document.createElement('div');
        bottomactivemonthname3.className = "calendar__wednesday"
        bottomactivemonthname3.textContent = "Śr";
        const bottomactivemonthname4 = document.createElement('div');
        bottomactivemonthname4.className = "calendar__thursday"
        bottomactivemonthname4.textContent = "Cz";
        const bottomactivemonthname5 = document.createElement('div');
        bottomactivemonthname5.className = "calendar__friday"
        bottomactivemonthname5.textContent = "Pt";
        const bottomactivemonthname6 = document.createElement('div');
        bottomactivemonthname6.className = "calendar__saturday"
        bottomactivemonthname6.textContent = "So";
        const bottomactivemonthname7 = document.createElement('div');
        bottomactivemonthname7.className = "calendar__sunday";
        bottomactivemonthname7.textContent = "N";
        bottomactivemonthnames.appendChild(bottomactivemonthname1);
        bottomactivemonthnames.appendChild(bottomactivemonthname2);
        bottomactivemonthnames.appendChild(bottomactivemonthname3);
        bottomactivemonthnames.appendChild(bottomactivemonthname4);
        bottomactivemonthnames.appendChild(bottomactivemonthname5);
        bottomactivemonthnames.appendChild(bottomactivemonthname6);
        bottomactivemonthnames.appendChild(bottomactivemonthname7);
        const bottomactivemonthcalendardays = document.createElement('div');
        bottomactivemonthcalendardays.className = "calendar__days";
        bottomcalendarmain.appendChild(bottomactivemonthcalendardays);

        const activemonthleft = document.createElement('div');
        activemonthleft.className = "bottom__leftside";
        for (let i = 1; i <= 6; i++) {
            const leftspan = document.createElement('span');
            const cont = document.createElement('div');
            cont.className = 'bottom__leftside--container';
            const leftspana = document.createElement('p');
            leftspana.setAttribute('data-week', i);
            leftspana.classList.add(`addweek${i}`);
            leftspana.innerHTML = `Dodaj zmiane na:<br>${i} tydzień`;
            cont.appendChild(leftspana);
            leftspan.appendChild(cont);
            activemonthleft.appendChild(leftspan);
        }
        const activemonthright = document.createElement('div');
        activemonthright.className = "bottom__rightside";
        for (let i = 1; i <= 6; i++) {
            const rightspan = document.createElement('span');
            const cont = document.createElement('div');
            cont.className = 'bottom__rightside--container';
            const rightspana = document.createElement('p');
            rightspan.setAttribute('data-week', i);
            rightspan.classList.add(`week${i}`)
            rightspan.classList.add(`disabled`);
            rightspana.innerHTML = `Usuń zmiane na:<br>${i} tydzień`;
            cont.appendChild(rightspana);
            rightspan.appendChild(cont);
            activemonthright.appendChild(rightspan);
        }
        const bottomChange = document.createElement('div');
        bottomChange.className = "bottom__change";
        const changespan1 = document.createElement('span');
        changespan1.className = "addchangeformonth";
        const changespan1a = document.createElement('p');
        changespan1a.textContent = "Dodaj zmiane na cały miesiąc";
        changespan1.appendChild(changespan1a);

        const changespan2 = document.createElement('span');
        changespan2.className = "removechangeformonth";
        const changespan2a = document.createElement('p');
        changespan2a.textContent = "Usuń zmiane na cały miesiąc";
        changespan2a.className = "removemonth disabled";
        changespan2.appendChild(changespan2a);

        bottomChange.appendChild(changespan1);
        bottomChange.appendChild(changespan2);
        bottomactivemonthactivecontainer.appendChild(bottomcalendartitle);
        bottomactivemonthactivecontainer.appendChild(bottomactivemonthnames);
        bottomactivemonthactivecontainer.appendChild(bottomcalendarmain);
        bottomactivemonthactive.appendChild(bottomactivemonthactivecontainer);
        bottomactivemonth.appendChild(activemonthleft);
        bottomactivemonth.appendChild(activemonthright);
        bottomactivemonth.appendChild(bottomChange);
        bottomactivemonth.appendChild(bottomactivemonthactive);
        this.mainBottomContainer.appendChild(bottomactivemonth);
        const bottomMonthsall = document.querySelectorAll('.bottom__months li');
        document.querySelector('.current').classList.add('inactive');
        const prevBtn = document.querySelector('.prev').addEventListener('click', async () => {
            const date = new Date();
            let month = date.getMonth();
            if (month === 0) {
                month = 11;
            } else month--;
            bottomcalendartitleh1.textContent = this.tableOfMonths[month];
            bottomMonthsall.forEach((e) => {
                e.classList.remove('inactive');
            })
            document.querySelector('.prev').classList.add('inactive');
            this.currentMonth = 'previous';
            this.ModalClass.showLoader();
            await this.transferCalendar('previous');
            this.ModalClass.hideLoader();
        });
        const currentBtn = document.querySelector('.current').addEventListener('click', async () => {
            const date = new Date();
            let month = date.getMonth();
            bottomcalendartitleh1.textContent = this.tableOfMonths[month];
            bottomMonthsall.forEach((e) => {
                e.classList.remove('inactive');
            })
            document.querySelector('.current').classList.add('inactive');
            this.currentMonth = 'current'
            this.ModalClass.showLoader();
            await this.transferCalendar('current')
            this.ModalClass.hideLoader();
        });
        const nextBtn = document.querySelector('.next').addEventListener('click', async () => {
            const date = new Date();
            let month = date.getMonth();
            if (month === 11) {
                month = 0;
            } else month++;
            bottomcalendartitleh1.textContent = this.tableOfMonths[month];
            bottomMonthsall.forEach((e) => {
                e.classList.remove('inactive');
            })
            document.querySelector('.next').classList.add('inactive');
            this.currentMonth = 'next';
            this.ModalClass.showLoader();
            await this.transferCalendar('next')
            this.ModalClass.hideLoader();
        });
        this.containerForManageMonth = document.querySelector('.calendar__days');
        const bottomleftsidespan = document.querySelectorAll('.bottom__leftside span p');
        const bottomrightsidespan = document.querySelectorAll('.bottom__rightside span');
        const removechangemonth = document.querySelector('.removechangeformonth');
        const addchangemonth = document.querySelector('.addchangeformonth p');
        bottomleftsidespan.forEach((e) => {
            e.addEventListener('click', () => {
                const breaks = [...document.querySelectorAll('.break')];
                if (breaks.length > 0) {
                    breaks.forEach((e) => {
                        e.remove();
                    })
                }
                this.ModalClass.hideInform();
                this.ModalClass.hideModalChangeInfo();
                this.action = 'add';
                this.change = 'week';
                this.element = e;
                this.ModalClass.showModalChange();
                if (e.dataset.edit === 'true') {
                    this.ModalClass.setContentOfModalChange('Czy na pewno chcesz edytować aktualną zmiane tygodniową?', "Zmiana została zmieniona", "Edytuj zmiane");
                    this.ModalClass.showModalChangeInfo("Edytowanie aktualnej zmiany tygodniowej spowoduje utratę aktualnie zapisanych wizyt w tygodniu , który edytujesz.");
                    return;
                }
                this.ModalClass.setContentOfModalChange('Czy na pewno chcesz dodać zmiane tygodniową?', "Zmiana została dodana", "Dodaj zmiane");
            });
        })
        bottomrightsidespan.forEach((e) => {
            e.addEventListener('click', () => {
                this.action = 'remove';
                this.change = 'week';
                this.element = e;
                this.ModalClass.showModalAcceptVisit();
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć zmiane tygodniową?', "Zmiana została usunięta");
            });
        })
        addchangemonth.addEventListener('click', (e) => {
            const breaks = [...document.querySelectorAll('.break')];
            if (breaks.length > 0) {
                breaks.forEach((e) => {
                    e.remove();
                })
            }
            this.ModalClass.hideInform();
            this.ModalClass.hideModalChangeInfo();
            this.action = 'add';
            this.change = 'month';
            this.ModalClass.showModalChange();
            if (e.target.dataset.edit === 'true') {
                this.ModalClass.setContentOfModalChange('Czy na pewno chcesz edytować aktualną zmiane miesięczną?', "Zmiana została zmieniona", "Edytuj zmiane");
                this.ModalClass.showModalChangeInfo("Edytowanie aktualnej zmiany miesięcznej spowoduje utratę aktualnie zapisanych wizyt w miesiącu , który edytujesz.");
                return;
            }
            this.ModalClass.setContentOfModalChange('Czy na pewno chcesz dodać zmiane miesięczną?', "Zmiana została dodana", "Dodaj zmiane");
        });
        removechangemonth.addEventListener('click', () => {
            this.action = 'remove';
            this.change = 'month';
            this.ModalClass.showModalAcceptVisit();
            this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć zmiane miesięczną?', "Zmiana została usunięta");
        });
        return this.transferCalendar('current');
    }
    acceptModalChange = async () => {
        this.ModalClass.exitModalChange();
        this.ModalClass.showLoader()
        if (this.action === 'set') {
            if (this.change === 'day') {
                await this.addFreeForDay(this.element.dataset.day, this.element.dataset.month, document.querySelector('.bottom__title').dataset.name);
                await this.transferCalendar(this.currentMonth);
            }
        } else if (this.action === 'unset') {
            if (this.change === 'day') {
                await this.removeFreeForDay(this.element.dataset.day, this.element.dataset.month, document.querySelector('.bottom__title').dataset.name);
                await this.transferCalendar(this.currentMonth);
            }
        } else if (this.action === 'add') {
            if (this.change === 'worker') {
                await this.addWorkerFetch(document.querySelector('.name').value, document.querySelector('.surname').value);
                this.mainBottomContainer.innerHTML = "";
            }
            if (this.change === "day") {
                await this.addChangeForDay(this.element.dataset.day, this.element.dataset.month, document.querySelector('.bottom__title').dataset.name, document.querySelector('.from').value, document.querySelector('.to').value);
                await this.transferCalendar(this.currentMonth);
            } else if (this.change === "week") {
                await this.addChangeForWeek(this.element.dataset.week, document.querySelector('.bottom__title').dataset.name, document.querySelector('.from').value, document.querySelector('.to').value)
                await this.transferCalendar(this.currentMonth)
            } else if (this.change === "month") {
                await this.addChangeForMonth(document.querySelector('.bottom__title').dataset.name, document.querySelector('.from').value, document.querySelector('.to').value);
                await this.transferCalendar(this.currentMonth);
            }
        } else if (this.action === "remove") {
            if (this.change === "worker") {
                await this.removeWorkerFetch(this.element.dataset.worker);
                this.mainBottomContainer.innerHTML = "";
            } else if (this.change === "day") {
                await this.removeChangeForDay(this.element.dataset.day, this.element.dataset.month, document.querySelector('.bottom__title').dataset.name)
                await this.transferCalendar(this.currentMonth);
            } else if (this.change === "week") {
                await this.removeChangeForWeek(this.element.dataset.week, document.querySelector('.bottom__title').dataset.name)
                await this.transferCalendar(this.currentMonth);
            } else if (this.change === "month") {
                await this.removeChangeForMonth(document.querySelector('.bottom__title').dataset.name)
                await this.transferCalendar(this.currentMonth);
            }
        }
        this.socket.emit('message', 'resetfromadminpanel');
        this.action = '';
        this.ModalClass.hideLoader();
        this.ModalClass.showInfoModalInformation();
        localStorage.clear();
        localStorage.setItem("refresh", "refreshfrommanage");
    }
}