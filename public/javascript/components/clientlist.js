import {
    Modal
} from './modal.js';

export class Clientlist {
    ModalClass = new Modal;

    clientlist = document.querySelector('.clientlist');
    clienlistinput = document.querySelector('.clientlist input')
    clientlistmain = document.querySelector('.clientlist__main');
    clientlistUL = document.querySelector('.clientlist__main ul');
    clientlistloader = document.querySelector('.clientlist__loader');
    addnewclient = document.querySelector('.addnewclient');
    modalYes = document.querySelector('.modalyesclientlist');
    modalclientinputname = document.querySelector('.clientname');
    modalclientinputcontact = document.querySelector('.clientcontact');

    from = 0;
    acctual = 1;
    to = 20;
    action;
    element;
    lengthofdatabase;
    interval;
    socket = io(`${window.location.origin}`);
    constructor() {
        this.socket.on('message', async (data) => {
            switch (data) {
                case 'resetbaseofclients':
                    this.ModalClass.showLoader();
                    this.clearSearchEngineInputValue();
                    this.scrollTo0Y();
                    await this.fetchToTransferDatabaseFromInit();
                    await this.fetchToCheckLengthOfDatabase();
                    this.ModalClass.hideLoader();
                    break;
            }
        })
        this.modalYes.addEventListener('click', () => this.sendModal());
        window.addEventListener('storage', () => this.checkStorageClientlist());
        this.showClientListLoader();
        this.fetchToCheckLengthOfDatabase();
        this.fetchToTransferDatabaseFromInit();
        this.clienlistinput.addEventListener('input', () => {
            this.scrollTo0Y();
            this.fetchToCheckLengthOfDatabaseFromProperty()
            this.fetchToTransferDatabaseFromInitFromProperty()
        })
        this.clientlistmain.addEventListener('scroll', () => this.CheckAcctualSlide());
        this.addnewclient.addEventListener('click', () => {
            this.ModalClass.setContentOfModalClient("Czy na pewno chcesz dodać nowego klienta do bazy danych?", "Klient został dodany do bazy danych", "Dodaj klienta do bazy");
            this.ModalClass.showModalClient()
            this.action = "addnewclient";
        });
        this.clientlist.addEventListener('mouseenter', () => this.setIntervalForCheckAcctualSlide());
        this.clientlist.addEventListener('mouseleave', () => this.unsetIntervalForCheckAcctualSlide());
    }
    checkStorageClientlist = async () => {
        if (localStorage.refreshclientlist === 'refreshclientlist' && localStorage.refreshclientlist !== undefined) {
            localStorage.clear();
            this.clearSearchEngineInputValue();
            this.scrollTo0Y();
            await this.fetchToTransferDatabaseFromInit();
            await this.fetchToCheckLengthOfDatabase();
        }
    }
    setIntervalForCheckAcctualSlide = () => {
        if (this.interval === null) {
            this.interval = setInterval(() => {
                this.CheckAcctualSlide()
            }, 200);
        }
    }
    unsetIntervalForCheckAcctualSlide = () => {
        setTimeout(() => {
            clearInterval(this.interval);
            this.interval = null;
        }, 500)

    }
    showClientListLoader = () => {
        this.clientlistloader.classList.remove('hidden');
    }
    hideClientListLoader = () => {
        this.clientlistloader.classList.add('hidden');
    }
    fetchToTransferDatabaseFromInitFromProperty = (from = 0, acctual = 10) => {
        fetch('/transferfirst20clientsofdatabasefromproperty', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    property: this.clienlistinput.value,
                })
            })
            .then(r => r.json())
            .then(data => {
                this.clientlistUL.innerHTML = "";
                this.manageDataSlides(data, from, acctual);
            })
    }
    fetchToCheckLengthOfDatabase = () => {
        fetch('/lengthofdatabase')
            .then(r => r.json())
            .then(data => {
                this.lengthofdatabase = data.data
                this.setHeightOfClientContainer(data.data)
            })
    }
    fetchToCheckLengthOfDatabaseFromProperty = () => {
        fetch('/lengthofdatabasefromproperty', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    property: this.clienlistinput.value,
                })
            })
            .then(r => r.json())
            .then(data => {
                this.lengthofdatabase = data.data
                this.setHeightOfClientContainer(data.data)
            })
    }
    setHeightOfClientContainer = (length) => {
        this.clientlistUL.style.height = `${length * 40}px`;
    }
    fetchToTransferDatabaseFromInit = (from = 0, acctual = 10) => {
        fetch('/transferfirst20clientsofdatabase')
            .then(r => r.json())
            .then(data => {
                this.clientlistUL.innerHTML = "";
                this.manageDataSlides(data, from, acctual);
            })
    }
    editClientInformations = () => {
        return fetch('/editclientinformations', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                clientnamefrom: this.element.dataset.name,
                clientcontactfrom: this.element.dataset.contact,
                clientnameto: this.modalclientinputname.value,
                clientcontactto: this.modalclientinputcontact.value,
            })
        })
    }
    addNewClient = () => {
        return fetch('/addnewclient', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                clientname: this.modalclientinputname.value,
                clientcontact: this.modalclientinputcontact.value,
            })
        })
    }
    addToBlackList = () => {
        return fetch('/addtoblacklist', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                clientname: this.element.dataset.name,
                clientcontact: this.element.dataset.contact
            })
        })
    }
    removeFromBlackList = () => {
        return fetch('/removefromblacklist', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                clientname: this.element.dataset.name,
                clientcontact: this.element.dataset.contact
            })
        })
    }
    removeClientFromDatabase = () => {
        return fetch('/removeclientfromdatabase', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                clientname: this.element.dataset.name,
                clientcontact: this.element.dataset.contact
            })
        })
    }
    fetch20Slides = (from, acctual) => {
        return fetch('/transfer20clients', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    clientindexfrom: from,
                    property: this.clienlistinput.value
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data !== undefined) {
                    this.manageDataSlides(data, from, acctual);
                }
            })
    }
    manageDataSlides = async (data, from, acctual) => {
        const elements = document.querySelectorAll('.clientlist__main ul li');
        elements.forEach((e) => {
            e.remove();
        })
        await this.add20Slides(data, from, acctual)
        this.hideClientListLoader();
    }
    add20Slides = async (data, from, acctual) => {
        let top = from * 40;
        let index = acctual
        if (data.data !== undefined) {
            for (const el of data.data) {
                await this.completeOneClientInHTMLStructre(el, top, index);
                top = top + 40;
                index++;
            }
        }
    }
    CheckAcctualSlide = async () => {
        if (this.acctual >= 10 && Math.floor(this.clientlistmain.scrollTop / 40) + 1 > this.acctual && this.acctual <= this.lengthofdatabase - 11 && this.lengthofdatabase > 20) {
            this.acctual = Math.floor(this.clientlistmain.scrollTop / 40) + 1;
            this.from = this.acctual - 10;
            await this.fetch20Slides(this.from, this.acctual);
        } else if (this.acctual >= 11 && Math.floor(this.clientlistmain.scrollTop / 40) + 1 < this.acctual && this.acctual <= this.lengthofdatabase - 10 && this.lengthofdatabase > 20) {
            this.acctual = Math.floor(this.clientlistmain.scrollTop / 40) + 1;
            this.from = this.acctual - 10;
            await this.fetch20Slides(this.from, this.acctual);
            this.acctual = Math.floor(this.clientlistmain.scrollTop / 40) + 1;
        } else if (this.acctual < 10 && this.lengthofdatabase > 20) {
            if (document.querySelector('.clientlist__main ul li') !== null) {
                if (document.querySelector('.clientlist__main ul li').dataset.index !== '10') {
                    this.acctual = 10;
                    this.from = 0;
                    this.showClientListLoader();
                    await this.fetch20Slides(this.from, this.acctual);
                }
            } else {
                this.acctual = 10;
                this.from = 0;
                this.showClientListLoader();
                await this.fetch20Slides(this.from, this.acctual);
            }
        } else if (this.acctual > this.lengthofdatabase - 10 && this.lengthofdatabase > 20) {
            if (document.querySelector('.clientlist__main ul li:last-child') !== null) {
                if (document.querySelector('.clientlist__main ul li:last-child').dataset.index !== `${this.lengthofdatabase + 9}`) {
                    this.from = this.lengthofdatabase - 20;
                    this.showClientListLoader();
                    await this.fetch20Slides(this.from, (this.lengthofdatabase + 10) - 20);
                }
            } else {
                this.from = this.lengthofdatabase - 20;
                this.showClientListLoader();
                await this.fetch20Slides(this.from, (this.lengthofdatabase + 10) - 20);
            }
        }
        this.acctual = Math.floor(this.clientlistmain.scrollTop / 40) + 1;
    }
    completeOneClientInHTMLStructre = (data, top, index) => {
        const li = document.createElement('li');
        if (index !== undefined) {
            li.setAttribute('data-index', index);
        }
        const liA = document.createElement('p');
        const liASPAN1 = document.createElement('span');
        liASPAN1.className = "clientinformation";
        liASPAN1.textContent = `${data.name} ${data.contact}`;
        const liASPAN2 = document.createElement('span');
        const liASPAN2I = document.createElement('i');
        liASPAN2I.className = "fas fa-plus";
        if (data.status === "blacklist") {
            liASPAN2I.setAttribute('data-blacklist', true);
            liASPAN2I.className = "fas fa-minus";
        }
        liASPAN2I.setAttribute('data-name', data.name);
        liASPAN2I.setAttribute('data-contact', data.contact);
        liASPAN2.appendChild(liASPAN2I)
        const liASPAN3 = document.createElement('span');
        const liASPAN3I = document.createElement('i');
        liASPAN3I.className = "fas fa-edit";
        liASPAN3I.setAttribute('data-name', data.name);
        liASPAN3I.setAttribute('data-contact', data.contact);
        liASPAN3.appendChild(liASPAN3I)
        const liASPAN4 = document.createElement('span');
        const liASPAN4I = document.createElement('i');
        liASPAN4I.className = "fas fa-times";
        liASPAN4I.setAttribute('data-name', data.name);
        liASPAN4I.setAttribute('data-contact', data.contact);
        liASPAN4.appendChild(liASPAN4I)

        li.style.top = `${top}px`;
        liA.appendChild(liASPAN1);
        liA.appendChild(liASPAN2);
        liA.appendChild(liASPAN3);
        liA.appendChild(liASPAN4);
        li.appendChild(liA);

        this.clientlistUL.appendChild(li);

        liASPAN2I.addEventListener('click', (e) => {
            this.ModalClass.setContentOfModalAcceptClientlist("Czy na pewno chcesz dodać klienta do czarnej listy", "Klient został dodany do czarnej listy");
            this.action = "addtoblacklist";
            this.element = e.target;
            if (this.element.dataset.blacklist === 'true') {
                this.ModalClass.setContentOfModalAcceptClientlist("Czy na pewno chcesz usunąć klienta z czarnej listy?", "Klient został usunięty z czarnej listy");
                this.action = "removefromblacklist";
            }
            this.ModalClass.showModalAcceptClientlist();
        })
        liASPAN3I.addEventListener('click', (e) => {
            this.ModalClass.setContentOfModalClient("Czy na pewno chcesz edytować dane klienta?", "Dane klienta zostały edytowane", "Edytuj dane klienta");
            this.action = "editclient";
            this.element = e.target;
            this.modalclientinputname.value = this.element.dataset.name;
            this.modalclientinputcontact.value = this.element.dataset.contact;
            this.ModalClass.showModalClient();
        })
        liASPAN4I.addEventListener('click', (e) => {
            this.ModalClass.setContentOfModalAcceptClientlist("Czy na pewno chcesz usunąć klienta z bazy danych?", "Klient został usunięty z bazy danych");
            this.action = "remove";
            this.element = e.target;
            this.ModalClass.showModalAcceptClientlist();
        })
    }
    sendModal = async () => {
        this.ModalClass.hideOnlyWindowFromModalWithoutBackground();
        this.ModalClass.showLoader();
        if (this.action === 'addtoblacklist') {
            await this.addToBlackList();
            await this.fetchToTransferDatabaseFromInit();
        } else if (this.action === 'remove') {
            await this.removeClientFromDatabase();
            this.clearSearchEngineInputValue();
            this.scrollTo0Y();
            await this.fetchToTransferDatabaseFromInit();
            await this.fetchToCheckLengthOfDatabase();
        } else if (this.action === 'removefromblacklist') {
            await this.removeFromBlackList();
            await this.fetchToTransferDatabaseFromInit();
        } else if (this.action === 'editclient') {
            await this.editClientInformations();
            this.clearSearchEngineInputValue();
            this.scrollTo0Y();
            await this.fetchToTransferDatabaseFromInit();
            this.ModalClass.cleanInputs();
        } else if (this.action === "addnewclient") {
            await this.addNewClient();
            this.clearSearchEngineInputValue();
            this.scrollTo0Y();
            await this.fetchToTransferDatabaseFromInit();
            await this.fetchToCheckLengthOfDatabase();
            this.ModalClass.cleanInputs();
        }
        this.ModalClass.hideLoader();
        this.ModalClass.showInfoModalInformation();
        localStorage.clear();
        localStorage.setItem("refreshclientlist", "refreshclientlist");
        this.socket.emit('message', 'resetbaseofclients');
        this.action = '';
    }
    scrollTo0Y = () => {
        this.clientlistmain.scrollTo(0, 0);
    }
    clearSearchEngineInputValue = () => {
        this.clienlistinput.value = "";
    }
}