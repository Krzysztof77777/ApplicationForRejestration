export class Menu {
    logoutBtn = document.querySelector('.logout');
    changepasswordBtn = document.querySelector('.changepassword');
    urlchoose;
    constructor() {
        this.logoutBtn.addEventListener('click', () => this.fetchToLogout());
        this.changepasswordBtn.addEventListener('click', () => this.redirectToChangePassword());
        this.checkAdminOrWorkerLogined();
    }
    checkAdminOrWorkerLogined = () => {
        let url = window.location.pathname;
        if (url[url.length - 1] === '/') {
            url = url.slice(0, url.length - 1);
        }
        let urlchoose = url.slice(url.indexOf('/') + 1);
        urlchoose = urlchoose.slice(0, urlchoose.indexOf('/') === -1 ? urlchoose.length : urlchoose.indexOf('/'));
        this.urlchoose = urlchoose;
        document.querySelector('.whoislogined').textContent = urlchoose === 'admin' ? "Admin" : "Pracownik";
        if (this.urlchoose === 'admin') {
            this.createAdminPanelBtn();
            document.querySelector('.tomanage').addEventListener('click', () => this.redirectToManage());
        }
    }
    createAdminPanelBtn = () => {
        const menuPanelA = document.createElement('a');
        menuPanelA.className = "tomanage"
        menuPanelA.textContent = 'Panel administracyjny';

        document.querySelector('.menu__panel').appendChild(menuPanelA);
    }
    fetchToLogout = () => {
        fetch('/logout', {
                method: 'GET',
            })
            .then(
                window.location.href = '/login'
            );
    }
    redirectToChangePassword = () => {
        window.location.href = `/changepassword=${this.urlchoose}`;
    }
    redirectToManage = () => {
        window.location.href = '/admin/manage';
    }
}