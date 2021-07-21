export class Freeterms {
    freetermsleftside = document.querySelector('.freeterms__leftside');
    freetermsleftsideworkers = document.querySelector('.freeterms__workers');
    freetermsloader = document.querySelector('.freeterms__loader');
    workers = [];
    freetermsofworkers = [{}];
    IntervalForCheckFreeTerms;
    constructor() {
        this.showLoader();
        this.StartIntervalForCheckFreeTerms();
        this.createHTMLStructureForTeerms();
    }
    showLoader = () => {
        this.freetermsloader.classList.remove('hidden');
    }
    hideLoader = () => {
        this.freetermsloader.classList.add('hidden');
    }
    fetchToTransferAllWorkers = () => {
        return fetch('/transferallworkers', {
                method: 'get'
            })
            .then(r => r.json())
            .then(data => {
                this.workers = [];
                this.workers = data.workers;
            })
    }
    StartIntervalForCheckFreeTerms = () => {
        this.IntervalForCheckFreeTerms = setInterval(this.createHTMLStructureForTeerms, 5000);
    }
    fetchToTransferFreeTermsForWorkers = () => {
        return fetch('/transferfreeterms', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    workers: this.workers
                })
            })
            .then(r => r.json())
            .then(data => {
                this.freetermsofworkers = data.freeterms;
            })
    }
    createHTMLStructureForTeerms = async () => {
        await this.fetchToTransferAllWorkers();
        const freetermosworkers = this.freetermsofworkers;
        this.freetermsofworkers = [];
        await this.fetchToTransferFreeTermsForWorkers();
        if (this.workers.length <= 0 && this.freetermsleftside.querySelectorAll('.freeterms__worker').length === 0) {
            this.freetermsleftsideworkers.innerHTML = "";
            this.hideLoader();
            return this.createHTMLStructureForOneWorker();
        }
        if (JSON.stringify(this.freetermsofworkers) !== JSON.stringify(freetermosworkers)) {
            this.freetermsleftsideworkers.innerHTML = "";
            this.hideLoader();
            for (const el of this.freetermsofworkers) {
                this.createHTMLStructureForOneWorker(el);
            }
        }
    }
    createHTMLStructureForOneWorker = (data) => {
        if (data === undefined) {
            const worker = document.createElement('div');
            worker.className = "freeterms__worker"
            const workerp1 = document.createElement('p');
            workerp1.textContent = 'Brak pracowników w bazie';
            worker.appendChild(workerp1);
            this.freetermsleftsideworkers.appendChild(worker);
            return;
        }
        const tableOfMonths = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
        const worker = document.createElement('div');
        worker.className = "freeterms__worker"
        const workerp1 = document.createElement('p');
        workerp1.textContent = data.worker;
        const workerp2 = document.createElement('p');
        for (const el of data.terms) {
            const date = new Date();
            let acctualmonth = date.getMonth();
            if (el.month === 'next') {
                acctualmonth++;
                if (acctualmonth > 11) {
                    acctualmonth = 0;
                }
            } else if (el.month === 'after') {
                acctualmonth = acctualmonth + 2;
                if (acctualmonth === 12) {
                    acctualmonth = 0;
                } else if (acctualmonth === 13) {
                    acctualmonth = 1;
                }
            }
            const workerp2p1 = document.createElement('p');
            if (el.month === undefined) {
                workerp2p1.textContent = `${el}`;
            } else {
                workerp2p1.textContent = `${el.day} ${tableOfMonths[acctualmonth]} ${el.from}`;
            }
            workerp2.appendChild(workerp2p1);
        }
        worker.appendChild(workerp1);
        worker.appendChild(workerp2);

        this.freetermsleftsideworkers.appendChild(worker);
    }
}