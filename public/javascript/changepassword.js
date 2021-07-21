import {
    Modal
} from './components/modal.js';

class changePassword {
    ModalClass = new Modal;

    changepasswordBtn = document.querySelector('.change');
    inputOldPassword = document.querySelector('.oldpassword');
    inputNewPassword = document.querySelector('.newpassword');
    inputConfirmNewPassword = document.querySelector('.newpasswordconfirm');
    inputs = [this.inputOldPassword, this.inputNewPassword, this.inputConfirmNewPassword];
    info = document.querySelector('.info');
    urlchoose;
    constructor() {
        this.checkWorkerOrAdmin();
        this.changepasswordBtn.addEventListener('click', this.checkValidateLogin);
        this.inputs.forEach((e) => {
            e.addEventListener('input', this.hideInfo);
        })
    }
    checkWorkerOrAdmin = () => {
        let url = window.location.href;
        if (url[url.length - 1] === '/') {
            url = url.slice(0, url.length - 1);
        }
        let urlchoose = url.slice(url.lastIndexOf('=') + 1);
        this.urlchoose = urlchoose;

        document.querySelector('.worker').placeholder = urlchoose;
    }
    checkValidateLogin = () => {
        if (this.inputOldPassword.value === "") {
            return this.showInfo('Uzupełnij pole ze starym hasłem.');
        } else if (this.inputConfirmNewPassword.value === "" && this.inputNewPassword.value === "") {
            return this.showInfo('Uzupełnij pole z nowym hasłem.');
        } else if (this.inputConfirmNewPassword.value !== this.inputNewPassword.value) {
            return this.showInfo('Podane nowe hasła nie są takie same.');
        } else if (this.inputNewPassword.value.length < 5) {
            return this.showInfo('Podane nowe hasło powinno się składać minimalnie z 5 znaków.');
        } else if (this.inputNewPassword.value.length > 20) {
            return this.showInfo('Podane nowe hasło powinno się składać maksymalnie z 20 znaków.');
        } else {
            this.ModalClass.showLoader();
            fetch('/changepassword', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        name: this.urlchoose,
                        oldpassword: this.inputOldPassword.value,
                        newpassword: this.inputNewPassword.value,
                    })
                })
                .then(r => r.json())
                .then(data => {
                    if (data.change === false) {
                        this.ModalClass.hideLoader();
                        this.showInfo('Podane stare hasło jest nieprawidłowe.');
                        this.resetInputs();
                    } else if (data.changetoadmin === true) {
                        this.ModalClass.hideLoader();
                        this.ModalClass.showModalInfo("Hasło zostało zmienione.");
                        setTimeout(() => {
                            this.ModalClass.hideModalInfo();
                        }, 2000)
                        setTimeout(() => {
                            window.location.href = '/admin';
                        }, 2300);
                    } else if (data.changetoworker === true) {
                        this.ModalClass.hideLoader();
                        this.ModalClass.showModalInfo("Hasło zostało zmienione.");
                        setTimeout(() => {
                            this.ModalClass.hideModalInfo();
                        }, 2000)
                        setTimeout(() => {
                            window.location.href = '/pracownik';
                        }, 2300)
                    }
                })
        }
    }
    showInfo = (info) => {
        this.info.classList.remove('none');
        this.info.textContent = info;
    }
    hideInfo = () => {
        this.info.classList.add('none');
    }
    resetInputs = () => {
        this.inputNewPassword.value = "";
        this.inputOldPassword.value = "";
        this.inputConfirmNewPassword.value = "";
    }
}

const changepassword = new changePassword();