export class Modal {
    tableOfHours = ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', ]
    tableOfIndex1 = ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00']

    modalBgc = document.querySelector('.modal__background');
    modalloader = document.querySelector('.modal__loader');
    modalinfo = document.querySelector('.modal__info');
    modalinfop = document.querySelector('.modal__info p');
    modalacceptClientlist = document.querySelector('.modal__acceptforclientlist');
    modalacceptClientlistp = document.querySelector('.modal__acceptforclientlist p');
    modalacceptVisit = document.querySelector('.modal__acceptforvisit');
    modalacceptVisitp = document.querySelector('.modal__acceptforvisit p');
    modalNo = document.querySelectorAll('.modalno');
    modalclientinfo = document.querySelector('.modalclientinfo');
    modalVisit = document.querySelector('.modal__visit');
    modalVisitSend = document.querySelector('.sendedit');
    modalMain = document.querySelector('.modal__main');
    modalMainSend = document.querySelector('.send');
    modalchange = document.querySelector('.modal__change');
    modalchangebreak = document.querySelector('.modal__change--break');
    modalchangeselects = document.querySelectorAll('.modal__change select');
    modaleditinfo = document.querySelector('.modalchangeinfo');
    modalbuttonshowaccept = document.querySelector('.showaccept');
    modalbreakplus = document.querySelector('.fa-plus');
    modalMainInputs = document.querySelectorAll('.modal__main input');
    modalclient = document.querySelector('.modal__client');
    modalclientinputname = document.querySelector('.clientname');
    modalclientinputcontact = document.querySelector('.clientcontact');
    ModalInputName = document.querySelector('.name');
    ModalInputNumber = document.querySelector('.number');
    modalclientinputs = [document.querySelector('.clientname'), document.querySelector('.clientcontact')];
    modalsendclient = document.querySelector('.sendclientinfo');
    modalExit = document.querySelectorAll('.modal__exit');
    datalistBrowser = document.querySelector('#browsers');
    counterOnBreaks = 1;
    breaktable = [];
    constructor() {}
    addEventsListener = () => {
        if (this.modalExit.length > 0) {
            this.modalExit.forEach((e) => {
                if (e !== null) {
                    e.addEventListener('click', () => this.hideModal());
                }
            })
        }
        if (this.modalclientinputs.length > 0) {
            this.modalclientinputs.forEach((e) => {
                if (e !== null) {
                    e.addEventListener('input', () => {
                        this.modalclientinfo.textContent = '';
                    })
                }
            })
        }
        if (this.modalsendclient !== null) {
            this.modalsendclient.addEventListener('click', () => {
                const response = this.checkValidateModalClient();
                if (response !== false) {
                    this.modalclientinfo.textContent = response;
                } else {
                    this.showModalAcceptClientlist();
                }
            });
        }
        if (this.modalNo.length > 0) {
            this.modalNo.forEach((e) => {
                if (e !== null) {
                    e.addEventListener('click', () => this.noModalAccept())
                }
            })
        }
        if (this.modalMainInputs.length > 0) {
            this.modalMainInputs.forEach((e) => {
                if (e !== null) {
                    e.addEventListener('input', () => {
                        this.hideInfoMainModal();
                    });
                }
            })
        }
        if (this.modalVisitSend !== null) {
            this.modalVisitSend.addEventListener('click', () => {
                this.showModalAcceptVisit();
            })
        }
        if (this.modalMainSend !== null) {
            this.modalMainSend.addEventListener('click', () => {
                const infoCorrect = this.checkCorrectValidateModalMain();
                if (!infoCorrect) return this.showModalAcceptVisit();
                else this.showInfoInMainModal(infoCorrect);
            });
        }
        if (this.modalchangeselects.length > 0) {
            this.modalchangeselects.forEach((e) => {
                if (e !== null) {
                    e.addEventListener('input', () => this.hideInform());
                }
            })
        }
        if (this.modalbreakplus !== null) {
            this.modalbreakplus.addEventListener('click', () => {
                this.addBreak()
            });
        }
        if (this.modalbuttonshowaccept !== null) {
            this.modalbuttonshowaccept.addEventListener('click', () => {
                this.checkCorrectSendChange();
            });
        }
    }
    removeMessageInChangeForm = () => {
        if (document.querySelector('.inform') !== null) {
            document.querySelector('.modal__change--container').removeChild(document.querySelector('.inform'));
        }
    }
    showMessageInChangeForm = (message) => {
        if (document.querySelector('.inform') === null) {
            const infop = document.createElement('p');
            infop.className = "inform";
            infop.textContent = message;
            document.querySelector('.modal__change--container').appendChild(infop);
        }
    }
    checkCorrectSendChange = () => {
        this.removeMessageInChangeForm();
        const indexFrom = this.tableOfIndex1.findIndex(e => e === document.querySelector('.from').value);
        const indexTo = this.tableOfIndex1.findIndex(e => e === document.querySelector('.to').value);
        const breaks = [...document.querySelectorAll('.break')];
        if (indexFrom >= indexTo) {
            this.showMessageInChangeForm("Godzina końcowa zmiany nie może być mniejsza lub taka sama od godziny początkowej!")
            return;
        } else if (breaks.length > 0) {
            const breakstable = [];
            for (const e of breaks) {
                const breakfrom = e.querySelector('.breakfrom').value;
                const breakto = e.querySelector('.breakto').value;
                const breakfromindex = this.tableOfIndex1.findIndex(e => e === breakfrom);
                const breaktoindex = this.tableOfIndex1.findIndex(e => e === breakto);
                if (breakfromindex + 12 < breaktoindex) {
                    this.breaktable = [];
                    this.showMessageInChangeForm("Przerwa nie może być dłuższa niż 3 godziny");
                    return;
                } else if (breaktoindex <= breakfromindex) {
                    this.breaktable = [];
                    this.showMessageInChangeForm("Godzina końcowa przerwy nie może być mniejsza lub taka sama od godziny początkowej!");
                    return;
                } else if (breakfromindex < indexFrom || breaktoindex > indexTo) {
                    this.breaktable = [];
                    this.showMessageInChangeForm("Godziny przerw muszą się mieścić w godzinach zmiany.");
                    return;
                } else {
                    breakstable.push({
                        breakfromindex,
                        breaktoindex
                    })
                    this.breaktable.push({
                        breakfrom,
                        breakto,
                    })
                }
            }
            if (breaks.length > 1) {
                for (const el of breakstable) {
                    const index = breakstable.every(e => (el.breakfromindex >= e.breakfromindex && el.breakfromindex < e.breaktoindex || el.breakfromindex <= e.breakfromindex && el.breaktoindex > e.breakfromindex));
                    if (index === true) {
                        this.breaktable = [];
                        this.showMessageInChangeForm("Godziny przerw nie mogą się wspólnie przecinać lub być takie same.");
                        return;
                    }
                }
            }
        }
        if (document.querySelector('.inform') !== null) {
            document.querySelector('.modal__change--container').removeChild(document.querySelector('.inform'));
        }
        this.showModalAcceptVisit();
    }
    addBreak = () => {
        if (this.counterOnBreaks <= 3) {
            const p = document.createElement('p');
            p.className = 'break';
            const selectfrom = document.createElement('select');
            selectfrom.className = "breakfrom";
            for (let i = 0; i <= this.tableOfIndex1.length - 1; i++) {
                const option = document.createElement('option');
                option.value = this.tableOfIndex1[i];
                option.textContent = this.tableOfIndex1[i];
                if (this.tableOfIndex1[i] === "10:00") {
                    option.selected = true;
                }
                selectfrom.appendChild(option);
            }
            const selectto = document.createElement('select');
            selectto.className = "breakto";
            for (let i = 0; i <= this.tableOfIndex1.length - 1; i++) {
                const option = document.createElement('option');
                option.value = this.tableOfIndex1[i];
                option.textContent = this.tableOfIndex1[i];
                if (this.tableOfIndex1[i] === "10:30") {
                    option.selected = true;
                }
                selectto.appendChild(option);
            }
            const pa1 = document.createElement('a');
            pa1.textContent = `${this.counterOnBreaks}. Przerwa od:`;
            pa1.className = "breaknumber";
            const pa2 = document.createElement('a');
            pa2.textContent = 'do';
            const pminus = document.createElement('i');
            pminus.className = "fas fa-minus";
            p.appendChild(pa1);
            p.appendChild(selectfrom);
            p.appendChild(pa2);
            p.appendChild(selectto);
            p.appendChild(pminus);

            pminus.addEventListener('click', (event) => this.removeBreak(event));
            this.modalchangebreak.appendChild(p);

            this.hideInform();
            this.counterOnBreaks++;
        }
    }
    removeBreak = (event) => {
        event.target.parentNode.remove();
        const breaks = [...document.querySelectorAll('.break')];
        if (breaks.length > 0) {
            breaks.forEach((e, index) => {
                e.querySelector('.breaknumber').textContent = `${index + 1}. Przerwa od:`;
            })
        }
        this.counterOnBreaks--;
        this.hideInform();
    }
    hideInform = () => {
        if (document.querySelector('.inform') !== null) {
            document.querySelector('.modal__change--container').removeChild(document.querySelector('.inform'));
        }
    }
    hideModalChangeInfo = () => {
        this.modaleditinfo.textContent = "";
        this.modaleditinfo.classList.add('hidden');
    }
    showModalChangeInfo = (info) => {
        this.modaleditinfo.textContent = info;
        this.modaleditinfo.classList.remove('hidden');
    }
    checkValidateModalClient = () => {
        if (this.modalclientinputname.value === '' && this.modalclientinputcontact.value === '') {
            return 'Uzupełnij dane klienta';
        } else if (this.modalclientinputcontact.value.length > 10) {
            return 'Numer telefonu nie powinień przekraczać 10 znaków';
        } else if (this.modalclientinputname.value.length > 15) {
            return 'Imie klienta nie powinno przekraczać 15 znaków';
        } else return false;
    }
    checkCorrectValidateModalMain = () => {
        const indexOfFrom = this.tableOfHours.findIndex(e => e === document.querySelector('input[type="radio"][name="from"]:checked').value);
        const indexOfTo = this.tableOfHours.findIndex(e => e === document.querySelector('input[type="radio"][name="to"]:checked').value);
        if (indexOfFrom === indexOfTo) {
            return 'Godzina rozpoczęcia wizyty i zakończenia jest taka sama!';
        } else if (indexOfFrom > indexOfTo) {
            return 'Godzina rozpoczęcia wizyty nie może być większa niż zakończenia wizity!'
        } else if (this.ModalInputName.value === "" & this.ModalInputName.value === this.ModalInputNumber.value) {
            return 'Uzupełnij dane o kliencie';
        } else if (this.ModalInputName.value.length > 15) {
            return 'Imie klienta nie powinno przekraczać 15 znaków';
        } else if (this.ModalInputNumber.value.length > 10) {
            return 'Numer telefonu klienta nie powineń przekraczać 10 znaków';
        }
        return false;
    }
    setContentOfModalChange = (val1, val2, val3) => {
        this.modalacceptVisitp.textContent = val1;
        this.modalinfop.textContent = val2;
        this.modalbuttonshowaccept.value = val3;
    }
    setContentOfModalMain = (val1, val2, val3) => {
        this.modalacceptVisitp.textContent = val1;
        this.modalinfop.textContent = val2;
        this.modalMainSend.value = val3;
    }
    setContentOfModalVisit = (val1, val2, val3) => {
        this.modalacceptVisitp.textContent = val1;
        this.modalinfop.textContent = val2;
        this.modalVisitSend.value = val3;
    }
    setContentOfModalAcceptVisit = (val1, val2) => {
        this.modalacceptVisitp.textContent = val1;
        this.modalinfop.textContent = val2;
    }
    setContentOfModalClient = (val1, val2, val3) => {
        this.modalacceptClientlistp.textContent = val1;
        this.modalinfop.textContent = val2;
        this.modalsendclient.value = val3;
        this.cleanInputs();
    }
    setContentOfModalAcceptClientlist = (val1, val2) => {
        this.modalacceptClientlistp.textContent = val1;
        this.modalinfop.textContent = val2;
    }
    showLoader = () => {
        this.modalBgc.classList.remove('hidden');
        this.modalloader.classList.remove('hidden');
    }
    hideLoader = () => {
        this.modalBgc.classList.add('hidden');
        this.modalloader.classList.add('hidden');
    }
    hideModal = () => {
        this.modalBgc.classList.add('hidden');
        this.modalMain.classList.add('hidden');
        this.modalVisit.classList.add('hidden');
        this.modalchange.classList.add('hidden');
        this.modalacceptVisit.classList.add('hidden');
        this.modalacceptClientlist.classList.add('hidden');
        this.hideInfoMainModal();
        this.cleanInputs();
    }
    showModalClient = () => {
        this.modalclientinfo.textContent = '';
        this.modalBgc.classList.remove('hidden');
        this.modalclient.classList.remove('hidden');
    }
    hideModalClient = () => {
        this.modalBgc.classList.add('hidden');
        this.modalclient.classList.add('hidden');
    }
    showModalChange = () => {
        this.counterOnBreaks = 1;
        this.breaktable = [];

        this.modalBgc.classList.remove('hidden');
        this.modalchange.classList.remove('hidden');
    }
    exitModalChange = () => {
        if (document.querySelector('.inform') !== null) {
            document.querySelector('.modal__change--container').removeChild(document.querySelector('.inform'));
        }
        this.modalBgc.classList.add('hidden');
        this.modalchange.classList.add('hidden');
        this.modalacceptVisit.classList.add('hidden');
    }
    showModalInfo = (info = undefined) => {
        if (info !== undefined) {
            this.modalinfop.textContent = info;
        }
        this.modalBgc.classList.remove('hidden');
        this.modalinfo.style.transition = "1s";
        this.modalinfo.classList.remove('hidden');
        this.modalinfo.classList.add('scale');
    }
    hideModalInfo = () => {
        this.modalinfop.textContent = '';
        this.modalinfo.classList.add('hidden');
        this.modalinfo.style.transition = "0s";
        this.modalBgc.classList.add('hidden');
        this.modalinfo.classList.remove('scale');
    }
    hideOnlyWindowFromModalWithoutBackground = () => {
        this.modalacceptClientlist.classList.add('hidden');
        this.modalacceptVisit.classList.add('hidden');
        if (this.datalistBrowser !== null) {
            this.datalistBrowser.innerHTML = "";
        }
        this.modalclient.classList.add('hidden');
        this.modalVisit.classList.add('hidden');
        this.modalMain.classList.add('hidden');
    }
    showModalAcceptClientlist = () => {
        this.modalBgc.classList.remove('hidden');
        this.modalacceptClientlist.classList.remove('hidden');
    }
    hideModalAcceptClientlist = () => {
        this.modalacceptClientlist.classList.add('hidden');
        if (this.modalclient.classList.contains('hidden') && this.modalMain.classList.contains('hidden') && this.modalVisit.classList.contains('hidden') && this.modalchange.classList.contains('hidden')) {
            this.modalBgc.classList.add('hidden');
        }
    }
    showModalAcceptVisit = () => {
        this.modalBgc.classList.remove('hidden');
        this.modalacceptVisit.classList.remove('hidden');
    }
    hideModalAcceptVisit = () => {
        this.modalacceptVisit.classList.add('hidden');
        if (this.modalclient.classList.contains('hidden') && this.modalMain.classList.contains('hidden') && this.modalVisit.classList.contains('hidden') && this.modalchange.classList.contains('hidden')) {
            this.modalBgc.classList.add('hidden');
        }
    }
    showInfoInMainModal = (text) => {
        if (document.querySelector('.modalmaininfo') === null) {
            const p = document.createElement('p');
            p.className = "modalmaininfo";
            p.textContent = text;
            document.querySelector('.modal__main--container').appendChild(p);
        } else {
            document.querySelector('.modalmaininfo').textContent = text;
        }
    }
    hideInfoMainModal = () => {
        if (document.querySelector('.modalmaininfo') !== null) {
            document.querySelector('.modalmaininfo').remove();
        }
    }
    showVisitModal = () => {
        this.modalVisit.classList.remove('hidden');
        this.modalBgc.classList.remove('hidden');
    }
    showModalMain = () => {
        this.modalBgc.classList.remove('hidden');
        this.modalMain.classList.remove('hidden');
    }
    cleanInputs = () => {
        if (this.modalclientinputname !== null) {
            this.modalclientinputname.value = "";
        }
        this.modalclient.classList.add('hidden');
        if (this.modalclientinputcontact !== null) {
            this.modalclientinputcontact.value = "";
        }
        if (this.ModalInputName !== null) {
            this.ModalInputName.value = "";
        }
        if (this.ModalInputNumber !== null) {
            this.ModalInputNumber.value = "";
        }
        if (this.datalistBrowser !== null) {
            this.datalistBrowser.innerHTML = "";
        }
    }
    noModalAccept = () => {
        this.hideModalAcceptClientlist();
        this.hideModalAcceptVisit();
    }
    showInfoModalInformation = () => {
        this.showModalInfo();
        setTimeout(() => {
            this.hideModalInfo();
            this.hideModal();
        }, 2000)
    }
}