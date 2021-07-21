import {
    Modal
} from './components/modal.js';
class login {
    ModalClass = new Modal;

    loginBtn = document.querySelector('.send');
    inputName = document.querySelector('.name');
    inputs = [this.loginBtn, this.inputName];
    inputPassword = document.querySelector('.password');
    info = document.querySelector('.info');
    constructor() {
        this.loginBtn.addEventListener('click', this.checkValidateLogin);
        this.inputs.forEach((e) => {
            e.addEventListener('input', this.hideInfo);
        })
    }
    checkValidateLogin = () => {
        this.ModalClass.showLoader();
        fetch('/login/login', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    username: this.inputName.value,
                    password: this.inputPassword.value,
                })
            })
            .then(r => r.json())
            .then(data => {
                if (data.logined === false) {
                    this.ModalClass.hideLoader();
                    this.showInfo();
                    this.resetInputs();
                } else if (data.logined === 'admin') {
                    this.ModalClass.hideLoader();
                    this.ModalClass.showModalInfo("Zostałeś zalogowany jako Admin.");
                    setTimeout(() => {
                        this.ModalClass.hideModalInfo();
                    }, 2000)
                    setTimeout(() => {
                        window.location.href = '/admin';
                    }, 2300)
                } else if (data.logined === 'pracownik') {
                    this.ModalClass.hideLoader();
                    this.ModalClass.showModalInfo("Zostałeś zalogowany jako Pracownik.");
                    setTimeout(() => {
                        this.ModalClass.hideModalInfo();
                    }, 2000)
                    setTimeout(() => {
                        window.location.href = '/pracownik';
                    }, 2300)
                }
            })
    }
    showInfo = () => {
        this.info.classList.remove('none');
    }
    hideInfo = () => {
        this.info.classList.add('none');
    }
    resetInputs = () => {
        this.inputName.value = "";
        this.inputPassword.value = "";
    }
}
const Login = new login();