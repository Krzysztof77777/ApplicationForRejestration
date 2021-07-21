import {
    Clientlist
} from './clientlist.js';
import {
    Modal
} from './modal.js';

export class workersDay {
    ClassClientlist = new Clientlist;
    ModalClass = new Modal;

    tableOfMonths = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
    tableOfHours = ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', ]
    AcctualMonth;
    AcctualDay;
    mainContent = document.querySelector('.main__content');
    modalBgc = document.querySelector('.modal__background');
    modalMainInputs = document.querySelectorAll('.modal__main input');
    modalYes = document.querySelector('.modalyesvisit');
    modalToContainer = document.querySelector('.modal__main__to--container');
    modalFromContainer = document.querySelector('.modal__main__from--container');
    modalVisitToContainer = document.querySelector('.modal__visit__to--container');
    modalVisitFromContainer = document.querySelector('.modal__visit__from--container');
    ModalInputName = document.querySelector('.name');
    ModalInputNumber = document.querySelector('.number');
    datalistBrowser = document.querySelector('#browsers');
    Acctualdata = document.querySelector('.data');
    leftarrow = document.querySelector('.fa-long-arrow-alt-left');
    rightarrow = document.querySelector('.fa-long-arrow-alt-right');
    transferedData;
    ClickedElement;
    action;
    database;
    urlchoose;
    socket = io(`${window.location.origin}`);
    constructor() {
        this.ModalClass.addEventsListener();

        this.socket.on('message', async (data) => {
            switch (data) {
                case 'resetbaseofclientsandbaseofday':
                    this.ModalClass.showLoader();
                    this.ClassClientlist.clearSearchEngineInputValue();
                    this.ClassClientlist.scrollTo0Y();
                    await this.ClassClientlist.fetchToTransferDatabaseFromInit()
                    await this.ClassClientlist.fetchToCheckLengthOfDatabase();
                    await this.transferDay();
                    this.ModalClass.hideLoader();
                    break;
                case 'resetfromadminpanel':
                    this.ModalClass.showLoader();
                    this.ClassClientlist.clearSearchEngineInputValue();
                    this.ClassClientlist.scrollTo0Y();
                    await this.ClassClientlist.fetchToTransferDatabaseFromInit()
                    await this.ClassClientlist.fetchToCheckLengthOfDatabase();
                    await this.transferDay();
                    this.ModalClass.hideLoader();
                    break;
            }
        })
        window.addEventListener('storage', () => this.checkStorage());
        this.checkAdminOrWorkerLogined();
        this.setHrefToLeftArrow();
        this.setHrefToRightArrow();
        this.getMonthFromUrlParams();
        this.getDayFromUrlParams();
        this.transferDay();
        this.modalYes.addEventListener('click', () => this.yesModalAccept());
        this.modalMainInputs.forEach((e) => {
            e.addEventListener('input', () => {
                this.checkPossibleCreateDatalist();
            });
        })
        this.ModalInputNumber.addEventListener('change', () => this.selectOption())
        this.checkMonth();
        this.setMonthText();
    }
    checkStorage = () => {
        if (localStorage.refresh !== 'refreshfromday' && localStorage.refresh !== undefined) {
            localStorage.clear();
            window.location.reload();
        }
    }
    checkAdminOrWorkerLogined = () => {
        let url = window.location.href;
        if (url[url.length - 1] === '/') {
            url = url.slice(0, url.length - 1);
        }
        url = url.slice(0, url.lastIndexOf('/'));
        url = url.slice(0, url.lastIndexOf('/'));
        url = url.slice(url.lastIndexOf('/') + 1);
        this.urlchoose = url;
    }
    setInActiveLeftArrow = () => {
        this.leftarrow.classList.add('inactive');
    }
    setInkActiveRightArrow = () => {
        this.rightarrow.classList.add('inactive');
    }
    setHrefToRightArrow = async () => {
        const months = ['before', 'previous', 'current', 'next', 'after'];
        const acctualhref = window.location.href.substr(window.location.href.lastIndexOf('/'));
        const monthfrohref = acctualhref.slice(acctualhref.indexOf('=') + 1, acctualhref.indexOf('&'));
        let dayfromhref = Math.floor(acctualhref.substr(acctualhref.lastIndexOf('=') + 1));
        let indexofacctualmonth;
        let dayofacctualmonth;
        const daysinthismonth = await this.fetchToCheckLenghtOfDaysInMonth(monthfrohref);
        if (daysinthismonth === dayfromhref && monthfrohref === months[months.length - 1]) {
            return this.setInkActiveRightArrow();
        } else if (daysinthismonth === dayfromhref) {
            indexofacctualmonth = months.findIndex(e => e === monthfrohref);
            indexofacctualmonth++;
            dayofacctualmonth = 1;
        } else {
            indexofacctualmonth = months.findIndex(e => e === monthfrohref);
            dayofacctualmonth = dayfromhref + 1;
        }
        this.rightarrow.href = `/${this.urlchoose}/day/day?month=${months[indexofacctualmonth]}&day=${dayofacctualmonth}`;
    }
    setHrefToLeftArrow = async () => {
        const months = ['before', 'previous', 'current', 'next', 'after'];
        const acctualhref = window.location.href.substr(window.location.href.lastIndexOf('/'));
        const monthfrohref = acctualhref.slice(acctualhref.indexOf('=') + 1, acctualhref.indexOf('&'));
        const dayfromhref = Math.floor(acctualhref.substr(acctualhref.lastIndexOf('=') + 1));
        const daysinthismonth = await this.fetchToCheckLenghtOfDaysInMonth(monthfrohref);
        let indexofacctualmonth;
        let dayofacctualmonth;
        if (1 === dayfromhref && monthfrohref === months[0]) {
            return this.setInActiveLeftArrow();
        } else if (1 === dayfromhref) {
            indexofacctualmonth = months.findIndex(e => e === monthfrohref);
            indexofacctualmonth--;
            dayofacctualmonth = await this.fetchToCheckLenghtOfDaysInMonth(months[indexofacctualmonth]);
        } else {
            indexofacctualmonth = months.findIndex(e => e === monthfrohref);
            dayofacctualmonth = dayfromhref - 1;
        }
        this.leftarrow.href = `/${this.urlchoose}/day/day?month=${months[indexofacctualmonth]}&day=${dayofacctualmonth}`;
    }
    fetchToCheckLenghtOfDaysInMonth = (MONTH) => {
        return fetch('/checklengthdaysofmonth', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    month: MONTH,
                })
            })
            .then(r => r.json())
            .then(data => {
                return data.days
            })
    }
    checkMonth = () => {
        const newDate = new Date();
        let AcctualMonth = newDate.getMonth();
        if (this.AcctualMonth === 'current') {
            return AcctualMonth;
        } else if (this.AcctualMonth === 'previous') {
            AcctualMonth--;
            if (AcctualMonth === -1) {
                AcctualMonth = 11;
            }
        } else if (this.AcctualMonth === 'next') {
            AcctualMonth++;
            if (AcctualMonth === 12) {
                AcctualMonth = 0;
            }
        } else if (this.AcctualMonth === 'before') {
            AcctualMonth -= 2;
            if (AcctualMonth === -1) {
                AcctualMonth = 11;
            } else if (AcctualMonth === -2) {
                AcctualMonth = 10;
            }
        } else if (this.AcctualMonth === 'after') {
            AcctualMonth += 2;
            if (AcctualMonth === 12) {
                AcctualMonth = 1;
            } else if (AcctualMonth === 11) {
                AcctualMonth = 0;
            }
        }
        return AcctualMonth;
    }
    setMonthText = () => {
        const monthindex = this.checkMonth();
        const month = this.tableOfMonths[monthindex];
        this.Acctualdata.textContent = `${this.AcctualDay} ${month}`;
    }
    checkPossibleCreateDatalist = () => {
        if (this.ModalInputNumber.value.length <= 5) {
            this.datalistBrowser.innerHTML = "";
        }
        if (this.ModalInputNumber.value.length > 5 && this.ModalInputNumber.value.length < 7) {
            this.transferDatabaseWhichCharacters(this.ModalInputNumber.value);
        }
    }
    transferDay = () => {
        return fetch('/transferday', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    month: this.AcctualMonth,
                    day: this.AcctualDay
                })
            })
            .then(r => r.json())
            .then(data => {
                this.transferedData = data.data[0]
                this.createHTMLStructure(data)
            })
    }
    transferDatabaseWhichCharacters = (CHARACTERS) => {
        fetch('/transferdatabase', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    characters: CHARACTERS,
                })
            })
            .then(r => r.json())
            .then(data => {
                this.database = data.data
                this.createDatalistHTMLStructure();
            });
    }
    createDatalistHTMLStructure = () => {
        this.datalistBrowser.innerHTML = "";
        const fragmet = document.createDocumentFragment();
        for (const el of this.database) {
            const option = document.createElement('option');
            option.setAttribute('data-name', el.name);
            option.setAttribute('data-number', el.contact);
            option.value = `${el.contact} ${el.name}`;
            if (el.status === "blacklist") {
                option.value = `${el.contact} ${el.name}(czarna lista)`;
            }
            fragmet.appendChild(option);
        }
        this.datalistBrowser.appendChild(fragmet);
    }
    fetchToRemoveClient = () => {
        return fetch('/removeclient', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                month: this.AcctualMonth,
                day: this.AcctualDay,
                worker: this.ClickedElement.dataset.worker,
                fromStart: this.ClickedElement.dataset.from,
                ToStart: this.ClickedElement.dataset.to,
            })
        })
    }
    fetchToRemoveBreak = () => {
        return fetch('/removebreak', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                month: this.AcctualMonth,
                day: this.AcctualDay,
                worker: this.ClickedElement.dataset.worker,
                fromStart: this.ClickedElement.dataset.from,
                ToStart: this.ClickedElement.dataset.to,
            })
        })
    }
    fetchToAddBreak = () => {
        return fetch('/addbreak', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                month: this.AcctualMonth,
                day: this.AcctualDay,
                worker: this.ClickedElement.dataset.worker,
                fromStart: this.ClickedElement.dataset.from,
                ToStart: this.ClickedElement.dataset.to,
                FromEnd: document.querySelector('input[type="radio"][name="from"]:checked').value,
                ToEnd: document.querySelector('input[type="radio"][name="to"]:checked').value,
            })
        })
    }
    fetchToAddClient = () => {
        return fetch('/addclient', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                month: this.AcctualMonth,
                day: this.AcctualDay,
                worker: this.ClickedElement.dataset.worker,
                name: this.ModalInputName.value,
                number: this.ModalInputNumber.value,
                fromStart: this.ClickedElement.dataset.from,
                ToStart: this.ClickedElement.dataset.to,
                FromEnd: document.querySelector('input[type="radio"][name="from"]:checked').value,
                ToEnd: document.querySelector('input[type="radio"][name="to"]:checked').value,
            })
        })
    }
    getMonthFromUrlParams = () => {
        const date = new Date();
        const acctualDay = date.getDate();
        const tableofmonth = ['before', 'previous', 'current', 'next', 'after'];
        const allUrl = window.location.search;
        const month = allUrl.substring(allUrl.indexOf('=') + 1, allUrl.indexOf('&'));
        let indexofmonth = tableofmonth.findIndex(e => e === month);
        if (indexofmonth === -1) {
            return window.location.href = `/${this.urlchoose}/day/day?month=current&day=${acctualDay}`;
        }
        return this.AcctualMonth = month;
    }
    getDayFromUrlParams = () => {
        const allUrl = window.location.search;
        let day = allUrl.substring(allUrl.lastIndexOf('=') + 1);
        day = parseFloat(day);
        return this.AcctualDay = day;
    }
    createHTMLStructure = (datap) => {
        const data = datap;
        const date = new Date();
        const acctualDay = date.getDate();
        this.mainContent.innerHTML = "";
        if (data.data[0] !== undefined) {
            if (data.data[0].workers.length < 1) {
                const info = document.createElement('p');
                info.textContent = "Brak dodanych pracowników w bazie danych";
                return this.mainContent.appendChild(info);
            }
            data.data[0].workers.forEach((el, index) => {
                this.createHTMLDayForOneWorker(el, index);
            })
        } else {
            return window.location.href = `/${this.urlchoose}/day/day?month=current&day=${acctualDay}`;
        }
    }
    createHTMLDayForOneWorker = (el, index) => {

        const slide = document.createElement('div');
        slide.className = 'main__slide';
        const slidecont = document.createElement('div');
        slidecont.className = 'main__slide--container';
        const slideworker = document.createElement('div');
        slideworker.className = "slide__worker";
        const slideworkerp = document.createElement('p');
        slideworkerp.className = 'worker';
        slideworkerp.textContent = `${el.worker[0].name}`;
        slideworker.appendChild(slideworkerp);
        slidecont.appendChild(slideworker);
        const slidereservations = document.createElement('div');
        slidereservations.className = "slide__reservations";
        slidereservations.setAttribute('data-indexreserv', `${index}`);

        if (el.worker[2].change.from === '' && el.worker[2].change.to === '' || el.worker[2].change.from === 'freeday' && el.worker[2].change.to === 'freeday') {
            const slidereservation = document.createElement('div');
            slidereservation.className = "slide__status"
            const slidereservationp1 = document.createElement('p');
            slidereservationp1.textContent = "Brak zmiany";
            if (el.worker[2].change.from === 'freeday' && el.worker[2].change.to === 'freeday') {
                slidereservationp1.textContent = "Dzień wolny";
                slidereservationp1.classList.className = "pink";
            }
            slidereservation.appendChild(slidereservationp1);
            slidecont.appendChild(slidereservation);
            slide.appendChild(slidecont);
            return this.mainContent.appendChild(slide);
        }
        for (const element of el.worker[1].hours) {
            if (element.status === 'deactivefromprev' || element.status === 'deactivefrombreak') {

            } else if (element.status !== 'break') {
                const slidereservation = document.createElement('div');
                slidereservation.setAttribute('data-reservation', 'true');
                slidereservation.className = "slide__reservation";
                const slidereservationhour = document.createElement('div');
                slidereservationhour.className = "slide__hour";
                const slidereservationhourp1 = document.createElement('p');
                slidereservationhourp1.className = "termin";
                slidereservationhourp1.textContent = "Termin";
                const slidereservationhourp2 = document.createElement('p');
                slidereservationhourp2.className = "from";
                slidereservationhourp2.textContent = `Od ${element.from}`
                const slidereservationhourp3 = document.createElement('p');
                slidereservationhourp3.className = "to";
                slidereservationhourp3.textContent = `Do ${element.to}`
                slidereservationhour.appendChild(slidereservationhourp1);
                slidereservationhour.appendChild(slidereservationhourp2);
                slidereservationhour.appendChild(slidereservationhourp3);

                const slidereservationclient = document.createElement('div');
                slidereservationclient.className = "slide__client";
                const slidereservationclientp1 = document.createElement('p');
                slidereservationclientp1.className = "client";
                slidereservationclientp1.textContent = "Klient";
                const slidereservationclientp2 = document.createElement('p');
                slidereservationclientp2.className = "client--info";
                const slidereservationadd = document.createElement('div');
                slidereservationadd.setAttribute('data-worker', el.worker[0].name);
                slidereservationadd.setAttribute('data-from', element.from);
                slidereservationadd.setAttribute('data-to', element.to);
                slidereservationadd.className = `slide__add`;
                const slidereservationaddp = document.createElement('p');
                slidereservationaddp.className = "addClient";
                const slidereservationremove = document.createElement('div');
                slidereservationremove.setAttribute('data-worker', el.worker[0].name);
                slidereservationremove.setAttribute('data-from', element.from);
                slidereservationremove.setAttribute('data-to', element.to);
                slidereservationremove.className = `slide__remove`;
                const slidereservationremovep = document.createElement('p');
                slidereservationremovep.className = "removeclient";
                slidereservationremove.textContent = "Usuń wizyte";
                const slidereservationaddbreak = document.createElement('div');
                slidereservationaddbreak.setAttribute('data-worker', el.worker[0].name);
                slidereservationaddbreak.setAttribute('data-from', element.from);
                slidereservationaddbreak.setAttribute('data-to', element.to);
                slidereservationaddbreak.className = `slide__addbreak`;
                const slidereservationaddbreakp = document.createElement('p');
                slidereservationaddbreakp.className = "addbreak";
                slidereservationaddbreak.textContent = "Dodaj przerwe";
                if (element.status === 'active') {
                    slidereservationclientp2.innerText = `Brak klienta`;
                    slidereservationaddp.textContent = "Dodaj wizyte";
                    slidereservationremove.classList.add('disabled');
                } else {
                    slidereservationadd.setAttribute('data-edit', 'true');
                }
                if (element.status === 'booked') {
                    slidereservationclientp2.innerHTML = `${element.client[0].name}<br>${element.client[0].contact}`
                    slidereservationaddp.textContent = "Edytuj wizyte";
                    slidereservationadd.setAttribute('data-client', element.client[0].name);
                    slidereservationadd.setAttribute('data-number', element.client[0].contact);
                    slidereservationaddbreak.classList.add('disabled');
                }
                const indexfirsttohour = this.tableOfHours.findIndex(e => e === element.from);
                let indexlasttohour = this.tableOfHours.findIndex(e => e === element.to);
                if (indexfirsttohour + 2 < indexlasttohour) {
                    slidereservationadd.setAttribute('data-edit', 'true');
                }
                slidereservationaddbreak.appendChild(slidereservationaddbreakp);
                slidereservationadd.appendChild(slidereservationaddp);
                slidereservationclient.appendChild(slidereservationclientp1);
                slidereservationclient.appendChild(slidereservationclientp2);
                slidereservationremove.appendChild(slidereservationremovep);
                slidereservation.appendChild(slidereservationhour);
                slidereservation.appendChild(slidereservationclient);
                slidereservation.appendChild(slidereservationadd);
                slidereservation.appendChild(slidereservationremove);
                slidereservation.appendChild(slidereservationaddbreak);
                slidecont.appendChild(slidereservation);
            } else if (element.status === 'break') {
                const slidereservation = document.createElement('div');
                slidereservation.setAttribute('data-reservation', 'true');
                slidereservation.className = "slide__break";
                const slidereservationhour = document.createElement('div');
                slidereservationhour.className = "slide__hour";
                const slidereservationhourp1 = document.createElement('p');
                slidereservationhourp1.className = "termin";
                slidereservationhourp1.textContent = "Przerwa";
                const slidereservationhourp2 = document.createElement('p');
                slidereservationhourp2.className = "from";
                slidereservationhourp2.textContent = `Od ${element.from}`
                const slidereservationhourp3 = document.createElement('p');
                slidereservationhourp3.className = "to";
                slidereservationhourp3.textContent = `Do ${element.to}`
                slidereservationhour.appendChild(slidereservationhourp1);
                slidereservationhour.appendChild(slidereservationhourp2);
                slidereservationhour.appendChild(slidereservationhourp3);

                const slidereservationhouredit = document.createElement('div');
                slidereservationhouredit.className = "slide__edit";
                slidereservationhouredit.setAttribute('data-break', 'true');
                slidereservationhouredit.setAttribute('data-edit', 'true');
                const slidereservationhourp1edit = document.createElement('p');
                slidereservationhourp1edit.className = "edittermin";
                slidereservationhourp1edit.textContent = "Edytuj przerwe";
                slidereservationhouredit.setAttribute('data-worker', el.worker[0].name);
                slidereservationhouredit.setAttribute('data-from', element.from);
                slidereservationhouredit.setAttribute('data-to', element.to);
                slidereservationhouredit.appendChild(slidereservationhourp1edit);

                const slidereservationremove = document.createElement('div');
                slidereservationremove.setAttribute('data-worker', el.worker[0].name);
                slidereservationremove.setAttribute('data-from', element.from);
                slidereservationremove.setAttribute('data-to', element.to);
                slidereservationremove.className = `slide__removebreak`;
                const slidereservationremovep = document.createElement('p');
                slidereservationremovep.className = "removeclient";
                slidereservationremove.textContent = "Usuń przerwe";

                slidereservation.appendChild(slidereservationhour);
                slidereservation.appendChild(slidereservationhouredit);
                slidereservation.appendChild(slidereservationremove);
                slidecont.appendChild(slidereservation);
            }
        }
        const reservs = slidecont.querySelectorAll('[data-reservation="true"]');
        for (const el of reservs) {
            slidereservations.appendChild(el);
        }
        slidecont.innerHTML = "";
        const workerarrow = document.createElement('i');
        workerarrow.className = "fas fa-angle-down";
        const workerexit = document.createElement('i');
        workerexit.className = "fas fa-times hidden";
        slideworker.appendChild(workerarrow);
        slideworker.appendChild(workerexit);
        slidecont.appendChild(slideworker);
        slidecont.appendChild(slidereservations);
        slide.appendChild(slidecont);
        this.mainContent.appendChild(slide);
        workerarrow.addEventListener('click', (e) => this.showSlideReservations(e));
        workerexit.addEventListener('click', (e) => this.hideSlideReservations(e));
        const modalVisits = document.querySelectorAll('.slide__edit');
        modalVisits.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.setContentOfModalVisit('Czy na pewno chcesz edytować godzine przerwy?', 'Godzina przerwy została edytowana', 'Edytuj godzine przerwy');
                this.action = "addbreak";
                this.ClickedElement = e;
                this.ModalClass.showVisitModal();
                this.completeModalVisit();
            })
        })
        const addButtons = document.querySelectorAll(`.slide__add[data-worker="${el.worker[0].name}"]`);
        addButtons.forEach((e) => {
            e.addEventListener('click', () => {
                this.ClickedElement = e;
                if (this.ClickedElement.dataset.edit === 'true') {
                    this.ModalClass.setContentOfModalVisit('Czy na pewno chcesz edytować wizyte?', 'Wizyta została edytowana', "Edytuj wizyte");
                } else this.ModalClass.setContentOfModalVisit('Czy na pewno chcesz dodać wizyte?', 'Wizyta została dodana', "Dodaj wizyte");
                if (this.ClickedElement.dataset.client !== undefined) {
                    this.ModalInputName.value = this.ClickedElement.dataset.client;
                    this.ModalInputNumber.value = this.ClickedElement.dataset.number;
                }
                this.action = "add";
                this.ModalClass.showModalMain()
                this.completeModalVisit();
            });
        })
        const removeButtons = document.querySelectorAll(`.slide__remove[data-worker="${el.worker[0].name}"]`);
        removeButtons.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć wizyte?', 'Wizyta została usunięta')
                this.action = "remove";
                this.ClickedElement = e;
                this.ModalClass.showModalAcceptVisit();
            });
        })
        const removebreakButtons = document.querySelectorAll(`.slide__removebreak[data-worker="${el.worker[0].name}"]`);
        removebreakButtons.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.setContentOfModalAcceptVisit('Czy na pewno chcesz usunąć przerwe?', 'Przerwa została usunięta')
                this.action = "removebreak";
                this.ClickedElement = e;
                this.ModalClass.showModalAcceptVisit();
            });
        })
        const addbreakButtons = document.querySelectorAll(`.slide__addbreak[data-worker="${el.worker[0].name}"]`);
        addbreakButtons.forEach((e) => {
            e.addEventListener('click', () => {
                this.ModalClass.setContentOfModalVisit('Czy na pewno chcesz dodać przerwe?', 'Przerwa została dodana', 'Dodaj przerwe');
                this.action = "addbreak";
                this.ClickedElement = e;
                this.ModalClass.showVisitModal();
                this.completeModalVisit();
            });
        })
    }
    extendSlide = () => {
        const indexofreservationclickedslide = this.ClickedElement.parentNode.parentNode.dataset.indexreserv;
        document.querySelector(`[data-indexreserv="${indexofreservationclickedslide}"]`).classList.add('slideextended');
        document.querySelector(`[data-indexreserv="${indexofreservationclickedslide}"]`).parentNode.querySelector('.fa-angle-down').classList.add('hidden');
        document.querySelector(`[data-indexreserv="${indexofreservationclickedslide}"]`).parentNode.querySelector('.fa-times').classList.remove('hidden');
    }
    showSlideReservations = (e) => {
        e.target.classList.add('hidden');
        e.target.parentNode.querySelector('.fa-times').classList.remove('hidden');
        e.target.parentNode.parentNode.querySelector('.slide__reservations').classList.add('slideextended');
    }
    hideSlideReservations = (e) => {
        e.target.classList.add('hidden');
        e.target.parentNode.querySelector('.fa-angle-down').classList.remove('hidden');
        e.target.parentNode.parentNode.querySelector('.slide__reservations').classList.remove('slideextended');
    }
    completeModalVisit = () => {
        if (this.action === 'edit' || this.action === 'addbreak') {
            this.modalVisitToContainer.innerHTML = "";
            this.modalVisitFromContainer.innerHTML = "";
        } else {
            this.modalToContainer.innerHTML = "";
            this.modalFromContainer.innerHTML = "";
        }
        const indexofworker = this.transferedData.workers.findIndex(e => e.worker[0].name === this.ClickedElement.dataset.worker);
        const indexofcheckedhourwvisit = this.transferedData.workers[indexofworker].worker[1].hours.findIndex(e =>
            e.from === `${this.ClickedElement.dataset.from}` && e.to === `${this.ClickedElement.dataset.to}`
        )
        let lasthourtoadd = null;
        let firsthourfromadd = this.ClickedElement.dataset.from;
        const firsthourtoaddfrom = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from
        const firsthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to
        for (let i = 1; i < 12; i++) {
            if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i] !== undefined) {
                if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "deactivefromprev" || this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "deactivefrombreak") {
                    continue;
                } else if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i - 1].status === "deactivefromprev" || this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i - 1].status === "deactivefrombreak" && this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "booked") {
                    lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].from;
                    break;
                } else if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "active") {
                    lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].to
                } else if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "booked" || this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "break") {
                    lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].from;
                    break;
                } else break;
            }
        }
        if (this.ClickedElement.dataset.edit === 'true') {
            for (let i = 1; i <= 12; i++) {
                if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i] !== undefined) {
                    if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "deactivefromprev" || this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "deactivefrombreak") {
                        continue;
                    } else if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "active") {
                        lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].from;
                    } else if (this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "booked" || this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].status === "break") {
                        lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i].from;
                        break;
                    } else break;
                } else {
                    if (lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i - 1] !== undefined) {
                        lasthourtoadd = this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit + i - 1].to;
                        break;
                    }
                }
            }
        }
        const indexfisthourfrome = this.tableOfHours.findIndex(e => e === this.transferedData.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from);
        const indexfirsttohour = this.tableOfHours.findIndex(e => e === firsthourtoadd);
        let indexlasttohour = this.tableOfHours.findIndex(e => e === lasthourtoadd);
        if (indexfirsttohour + 11 < indexlasttohour) {
            indexlasttohour = indexfirsttohour + 10;
        }
        const indexfromhour = this.tableOfHours.findIndex(e => e === firsthourfromadd);
        const indexdefaultfromhour = this.tableOfHours.findIndex(e => e === firsthourtoaddfrom);
        if (lasthourtoadd !== null) {
            if (this.ClickedElement.dataset.edit === 'true') {
                for (let i = indexfisthourfrome + 1; i < indexlasttohour + 1; i++) {
                    if (this.tableOfHours[i] !== undefined) {
                        const divTo = document.createElement('div');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.id = 'to';
                        input.name = 'to';
                        input.value = `${this.tableOfHours[i]}`;
                        const label = document.createElement('label');
                        label.for = 'to';
                        label.textContent = `${this.tableOfHours[i]}`;
                        if (this.tableOfHours[i] === this.ClickedElement.dataset.to) {
                            input.checked = true;
                        }
                        if (this.tableOfHours[i] === this.tableOfHours[indexfromhour + 1]) {
                            input.checked = true;
                        }
                        divTo.appendChild(input);
                        divTo.appendChild(label);
                        if (this.action === 'edit' || this.action === 'addbreak') {
                            this.modalVisitToContainer.appendChild(divTo);
                        } else {
                            this.modalToContainer.appendChild(divTo);
                        }
                    }
                }
            } else {
                for (let i = indexfromhour + 1; i <= indexlasttohour; i++) {
                    if (this.tableOfHours[i] !== undefined) {
                        const divTo = document.createElement('div');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.id = 'to';
                        input.name = 'to';
                        input.value = `${this.tableOfHours[i]}`;
                        const label = document.createElement('label');
                        label.for = 'to';
                        label.textContent = `${this.tableOfHours[i]}`;
                        if (this.tableOfHours[i] === this.tableOfHours[indexfromhour + 1]) {
                            input.checked = true;
                        }
                        divTo.appendChild(input);
                        divTo.appendChild(label);
                        if (this.action === 'edit' || this.action === 'addbreak') {
                            this.modalVisitToContainer.appendChild(divTo);
                        } else {
                            this.modalToContainer.appendChild(divTo);
                        }
                    }
                }
            }
        } else {
            for (let i = indexfirsttohour; i <= indexfirsttohour; i++) {
                if (this.tableOfHours[i] !== undefined) {
                    const divTo = document.createElement('div');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.id = 'to';
                    input.name = 'to';
                    input.value = `${this.tableOfHours[i]}`;
                    const label = document.createElement('label');
                    label.for = 'to';
                    label.textContent = `${this.tableOfHours[i]}`;
                    if (this.tableOfHours[i] === this.tableOfHours[indexfromhour + 1]) {
                        input.checked = true;
                    }
                    divTo.appendChild(input);
                    divTo.appendChild(label);
                    if (this.action === 'edit' || this.action === 'addbreak') {
                        this.modalVisitToContainer.appendChild(divTo);
                    } else {
                        this.modalToContainer.appendChild(divTo);
                    }
                }
            }
        }
        if (firsthourfromadd !== null) {
            for (let i = indexfromhour; i <= indexdefaultfromhour; i++) {
                if (this.tableOfHours[i] !== undefined) {
                    const divFrom = document.createElement('div');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.id = 'from';
                    input.name = 'from';
                    input.value = `${this.tableOfHours[i]}`;
                    const label = document.createElement('label');
                    label.for = 'from';
                    label.textContent = `${this.tableOfHours[i]}`;
                    if (this.tableOfHours[i] === firsthourtoaddfrom) {
                        input.checked = true;
                    }
                    divFrom.appendChild(input);
                    divFrom.appendChild(label);
                    if (this.action === 'edit' || this.action === 'addbreak') {
                        this.modalVisitFromContainer.appendChild(divFrom);
                    } else {
                        this.modalFromContainer.appendChild(divFrom);
                    }
                }
            }
        }
        switch (this.modalFromContainer.querySelectorAll('input').length) {
            case 1:
                this.modalFromContainer.style.gridTemplateColumns = "repeat(1, 1fr)";
                break;
            case 2:
                this.modalFromContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
                break
            default:
                this.modalFromContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
                break;
        }
        switch (this.modalToContainer.querySelectorAll('input').length) {
            case 1:
                this.modalToContainer.style.gridTemplateColumns = "repeat(1, 1fr)";
                break;
            case 2:
                this.modalToContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
                break
            default:
                this.modalToContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
                break;
        }
        switch (this.modalVisitFromContainer.querySelectorAll('input').length) {
            case 1:
                this.modalVisitFromContainer.style.gridTemplateColumns = "repeat(1, 1fr)";
                break;
            case 2:
                this.modalVisitFromContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
                break
            default:
                this.modalVisitFromContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
                break;
        }
        switch (this.modalVisitToContainer.querySelectorAll('input').length) {
            case 1:
                this.modalVisitToContainer.style.gridTemplateColumns = "repeat(1, 1fr)";
                break;
            case 2:
                this.modalVisitToContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
                break
            default:
                this.modalVisitToContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
                break;
        }
    }
    selectOption = () => {
        const Datalist = [...document.querySelectorAll('#browsers option')];
        const element = Datalist.find(e => e.attributes.value.value === this.ModalInputNumber.value);
        if (element !== undefined) {
            this.ModalInputName.value = element.dataset.name;
            this.ModalInputNumber.value = element.dataset.number;
        }
    }
    yesModalAccept = () => {
        this.ModalClass.hideOnlyWindowFromModalWithoutBackground();
        this.sendModal();
    }
    sendModal = async () => {
        this.ModalClass.showLoader();
        if (this.action === 'addbreak') {
            await this.fetchToAddBreak();
            await this.transferDay();
            this.extendSlide();
        } else if (this.action === 'removebreak') {
            await this.fetchToRemoveBreak();
            await this.transferDay();
            this.extendSlide();
        } else if (this.action === 'remove') {
            await this.fetchToRemoveClient();
            await this.transferDay();
            this.extendSlide();
        } else if (this.action === 'add') {
            await this.fetchToAddClient();
            this.ClassClientlist.clearSearchEngineInputValue();
            this.ClassClientlist.scrollTo0Y();
            await this.ClassClientlist.fetchToTransferDatabaseFromInit()
            await this.ClassClientlist.fetchToCheckLengthOfDatabase();
            await this.transferDay();
            this.extendSlide();
            this.ModalClass.cleanInputs();
        }
        this.ModalClass.hideLoader();
        this.ModalClass.showInfoModalInformation();
        this.action = '';
        this.socket.emit('message', 'resetbaseofclientsandbaseofday');
    }
}