import express from 'express';
const router = express.Router();
import fs from 'fs';
import dotenv from 'dotenv';
import {
    parse,
    stringify
} from 'envfile';
import * as month from './month.js';

router.get('/transfercalendar', async function (req, res) {
    await month.transferAllMonths()
        .then(data => {
            return res.json({
                data
            })
        });
})
router.post('/addworker', async function (req, res) {
    const namesurname = `${req.body.name} ${req.body.surname}`;
    await month.addWorker(namesurname);
    res.status(200);
    res.end();
})
router.get('/getworkers', async function (req, res) {
    const workers = month.getWorkers()
        .then(data => {
            return res.json(data);
        })
})
router.post('/removeworker', async function (req, res) {
    await month.removeWorker(req.body.name);
    res.status(200);
    res.end();
})
router.post('/addchangeweek', async function (req, res) {
    await month.setChangeToWorkerInWeek(req.body.week, req.body.worker, req.body.from, req.body.to, req.body.breaks);
    res.status(200);
    res.end();
})
router.post('/removechangeweek', async function (req, res) {
    await month.removeChangeToWorkerInWeek(req.body.week, req.body.worker);
    res.status(200);
    res.end();
})
router.post('/addchangemonth', async function (req, res) {
    await month.setChangeToWorkerInMonth(req.body.week, req.body.worker, req.body.from, req.body.to, req.body.breaks)
    res.status(200);
    res.end();
});
router.post('/removechangemonth', async function (req, res) {
    await month.removeChangeToWorkerInMonth(req.body.week, req.body.worker)
    res.status(200);
    res.end();
})
router.post('/removechangeday', async function (req, res) {
    await month.removeChangeToWorkerInDay(req.body.day, req.body.month, req.body.worker)
    res.status(200);
    res.end();
})
router.post('/addchangeday', async function (req, res) {
    await month.setChangeToWorkerInDay(req.body.day, req.body.month, req.body.worker, req.body.from, req.body.to, req.body.breaks)
    res.status(200);
    res.end();
})
router.get('/logout', function (req, res) {
    res.cookie('loginedworker', false, {
        maxAge: 0,
    });
    res.cookie('loginedadmin', false, {
        maxAge: 0,
    });
    res.end();
})
router.post('/changepassword', function (req, res) {
    if (req.body.name === 'pracownik') {
        if (req.body.oldpassword === process.env.WORKER_PASSWORD) {
            const envConfig = dotenv.parse(fs.readFileSync('.env'));
            envConfig.WORKER_PASSWORD = req.body.newpassword;
            fs.writeFileSync('.env', stringify(envConfig));
            res.json({
                changetoworker: true
            });
            return res.end();
        } else {
            res.json({
                change: false
            });
            return res.end();
        }
    } else if (req.body.name === 'admin') {
        if (req.body.oldpassword === process.env.ADMIN_PASSWORD) {
            const envConfig = dotenv.parse(fs.readFileSync('.env'));
            envConfig.ADMIN_PASSWORD = req.body.newpassword;
            fs.writeFileSync('.env', stringify(envConfig));
            res.json({
                changetoadmin: true
            });
            return res.end();
        } else {
            res.json({
                change: false
            });
            return res.end();
        }
    }
})
router.post('/transferday', function (req, res) {
    const date = new Date();
    const day = month.transferDay(req.body.day, req.body.month)
        .then(data => {
            if (data !== undefined) {
                return res.json({
                    data,
                })
            } else {
                const day = month.transferDay(date.getDate(), 'current')
                    .then(data => {
                        return res.json({
                            data,
                        })
                    })
            }
        });
})
router.post('/transferdatabase', async function (req, res) {
    month.getDatabaseWhatContainsCharacters(req.body.characters)
        .then(data => {
            return res.json({
                data
            })
        })
})
router.post('/addclient', async function (req, res) {
    await month.addClient(req.body.month, req.body.day, req.body.worker, req.body.name, req.body.number, req.body.fromStart, req.body.ToStart, req.body.FromEnd, req.body.ToEnd);
    res.status(200);
    res.end();
})
router.post('/addbreak', async function (req, res) {
    await month.addBreak(req.body.month, req.body.day, req.body.worker, req.body.fromStart, req.body.ToStart, req.body.FromEnd, req.body.ToEnd);
    res.status(200);
    res.end();
})
router.post('/removeclient', async function (req, res) {
    await month.removeClient(req.body.month, req.body.day, req.body.worker, req.body.fromStart, req.body.ToStart);
    res.status(200);
    res.end();
})
router.post('/removebreak', async function (req, res) {
    await month.removeBreak(req.body.month, req.body.day, req.body.worker, req.body.fromStart, req.body.ToStart);
    res.status(200);
    res.end();
})
router.get('/transferfirst20clientsofdatabase', async function (req, res) {
    const elements = await month.getFirst20ClientsOfDatabase()
        .then(data => {
            return res.json({
                data
            })
        })
})
router.post('/transferfirst20clientsofdatabasefromproperty', async function (req, res) {
    const elements = await month.getFirst20ClientsOfDatabaseFromProperty(req.body.property)
        .then(data => {
            return res.json({
                data
            })
        })
})
router.post('/transfer20clients', async function (req, res) {
    const element = await month.get20ClientsOfDatabaseFromProperty(req.body.clientindexfrom, req.body.property)
        .then(data => {
            return res.json({
                data
            })
        })
})
router.post('/addtoblacklist', async function (req, res) {
    await month.addClientToBlackList(req.body.clientname, req.body.clientcontact);
    res.status(200);
    res.end();
})
router.post('/removeclientfromdatabase', async function (req, res) {
    await month.removeClientFromDatabase(req.body.clientname, req.body.clientcontact);
    res.status(200);
    res.end();
})
router.post('/removefromblacklist', async function (req, res) {
    await month.removeFromBlacklist(req.body.clientname, req.body.clientcontact);
    res.status(200);
    res.end();
})
router.post('/editclientinformations', async function (req, res) {
    await month.editClientInformations(req.body.clientnamefrom, req.body.clientcontactfrom, req.body.clientnameto, req.body.clientcontactto);
    res.status(200);
    res.end();
})
router.post('/addnewclient', async function (req, res) {
    await month.addClientToDataBase(req.body.clientname, req.body.clientcontact);
    res.status(200);
    res.end();
})
router.get('/lengthofdatabase', async function (req, res) {
    await month.getLengthOfDatabase()
        .then(data => {
            res.json({
                data
            })
        })
})
router.post('/lengthofdatabasefromproperty', async function (req, res) {
    await month.getLengthOfDatabaseFromProperty(req.body.property)
        .then(data => {
            res.json({
                data
            })
        })
})
router.get('/transferallworkers', async function (req, res) {
    const workers = [];
    await month.getWorkers()
        .then(data => {
            data.forEach((e) => {
                workers.push(e.worker[0].name)
            })
            res.json({
                workers
            })
        })
})
router.post('/transferfreeterms', async function (req, res) {
    const freeterms = [];
    const workers = req.body.workers;
    for (const el of workers) {
        const terms = await month.transfer3LastFreeTerms(el);
        freeterms.push({
            worker: el,
            terms: terms,
        })
    }
    res.json({
        freeterms,
    })
})
router.post('/checklengthdaysofmonth', async function (req, res) {
    const days = await month.checkDaysOfMonth(req.body.month);
    res.json({
        days
    })
})
router.post('/transferstatsforworkerinpreviousmonth', async function (req, res) {
    const object = await month.transferStatsForWorkerInPreviousMonth(req.body.worker);
    res.json({
        object
    })
})
router.post('/transferstatsforworkerincurrentmonth', async function (req, res) {
    const object = await month.transferStatsForWorkerInCurrentMonth(req.body.worker);
    res.json({
        object
    })
})
router.post('/addfreeforday', async function (req, res) {
    await month.SetFreeDay(req.body.day, req.body.month, req.body.worker);
    res.status(200);
    res.end();
})
router.post('/removefreeforday', async function (req, res) {
    await month.unSetFreeDay(req.body.day, req.body.month, req.body.worker);
    res.status(200);
    res.end();
})

export {
    router
};