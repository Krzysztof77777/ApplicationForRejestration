import mongoose from 'mongoose';
import PreviousMonthModel from '../models/PreviousMonth.js';
import CurrentMonthModel from '../models/CurrentMonth.js';
import NextMonthModel from '../models/NextMonth.js';
import BeforePreviousMonthModel from '../models/BeforePreviousMonth.js';
import AfterNextMonthModel from '../models/AfterNextMonth.js';
import DatabaseOfClients from '../models/DatabaseOfClients.js';

let currentMonthFlaga = true;
let currentDayFlaga = true;

async function transferAllMonths() {
    const BeforePrevMonth = await BeforePreviousMonthModel
        .find({})
        .exec();
    const PrevMonth = await PreviousMonthModel
        .find({})
        .exec();
    const CurrentMonth = await CurrentMonthModel
        .find({})
        .exec();
    const NextMonth = await NextMonthModel
        .find({})
        .exec();
    const AfterNextMonth = await AfterNextMonthModel
        .find({})
        .exec();
    const data = {
        BeforePrevMonth,
        PrevMonth,
        CurrentMonth,
        NextMonth,
        AfterNextMonth
    }
    return data;
}

async function addWorker(firstnameandlastname) {
    const day = await CurrentMonthModel
        .findOne({})
        .exec();
    const itemObject = day.toObject();
    itemObject.workers.push({
        worker: [{
                name: firstnameandlastname
            },
            {
                hours: [

                ]
            },
            {
                change: {
                    from: '',
                    to: '',
                }
            }
        ]
    });

    await CurrentMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await PreviousMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await NextMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await BeforePreviousMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await AfterNextMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
}

async function removeWorker(name) {
    const day = await CurrentMonthModel
        .findOne({})
        .exec();
    const itemObject = day.toObject();
    const indexworkertoremove = itemObject.workers.findIndex(e => e.worker[0].name === name);
    itemObject.workers.splice(indexworkertoremove, 1);

    await CurrentMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await PreviousMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await NextMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await BeforePreviousMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
    await AfterNextMonthModel
        .updateMany({}, {
            workers: itemObject.workers
        })
}
async function setChangeToWorkerInMonth(MONTH, WORKER, FROM, TO, BREAKS) {
    const tableOfHoursChangeClient = await transferTableOfHours('change');
    const month = MONTH;
    const worker = WORKER;
    let from = FROM;
    const to = TO;
    let days;
    const breaks = BREAKS;
    const currentIndexAtStartOfTable = tableOfHoursChangeClient.findIndex(e => e.from === from);
    let letcurrentIndex = currentIndexAtStartOfTable;
    let counterToAddHours = (parseInt(to) - parseInt(from)) * 4;
    if (from.slice(3) === '15') {
        counterToAddHours = counterToAddHours - 1;
    } else if (from.slice(3) === "30") {
        counterToAddHours = counterToAddHours - 2;
    } else if (from.slice(3) === '45') {
        counterToAddHours = counterToAddHours - 3;
    }
    if (to.slice(3) === '15') {
        counterToAddHours++;
    } else if (to.slice(3) === '30') {
        counterToAddHours = counterToAddHours + 2;
    } else if (to.slice(3) === '45') {
        counterToAddHours = counterToAddHours + 3;
    }
    if (month === 'current') {
        const oneday = await CurrentMonthModel
            .find({})
            .exec();
        days = oneday.length;

        for (let i = 1; i <= days; i++) {
            const day = await CurrentMonthModel
                .findOne({
                    day: i
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;

            await CurrentMonthModel
                .findOneAndUpdate({
                    day: i
                }, {
                    workers: itemObject.workers
                })
        }
    } else if (month === 'previous') {
        const oneday = await PreviousMonthModel
            .find({})
            .exec();
        days = oneday.length;

        for (let i = 1; i <= days; i++) {
            const day = await PreviousMonthModel
                .findOne({
                    day: i
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;

            await PreviousMonthModel
                .findOneAndUpdate({
                    day: i
                }, {
                    workers: itemObject.workers
                })
        }
    } else if (month === "next") {
        const oneday = await NextMonthModel
            .find({})
            .exec();
        days = oneday.length;

        for (let i = 1; i <= days; i++) {
            const day = await NextMonthModel
                .findOne({
                    day: i
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;

            await NextMonthModel
                .findOneAndUpdate({
                    day: i
                }, {
                    workers: itemObject.workers
                })
        }
    }
}
async function removeChangeToWorkerInMonth(MONTH, WORKER) {
    const month = MONTH;
    const worker = WORKER;
    let days;

    if (month === 'current') {
        const oneday = await CurrentMonthModel
            .find({})
            .exec();
        days = oneday.length;

        for (let i = 1; i <= days; i++) {
            const day = await CurrentMonthModel
                .findOne({
                    day: i
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await CurrentMonthModel
                .findOneAndUpdate({
                    day: i
                }, {
                    workers: itemObject.workers
                })
        }
    } else if (month === 'previous') {
        const oneday = await PreviousMonthModel
            .find({})
            .exec();
        days = oneday.length;

        for (let i = 1; i <= days; i++) {
            const day = await PreviousMonthModel
                .findOne({
                    day: i
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await PreviousMonthModel
                .findOneAndUpdate({
                    day: i
                }, {
                    workers: itemObject.workers
                })
        }
    } else if (month === "next") {
        const oneday = await NextMonthModel
            .find({})
            .exec();
        days = oneday.length;

        for (let i = 1; i <= days; i++) {
            const day = await NextMonthModel
                .findOne({
                    day: i
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await NextMonthModel
                .findOneAndUpdate({
                    day: i
                }, {
                    workers: itemObject.workers
                })
        }
    }
}
async function setChangeToWorkerInDay(DAY, MONTH, WORKER, FROM, TO, BREAKS) {
    const tableOfHoursChangeClient = await transferTableOfHours('change');
    const dayindex = DAY;
    const worker = WORKER;
    const month = MONTH;
    let from = FROM;
    const to = TO;
    const breaks = BREAKS;
    const currentIndexAtStartOfTable = tableOfHoursChangeClient.findIndex(e => e.from === from);
    let letcurrentIndex = currentIndexAtStartOfTable;
    let counterToAddHours = (parseInt(to) - parseInt(from)) * 4;
    if (from.slice(3) === '15') {
        counterToAddHours = counterToAddHours - 1;
    } else if (from.slice(3) === "30") {
        counterToAddHours = counterToAddHours - 2;
    } else if (from.slice(3) === '45') {
        counterToAddHours = counterToAddHours - 3;
    }
    if (to.slice(3) === '15') {
        counterToAddHours++;
    } else if (to.slice(3) === '30') {
        counterToAddHours = counterToAddHours + 2;
    } else if (to.slice(3) === '45') {
        counterToAddHours = counterToAddHours + 3;
    }
    let day;
    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
    }
    const itemObject = day.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
    itemObject.workers[indexofworker].worker[1].hours = [];
    itemObject.workers[indexofworker].worker[2].change = {
        from: from,
        to: to
    }
    for (let i = 1; i <= counterToAddHours; i++) {
        let status = "active";
        let breakfrom;
        let breakto;
        if (breaks.length > 0) {
            for (const el of breaks) {
                const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                    status = "break";
                    breakfrom = el.breakfrom;
                    breakto = el.breakto;
                    if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                        if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                            status = 'deactivefrombreak';
                        }
                        if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                            status = 'break';
                        }
                    }
                    break;
                }
            }
        }
        itemObject.workers[indexofworker].worker[1].hours.push({
            from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
            to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
            client: [{
                name: '',
                contact: '',
            }],

            status: status,
        });
        letcurrentIndex++;
    }
    if (month === 'previous') {
        await PreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "before") {
        await BeforePreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === 'current') {
        await CurrentMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "next") {
        await NextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "after") {
        await AfterNextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    }
}
async function removeChangeToWorkerInDay(DAY, MONTH, WORKER) {
    const dayindex = DAY;
    const worker = WORKER;
    const month = MONTH;

    let day;
    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
    }
    const itemObject = day.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
    itemObject.workers[indexofworker].worker[1].hours = [];
    itemObject.workers[indexofworker].worker[2].change = {
        from: '',
        to: ''
    }
    if (month === 'previous') {
        await PreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "before") {
        await BeforePreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === 'current') {
        await CurrentMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "next") {
        await NextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "after") {
        await AfterNextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    }
}
async function setChangeToWorkerInWeek(DAYS, WORKER, FROM, TO, BREAKS) {
    const tableOfHoursChangeClient = await transferTableOfHours('change');
    const days = DAYS;
    const worker = WORKER;
    let from = FROM;
    const to = TO;
    const breaks = BREAKS;
    const currentIndexAtStartOfTable = tableOfHoursChangeClient.findIndex(e => e.from === from);
    let letcurrentIndex = currentIndexAtStartOfTable;
    let counterToAddHours = (parseInt(to) - parseInt(from)) * 4;
    if (from.slice(3) === '15') {
        counterToAddHours = counterToAddHours - 1;
    } else if (from.slice(3) === "30") {
        counterToAddHours = counterToAddHours - 2;
    } else if (from.slice(3) === '45') {
        counterToAddHours = counterToAddHours - 3;
    }
    if (to.slice(3) === '15') {
        counterToAddHours++;
    } else if (to.slice(3) === '30') {
        counterToAddHours = counterToAddHours + 2;
    } else if (to.slice(3) === '45') {
        counterToAddHours = counterToAddHours + 3;
    }

    for (const el of days) {
        if (el.month === "previous") {
            const day = await PreviousMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;
            await PreviousMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "current") {
            const day = await CurrentMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;
            await CurrentMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "next") {
            const day = await NextMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;
            await NextMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "before") {
            const day = await BeforePreviousMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                            }
                            break;
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;
            await BeforePreviousMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "after") {
            const day = await AfterNextMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: from,
                to: to
            }
            for (let i = 1; i <= counterToAddHours; i++) {
                let status = "active";
                let breakfrom;
                let breakto;
                if (breaks.length > 0) {
                    for (const el of breaks) {
                        const breakfromindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakfrom);
                        const breaktoindex = tableOfHoursChangeClient.findIndex(e => e.from === el.breakto);
                        if (letcurrentIndex < breaktoindex && letcurrentIndex >= breakfromindex) {
                            status = "break";
                            breakfrom = el.breakfrom;
                            breakto = el.breakto;
                            if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1] !== undefined) {
                                if (itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'break' || itemObject.workers[indexofworker].worker[1].hours[itemObject.workers[indexofworker].worker[1].hours.length - 1].status === 'deactivefrombreak') {
                                    status = 'deactivefrombreak';
                                }
                                if (tableOfHoursChangeClient[letcurrentIndex].from === breakfrom) {
                                    status = 'break';
                                }
                                break;
                            }
                        }
                    }
                }
                itemObject.workers[indexofworker].worker[1].hours.push({
                    from: status === 'break' ? breakfrom : tableOfHoursChangeClient[letcurrentIndex].from,
                    to: status === 'break' ? breakto : tableOfHoursChangeClient[letcurrentIndex].to,
                    client: [{
                        name: '',
                        contact: '',
                    }],
                    status: status,
                });
                letcurrentIndex++;
            }
            letcurrentIndex = currentIndexAtStartOfTable;
            await AfterNextMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        }
    }
}
async function removeChangeToWorkerInWeek(DAYS, WORKER) {
    const days = DAYS;
    const worker = WORKER;
    for (const el of days) {
        if (el.month === "current") {
            const day = await CurrentMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await CurrentMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "previous") {
            const day = await PreviousMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await PreviousMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "next") {
            const day = await NextMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await NextMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "after") {
            const day = await AfterNextMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await AfterNextMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        } else if (el.month === "before") {
            const day = await BeforePreviousMonthModel
                .findOne({
                    day: el.day
                })
                .exec();
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
            itemObject.workers[indexofworker].worker[1].hours = [];
            itemObject.workers[indexofworker].worker[2].change = {
                from: '',
                to: ''
            }
            await BeforePreviousMonthModel
                .findOneAndUpdate({
                    day: el.day
                }, {
                    workers: itemObject.workers
                });
        }
    }
}
async function getWorkers() {
    const day = await CurrentMonthModel
        .findOne({})
        .exec();
    const itemObject = day.toObject();
    return itemObject.workers;
}
async function checkCorrectAllMonth() {
    const tableOfMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateForUpdate = new Date();
    const date = new Date();
    const currentday = date.getDate();
    const currentmonth = date.getMonth();
    let acctualmonth = date.getMonth();
    let currentyear = date.getFullYear();
    let numberOfDaysInThisMonth = null;
    const before = await BeforePreviousMonthModel
        .findOne()
        .sort({
            day: -1
        })
        .exec();
    const beforeObject = before.toObject();
    if (acctualmonth === 0) {
        acctualmonth = 10
    } else if (acctualmonth === 1) {
        acctualmonth = 11;
    } else {
        acctualmonth = acctualmonth - 2;
    }
    if (acctualmonth > currentmonth) {
        currentyear = currentyear - 1;
    }
    dateForUpdate.setMonth(acctualmonth);
    dateForUpdate.setFullYear(currentyear);
    numberOfDaysInThisMonth = checkNumberOfDays(dateForUpdate);
    if (beforeObject.month !== tableOfMonth[acctualmonth] || beforeObject.year !== currentyear && beforeObject.day === numberOfDaysInThisMonth) {
        await completeMonth(acctualmonth, currentyear, 'before');
    }
    acctualmonth = date.getMonth();
    currentyear = date.getFullYear();
    const previous = await PreviousMonthModel
        .findOne()
        .sort({
            day: -1
        })
        .exec();
    const previousObject = previous.toObject();
    if (acctualmonth === 0) {
        acctualmonth = 11;
    } else {
        acctualmonth = acctualmonth - 1;
    }
    if (acctualmonth > currentmonth) {
        currentyear = currentyear - 1;
    }
    dateForUpdate.setMonth(acctualmonth);
    dateForUpdate.setFullYear(currentyear);
    numberOfDaysInThisMonth = checkNumberOfDays(dateForUpdate);
    if (previousObject.month !== tableOfMonth[acctualmonth] || previousObject.year !== currentyear && previousObject.day === numberOfDaysInThisMonth) {
        await completeMonth(acctualmonth, currentyear, 'previous');
    }
    acctualmonth = date.getMonth();
    currentyear = date.getFullYear();
    const current = await CurrentMonthModel
        .findOne()
        .sort({
            day: -1
        })
        .exec();
    const currentObject = current.toObject();
    dateForUpdate.setMonth(acctualmonth);
    dateForUpdate.setFullYear(currentyear);
    numberOfDaysInThisMonth = checkNumberOfDays(dateForUpdate);
    if (currentObject.month !== tableOfMonth[acctualmonth] || currentObject.year !== currentyear && currentObject.day === numberOfDaysInThisMonth) {
        await completeMonth(acctualmonth, currentyear, 'current');
    }
    acctualmonth = date.getMonth();
    currentyear = date.getFullYear();
    const next = await NextMonthModel
        .findOne()
        .sort({
            day: -1
        })
        .exec();
    const nextObject = next.toObject();
    if (acctualmonth === 11) {
        acctualmonth = 0
    } else {
        acctualmonth = acctualmonth + 1;
    }
    if (acctualmonth < currentmonth) {
        currentyear = currentyear + 1
    }
    dateForUpdate.setMonth(acctualmonth);
    dateForUpdate.setFullYear(currentyear);
    numberOfDaysInThisMonth = checkNumberOfDays(dateForUpdate);
    if (nextObject.month !== tableOfMonth[acctualmonth] || nextObject.year !== currentyear && nextObject.day === numberOfDaysInThisMonth) {
        await completeMonth(acctualmonth, currentyear, 'next');
    }
    acctualmonth = date.getMonth();
    currentyear = date.getFullYear();
    const after = await AfterNextMonthModel
        .findOne()
        .sort({
            day: -1
        })
        .exec();
    const afterObject = after.toObject();
    if (acctualmonth === 11) {
        acctualmonth = 1;
    } else if (acctualmonth === 10) {
        acctualmonth = 0;
    } else {
        acctualmonth = acctualmonth + 2;
    }
    if (acctualmonth < currentmonth) {
        currentyear = currentyear + 1
    }
    dateForUpdate.setMonth(acctualmonth);
    dateForUpdate.setFullYear(currentyear);
    numberOfDaysInThisMonth = checkNumberOfDays(dateForUpdate);
    if (afterObject.month !== tableOfMonth[acctualmonth] || afterObject.year !== currentyear && afterObject.day === numberOfDaysInThisMonth) {
        await completeMonth(acctualmonth, currentyear, 'after');
    }
    const CurrentMonth = await CurrentMonthModel
        .updateMany({}, {
            currentDay: 'false'
        });
    await PreviousMonthModel
        .updateMany({}, {
            currentDay: 'false'
        });
    await CurrentMonthModel
        .findOneAndUpdate({
            day: currentday
        }, {
            currentDay: 'true'
        })
}
checkCorrectAllMonth();
async function checkCurrentDayAndMonth() {
    const date = new Date();
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    if (hour === 0 && minutes === 0 && day === 1) {
        if (currentMonthFlaga) {
            await mongoose.connection.collection('BeforePreviousMonth').rename('willBeNextMonth');
            await mongoose.connection.collection('PreviousMonth').rename('BeforePreviousMonth');
            await mongoose.connection.collection('CurrentMonth').rename('PreviousMonth');
            await mongoose.connection.collection('NextMonth').rename('CurrentMonth');
            await mongoose.connection.collection('AfterNextMonth').rename('NextMonth');
            await mongoose.connection.collection('willBeNextMonth').rename('AfterNextMonth');

            let acctualmonth = date.getMonth();
            const currentmonth = date.getMonth();
            let currentyear = date.getFullYear();
            if (acctualmonth === 11) {
                acctualmonth = 1;
            } else if (acctualmonth === 10) {
                acctualmonth = 0;
            } else {
                acctualmonth = acctualmonth + 2;
            }
            if (acctualmonth < currentmonth) {
                currentyear = currentyear + 1
            }
            await completeMonth(acctualmonth, currentyear, 'after');
        }
        currentMonthFlaga = false;
        setTimeout(() => {
            currentMonthFlaga = true;
        }, 300000)
    }
    if (hour === 0 && minutes === 0) {
        if (currentDayFlaga) {
            const CurrentMonth = await CurrentMonthModel
                .updateMany({}, {
                    currentDay: 'false'
                });
            await PreviousMonthModel
                .updateMany({}, {
                    currentDay: 'false'
                });
            const currentDay = await CurrentMonthModel
                .find({})
                .exec();
            const currentDayObject = currentDay.find(e => e.day === day);
            await CurrentMonthModel
                .findByIdAndUpdate({
                    _id: `${currentDayObject.id}`
                }, {
                    currentDay: 'true'
                }, function (err, doc) {
                    if (err) {
                        return console.log(err)
                    }
                })
            currentDayFlaga = false;
            setTimeout(() => {
                currentDayFlaga = true;
            }, 300000)
        }
    }
}

async function transferDay(day, month) {
    let transferedDay;
    switch (month) {
        case 'current':
            transferedDay = await CurrentMonthModel
                .find({
                    day: day
                })
            break;
        case 'previous':
            transferedDay = await PreviousMonthModel
                .find({
                    day: day
                })
            break;
        case 'before':
            transferedDay = await BeforePreviousMonthModel
                .find({
                    day: day
                })
            break;
        case 'next':
            transferedDay = await NextMonthModel
                .find({
                    day: day
                })
            break;
        case 'after':
            transferedDay = await AfterNextMonthModel
                .find({
                    day: day
                })
            break;
    }
    return transferedDay;
}

function checkNumberOfDays(dates) {
    const date = dates;
    const month = date.getMonth();
    for (let i = 26; i < 35; i++) {
        date.setDate(i);
        const generateMonth = date.getMonth();
        if (generateMonth !== month) {
            return i - 1;
        }
    }
}

function checkFirstDayInNextMonth(dates) {
    const date = dates;
    let currentDay = date.getDay();
    if (currentDay === 0) {
        return 6;
    } else {
        return currentDay - 1;
    }
}
async function completeMonth(ACCTUALMONTH, CURRENTYEAR, MONTH) {
    const tableOfMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    date.setFullYear(CURRENTYEAR);
    const acctualmonth = ACCTUALMONTH;
    date.setMonth(acctualmonth);
    date.setDate(1);
    const year = date.getFullYear();
    const randomday = await PreviousMonthModel
        .findOne({})
        .exec();
    const itemObject = randomday.toObject();
    itemObject.workers.forEach((e) => {
        e.worker[1].hours = [];
        e.worker[2].change = {
            from: '',
            to: ''
        }
    })
    let currentDay = checkFirstDayInNextMonth(date);
    let nameDaysTable = ['Mon', 'Tues', 'Wed', 'Thur', 'Frid', 'Sat', 'Sun'];
    let days = checkNumberOfDays(date);
    switch (MONTH) {
        case 'before':
            await BeforePreviousMonthModel
                .deleteMany();
            for (let i = 1; i <= days; i++) {
                const day = new BeforePreviousMonthModel({
                    day: i,
                    month: tableOfMonth[acctualmonth],
                    year: year,
                    status: 'active',
                    dayOfTheWeek: `${nameDaysTable[currentDay]}`,
                    currentDay: false,
                    workers: itemObject.workers,
                })
                await day.save();
                currentDay++;
                if (currentDay > nameDaysTable.length - 1) {
                    currentDay = 0;
                }
            }
            break;
        case 'previous':
            await PreviousMonthModel
                .deleteMany();
            for (let i = 1; i <= days; i++) {
                const day = new PreviousMonthModel({
                    day: i,
                    month: tableOfMonth[acctualmonth],
                    year: year,
                    status: 'active',
                    dayOfTheWeek: `${nameDaysTable[currentDay]}`,
                    currentDay: false,
                    workers: itemObject.workers,
                })
                await day.save();
                currentDay++;
                if (currentDay > nameDaysTable.length - 1) {
                    currentDay = 0;
                }
            }
            break;
        case 'current':
            await CurrentMonthModel
                .deleteMany();
            for (let i = 1; i <= days; i++) {
                const day = new CurrentMonthModel({
                    day: i,
                    month: tableOfMonth[acctualmonth],
                    year: year,
                    status: 'active',
                    dayOfTheWeek: `${nameDaysTable[currentDay]}`,
                    currentDay: false,
                    workers: itemObject.workers,
                })
                await day.save();
                currentDay++;
                if (currentDay > nameDaysTable.length - 1) {
                    currentDay = 0;
                }
            }
            break;
        case 'next':
            await NextMonthModel
                .deleteMany();
            for (let i = 1; i <= days; i++) {
                const day = new NextMonthModel({
                    day: i,
                    month: tableOfMonth[acctualmonth],
                    year: year,
                    status: 'active',
                    dayOfTheWeek: `${nameDaysTable[currentDay]}`,
                    currentDay: false,
                    workers: itemObject.workers,
                })
                await day.save();
                currentDay++;
                if (currentDay > nameDaysTable.length - 1) {
                    currentDay = 0;
                }
            }
            break;
        case 'after':
            await AfterNextMonthModel
                .deleteMany();
            for (let i = 1; i <= days; i++) {
                const day = new AfterNextMonthModel({
                    day: i,
                    month: tableOfMonth[acctualmonth],
                    year: year,
                    status: 'active',
                    dayOfTheWeek: `${nameDaysTable[currentDay]}`,
                    currentDay: false,
                    workers: itemObject.workers,
                })
                await day.save();
                currentDay++;
                if (currentDay > nameDaysTable.length - 1) {
                    currentDay = 0;
                }
            }
            break;
    }
}

async function addClientToDataBase(name, number) {
    const object = await DatabaseOfClients
        .find({})
    const checkClintContainInDatabase = object.findIndex(e => e.name === name && e.contact === number);
    if (checkClintContainInDatabase === -1) {
        const newClient = await new DatabaseOfClients({
            name: `${name}`,
            contact: `${number}`,
        })
        newClient.save();
    } else return;
}

async function addClient(month, day, worker, name, number, fromStart, toStart, fromEnd, toEnd) {
    const tableOfHours = await transferTableOfHours('hours');
    let dayData;
    const dayChecked = day;
    const workerName = worker;
    const nameOfClient = name;
    const numberOfClient = number;
    const fromHourStart = fromStart;
    const toHourStart = toStart;
    const fromHourEnd = fromEnd;
    const toHourEnd = toEnd;

    switch (month) {
        case 'before':
            dayData = await BeforePreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
                .exec();
            break;
        case 'previous':
            dayData = await PreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'current':
            dayData = await CurrentMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'next':
            dayData = await NextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'after':
            dayData = await AfterNextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
    }
    const itemObject = dayData.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
    const indexofcheckedhourwvisit = itemObject.workers[indexofworker].worker[1].hours.findIndex(e =>
        e.from === fromHourStart && e.to === toHourStart
    )

    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from = fromHourEnd;
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to = toHourEnd;
    if (nameOfClient === '' && numberOfClient === '') {

    } else {
        addClientToDataBase(nameOfClient, numberOfClient)
        itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].client[0].name = nameOfClient;
        itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].client[0].contact = numberOfClient;
        itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].status = 'booked';
    }

    const indexOfTableCheckedHourTo = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to);
    for (let i = indexofcheckedhourwvisit + 1; i <= indexofcheckedhourwvisit + 11; i++) {
        if (itemObject.workers[indexofworker].worker[1].hours[i] !== undefined) {
            const indexOfTableCheckedHourToNextVisit = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[i].from);
            if (indexOfTableCheckedHourToNextVisit < indexOfTableCheckedHourTo) {
                itemObject.workers[indexofworker].worker[1].hours[i].status = 'deactivefromprev';
            } else if (indexOfTableCheckedHourToNextVisit >= indexOfTableCheckedHourTo) {
                if (itemObject.workers[indexofworker].worker[1].hours[i].status === 'deactivefromprev') {
                    itemObject.workers[indexofworker].worker[1].hours[i].status = 'active';
                } else break;
            }
        }
    }

    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
    }
}
async function removeClient(month, day, worker, fromStart, toStart) {
    const tableOfHours = await transferTableOfHours('change');
    let dayData;
    const dayChecked = day;
    const workerName = worker;
    const fromHourStart = fromStart;
    const toHourStart = toStart;
    switch (month) {
        case 'before':
            dayData = await BeforePreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
                .exec();
            break;
        case 'previous':
            dayData = await PreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'current':
            dayData = await CurrentMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'next':
            dayData = await NextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'after':
            dayData = await AfterNextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
    }
    const itemObject = dayData.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
    const indexofcheckedhourwvisit = itemObject.workers[indexofworker].worker[1].hours.findIndex(e =>
        e.from === fromHourStart && e.to === toHourStart
    )
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].client[0].name = ""
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].client[0].contact = ""
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].status = 'active';

    const indexOfTableCheckedHourFrom = tableOfHours.findIndex(e => e.from === itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from);
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from = tableOfHours[indexOfTableCheckedHourFrom].from;
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to = tableOfHours[indexOfTableCheckedHourFrom].to;

    const indexOfTableCheckedHourTo = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to);
    for (let i = indexofcheckedhourwvisit + 1; i <= indexofcheckedhourwvisit + 11; i++) {
        if (itemObject.workers[indexofworker].worker[1].hours[i] !== undefined) {
            const indexOfTableCheckedHourToNextVisit = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[i].from);
            if (indexOfTableCheckedHourToNextVisit < indexOfTableCheckedHourTo) {
                itemObject.workers[indexofworker].worker[1].hours[i].status = 'deactivefromprev';
            } else if (indexOfTableCheckedHourToNextVisit >= indexOfTableCheckedHourTo) {
                if (itemObject.workers[indexofworker].worker[1].hours[i].status === 'deactivefromprev') {
                    itemObject.workers[indexofworker].worker[1].hours[i].status = 'active';
                } else break;
            }
        }
    }

    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
    }
}
async function getFirst20ClientsOfDatabase() {
    const data = await DatabaseOfClients
        .find({})
        .sort({
            name: 1,
            date: -1,
        })
        .skip(0)
        .limit(20)
        .exec();
    return data;
}

async function getFirst20ClientsOfDatabaseFromProperty(property) {
    if (property !== '') {
        if (!isNaN(parseFloat(property[0]))) {
            const data = await DatabaseOfClients
                .find({
                    contact: {
                        $regex: `^${property}`,
                        $options: 'i',
                    }
                })
                .sort({
                    name: 1,
                    date: -1,
                })
                .skip(0)
                .limit(20)
                .exec();
            return data;
        } else {
            const data = await DatabaseOfClients
                .find({
                    name: {
                        $regex: `^${property}`,
                        $options: 'i',
                    }
                })
                .sort({
                    name: 1,
                    date: -1,
                })
                .skip(0)
                .limit(20)
                .exec();
            return data;
        }
    } else {
        const data = await DatabaseOfClients
            .find({
                name: {
                    $regex: `^${property}`,
                    $options: 'i',
                }
            })
            .sort({
                name: 1,
                date: -1,
            })
            .skip(0)
            .limit(20)
            .exec();
        return data;
    }
}
async function get20ClientsOfDatabaseFromProperty(index, property) {
    if (index > -1) {
        if (property !== '') {
            if (!isNaN(parseFloat(property[0]))) {
                const data = await DatabaseOfClients
                    .find({
                        contact: {
                            $regex: `^${property}`,
                            $options: 'i',
                        }
                    })
                    .sort({
                        name: 1,
                        date: -1,
                    })
                    .skip(index)
                    .limit(20)
                    .exec();
                return data;
            } else {
                const data = await DatabaseOfClients
                    .find({
                        name: {
                            $regex: `^${property}`,
                            $options: 'i',
                        }
                    })
                    .sort({
                        name: 1,
                        date: -1,
                    })
                    .skip(index)
                    .limit(20)
                    .exec();
                return data;
            }
        } else {
            const data = await DatabaseOfClients
                .find({})
                .sort({
                    name: 1,
                    date: -1,
                })
                .skip(index)
                .limit(20)
                .exec();
            return data;
        }
    }
}
async function getLengthOfDatabase() {
    const data = await DatabaseOfClients
        .find({})
    return data.length
}
async function getLengthOfDatabaseFromProperty(property) {
    if (property !== '') {
        if (!isNaN(parseFloat(property[0]))) {
            const data = await DatabaseOfClients
                .find({
                    contact: {
                        $regex: `^${property}`,
                        $options: 'i',
                    }
                })
            return data.length
        } else {
            const data = await DatabaseOfClients
                .find({
                    name: {
                        $regex: `^${property}`,
                        $options: 'i',
                    }
                })
            return data.length
        }
    } else {
        const data = await DatabaseOfClients
            .find({
                name: {
                    $regex: `^${property}`,
                    $options: 'i',
                }
            })
        return data.length
    }
}

async function getDatabaseWhatContainsCharacters(characters) {
    const data = await DatabaseOfClients
        .find({
            contact: {
                $regex: `^${characters}`,
                $options: 'i',
            }
        })
        .exec();
    return data;
}
async function addClientToBlackList(name, contact) {
    await DatabaseOfClients
        .findOneAndUpdate({
            name: name,
            contact: contact
        }, {
            status: 'blacklist'
        })
}
async function removeClientFromDatabase(name, contact) {
    await DatabaseOfClients
        .findOneAndDelete({
            name: name,
            contact: contact,
        })
}
async function removeFromBlacklist(name, contact) {
    await DatabaseOfClients
        .findOneAndUpdate({
            name: name,
            contact: contact
        }, {
            status: 'none'
        })
}
async function editClientInformations(namefrom, contactfrom, nameto, contactto) {
    await DatabaseOfClients
        .findOneAndUpdate({
            name: namefrom,
            contact: contactfrom,
        }, {
            name: nameto,
            contact: contactto,
        })
}
async function transfer3LastFreeTerms(worker) {
    const tableOfHours = await transferTableOfHours('hours');
    const date = new Date();
    const workerName = worker;
    const monthatthestart = date.getMonth();
    let acctualmonth = date.getMonth();
    let acctualday = date.getDate();
    let acctualhour = date.getHours();
    let fullhour;
    let acctualminutes = date.getMinutes();
    if (acctualminutes < 15) {
        fullhour = `${acctualhour < 10 ? 0+acctualhour : acctualhour}:15`;
    } else if (acctualminutes >= 15 && acctualminutes < 30) {
        fullhour = `${acctualhour < 10 ? 0+acctualhour : acctualhour}:30`;
    } else if (acctualminutes >= 30 && acctualminutes < 45) {
        fullhour = `${acctualhour < 10 ? 0+acctualhour : acctualhour}:45`;
    } else if (acctualminutes >= 45 && acctualminutes < 60) {
        if (acctualhour === 23) {
            acctualhour = 0;
        } else {
            acctualhour++;
        }
        fullhour = `${acctualhour < 10 ? 0+acctualhour : acctualhour}:00`;
    }
    let indexohfullhour = tableOfHours.findIndex(e => e === fullhour);
    const firstday = await CurrentMonthModel
        .findOne({
            day: acctualday
        })
        .exec();
    const itemObjectfirst = firstday.toObject();
    const indexofworker = itemObjectfirst.workers.findIndex(e => e.worker[0].name === workerName);
    if (itemObjectfirst.workers[indexofworker].worker[1].hours.length > 0) {
        const indexoffirsthourfromfirstday = tableOfHours.findIndex(e => e === itemObjectfirst.workers[indexofworker].worker[1].hours[itemObjectfirst.workers[indexofworker].worker[1].hours.length - 1].from);
        if (indexoffirsthourfromfirstday < indexohfullhour) {
            indexohfullhour = 0;
            acctualday++;
        }
    }
    const freehours = [];
    let daystoadd = 3;
    while (daystoadd > 0) {
        if (monthatthestart === acctualmonth) {
            const day = await CurrentMonthModel
                .findOne({
                    day: acctualday
                })
                .exec();
            if (day === null) {
                acctualday = 1;
                acctualmonth++;
                continue;
            }
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
            for (const el of itemObject.workers[indexofworker].worker[1].hours) {
                const indexofhour = tableOfHours.findIndex(e => e === el.from);
                if (el.status === 'active' && indexofhour >= indexohfullhour && daystoadd > 0) {
                    freehours.push({
                        month: 'current',
                        day: acctualday,
                        from: el.from,
                    });
                    daystoadd--;
                }
            }
            if (indexohfullhour !== 0) {
                indexohfullhour = 0;
            }
            acctualday++;
        } else if (monthatthestart === acctualmonth - 1) {
            const day = await NextMonthModel
                .findOne({
                    day: acctualday
                })
                .exec();
            if (day === null) {
                acctualday = 1;
                acctualmonth++;
                continue;
            }
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
            for (const el of itemObject.workers[indexofworker].worker[1].hours) {
                const indexofhour = tableOfHours.findIndex(e => e === el.from);
                if (el.status === 'active' && indexofhour >= indexohfullhour && daystoadd > 0) {
                    freehours.push({
                        month: 'next',
                        day: acctualday,
                        from: el.from,
                    });
                    daystoadd--;
                }
            }
            if (indexohfullhour !== 0) {
                indexohfullhour = 0;
            }
            acctualday++;
        } else if (monthatthestart === acctualmonth - 2) {
            const day = await AfterNextMonthModel
                .findOne({
                    day: acctualday
                })
                .exec();
            if (day === null) {
                acctualday = 1;
                acctualmonth++;
                continue;
            }
            const itemObject = day.toObject();
            const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
            for (const el of itemObject.workers[indexofworker].worker[1].hours) {
                const indexofhour = tableOfHours.findIndex(e => e === el.from);
                if (el.status === 'active' && indexofhour >= indexohfullhour && daystoadd > 0) {
                    freehours.push({
                        month: 'after',
                        day: acctualday,
                        from: el.from,
                    });
                    daystoadd--;
                }
            }
            if (indexohfullhour !== 0) {
                indexohfullhour = 0;
            }
            acctualday++;
        } else {
            freehours.push('Brak wolnego terminu');
            daystoadd--;
        }
    }
    return freehours;
}
async function checkDaysOfMonth(MONTH) {
    const month = MONTH;
    let days;
    switch (month) {
        case 'before':
            days = await BeforePreviousMonthModel
                .find({})
                .exec();
            return days[days.length - 1].day;
            break;
        case 'previous':
            days = await PreviousMonthModel
                .find({})
                .exec();
            return days[days.length - 1].day;
            break;
        case 'current':
            days = await CurrentMonthModel
                .find({})
                .exec();
            return days[days.length - 1].day;
            break;
        case 'next':
            days = await NextMonthModel
                .find({})
                .exec();
            return days[days.length - 1].day;
            break;
        case 'after':
            days = await AfterNextMonthModel
                .find({})
                .exec();
            return days[days.length - 1].day;
            break;
    }
}

async function transferStatsForWorkerInPreviousMonth(WORKER) {
    const tableOfHours = await transferTableOfHours('hours');
    const worker = WORKER;
    const dayslengthofpreviousmonth = await checkDaysOfMonth('previous');
    let counterOfClients = 0;
    let counterOfHoursWithClients = 0;
    let counterOfHoursChanges = 0;
    for (let i = 1; i <= dayslengthofpreviousmonth; i++) {
        const day = await PreviousMonthModel
            .findOne({
                day: i
            })
            .exec();
        const itemObject = day.toObject();
        const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
        for (const el of itemObject.workers[indexofworker].worker[1].hours) {
            if (el.status === 'booked') {
                counterOfClients++;
                const startchangeofday = el.from;
                const endchangeofday = el.to;
                const indexofstartchangeofday = tableOfHours.findIndex(e => e === startchangeofday);
                const indexofendchangeofday = tableOfHours.findIndex(e => e === endchangeofday);
                counterOfHoursWithClients = counterOfHoursChanges + (indexofendchangeofday - indexofstartchangeofday);
            }
        }
        const startchangeofday = itemObject.workers[indexofworker].worker[2].change.from;
        const endchangeofday = itemObject.workers[indexofworker].worker[2].change.to;
        const indexofstartchangeofday = tableOfHours.findIndex(e => e === startchangeofday);
        const indexofendchangeofday = tableOfHours.findIndex(e => e === endchangeofday);
        if (indexofstartchangeofday !== -1 && indexofendchangeofday !== -1) {
            counterOfHoursChanges = counterOfHoursChanges + (indexofendchangeofday - indexofstartchangeofday);
        }
    }
    return {
        worker: worker,
        clients: counterOfClients,
        hourschanges: `${counterOfHoursChanges / 4}`,
        hourswithclients: `${counterOfHoursWithClients / 4}`,
        days: `1-${dayslengthofpreviousmonth}`,
        month: 'previous',
    }
}

async function transferStatsForWorkerInCurrentMonth(WORKER) {
    const tableOfHours = await transferTableOfHours('hours');
    const worker = WORKER;
    const date = new Date();
    const acctualday = date.getDate();
    let counterOfClients = 0;
    let counterOfHoursWithClients = 0;
    let counterOfHoursChanges = 0;
    for (let i = 1; i <= acctualday; i++) {
        const day = await CurrentMonthModel
            .findOne({
                day: i
            })
            .exec();
        const itemObject = day.toObject();
        const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
        for (const el of itemObject.workers[indexofworker].worker[1].hours) {
            if (el.status === 'booked') {
                counterOfClients++;
                const startchangeofday = el.from;
                const endchangeofday = el.to;
                const indexofstartchangeofday = tableOfHours.findIndex(e => e === startchangeofday);
                const indexofendchangeofday = tableOfHours.findIndex(e => e === endchangeofday);
                counterOfHoursWithClients = counterOfHoursChanges + (indexofendchangeofday - indexofstartchangeofday);
            }
        }
        const startchangeofday = itemObject.workers[indexofworker].worker[2].change.from;
        const endchangeofday = itemObject.workers[indexofworker].worker[2].change.to;
        const indexofstartchangeofday = tableOfHours.findIndex(e => e === startchangeofday);
        const indexofendchangeofday = tableOfHours.findIndex(e => e === endchangeofday);
        if (indexofstartchangeofday !== -1 && indexofendchangeofday !== -1) {
            counterOfHoursChanges = counterOfHoursChanges + (indexofendchangeofday - indexofstartchangeofday);
        }
    }
    return {
        worker: worker,
        clients: counterOfClients,
        hourschanges: `${counterOfHoursChanges / 4}`,
        hourswithclients: `${counterOfHoursWithClients / 4}`,
        days: `1-${acctualday}`,
        month: 'current',
    }
}
async function SetFreeDay(DAY, MONTH, WORKER) {
    const month = MONTH;
    const dayindex = DAY;
    const worker = WORKER;
    let day;
    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
    }
    const itemObject = day.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
    itemObject.workers[indexofworker].worker[1].hours = [];
    itemObject.workers[indexofworker].worker[2].change = {
        from: 'freeday',
        to: 'freeday',
    }
    if (month === 'previous') {
        await PreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "before") {
        await BeforePreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === 'current') {
        await CurrentMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "next") {
        await NextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "after") {
        await AfterNextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    }
}
async function unSetFreeDay(DAY, MONTH, WORKER) {
    const month = MONTH;
    const dayindex = DAY;
    const worker = WORKER;
    let day;
    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOne({
                    day: dayindex,
                })
            break;
    }
    const itemObject = day.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === worker);
    itemObject.workers[indexofworker].worker[1].hours = [];
    itemObject.workers[indexofworker].worker[2].change = {
        from: '',
        to: '',
    }
    if (month === 'previous') {
        await PreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "before") {
        await BeforePreviousMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === 'current') {
        await CurrentMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "next") {
        await NextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    } else if (month === "after") {
        await AfterNextMonthModel
            .findOneAndUpdate({
                day: dayindex,
            }, {
                workers: itemObject.workers,
            })
    }
}
async function transferTableOfHours(table) {
    switch (table) {
        case 'hours':
            return ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45', '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45'];
            break;
        case 'change':
            return [{
                    from: '06:00',
                    to: '06:15',
                }, {
                    from: '06:15',
                    to: '06:30',
                },
                {
                    from: '06:30',
                    to: '06:45',
                },
                {
                    from: '06:45',
                    to: '07:00',
                },
                {
                    from: '07:00',
                    to: '07:15',
                }, {
                    from: '07:15',
                    to: '07:30',
                },
                {
                    from: '07:30',
                    to: '07:45',
                },
                {
                    from: '07:45',
                    to: '08:00',
                }, {
                    from: '08:00',
                    to: '08:15',
                }, {
                    from: '08:15',
                    to: '08:30',
                },
                {
                    from: '08:30',
                    to: '08:45',
                },
                {
                    from: '08:45',
                    to: '09:00',
                }, {
                    from: '09:00',
                    to: '09:15',
                }, {
                    from: '09:15',
                    to: '09:30',
                },
                {
                    from: '09:30',
                    to: '09:45',
                },
                {
                    from: '09:45',
                    to: '10:00',
                }, {
                    from: '10:00',
                    to: '10:15',
                }, {
                    from: '10:15',
                    to: '10:30',
                },
                {
                    from: '10:30',
                    to: '10:45',
                },
                {
                    from: '10:45',
                    to: '11:00',
                }, {
                    from: '11:00',
                    to: '11:15',
                }, {
                    from: '11:15',
                    to: '11:30',
                },
                {
                    from: '11:30',
                    to: '11:45',
                },
                {
                    from: '11:45',
                    to: '12:00',
                }, {
                    from: '12:00',
                    to: '12:15',
                }, {
                    from: '12:15',
                    to: '12:30',
                },
                {
                    from: '12:30',
                    to: '12:45',
                },
                {
                    from: '12:45',
                    to: '13:00',
                }, {
                    from: '13:00',
                    to: '13:15',
                }, {
                    from: '13:15',
                    to: '13:30',
                },
                {
                    from: '13:30',
                    to: '13:45',
                },
                {
                    from: '13:45',
                    to: '14:00',
                }, {
                    from: '14:00',
                    to: '14:15',
                }, {
                    from: '14:15',
                    to: '14:30',
                },
                {
                    from: '14:30',
                    to: '14:45',
                },
                {
                    from: '14:45',
                    to: '15:00',
                }, {
                    from: '15:00',
                    to: '15:15',
                }, {
                    from: '15:15',
                    to: '15:30',
                },
                {
                    from: '15:30',
                    to: '15:45',
                },
                {
                    from: '15:45',
                    to: '16:00',
                }, {
                    from: '16:00',
                    to: '16:15',
                }, {
                    from: '16:15',
                    to: '16:30',
                },
                {
                    from: '16:30',
                    to: '16:45',
                },
                {
                    from: '16:45',
                    to: '17:00',
                }, {
                    from: '17:00',
                    to: '17:15',
                }, {
                    from: '17:15',
                    to: '17:30',
                },
                {
                    from: '17:30',
                    to: '17:45',
                },
                {
                    from: '17:45',
                    to: '18:00',
                },
            ]
            break;
    }
}
async function removeBreak(month, day, worker, fromStart, toStart) {
    const tableOfHours = await transferTableOfHours('change');
    let dayData;
    const dayChecked = day;
    const workerName = worker;
    const fromHourStart = fromStart;
    const toHourStart = toStart;
    switch (month) {
        case 'before':
            dayData = await BeforePreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
                .exec();
            break;
        case 'previous':
            dayData = await PreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'current':
            dayData = await CurrentMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'next':
            dayData = await NextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'after':
            dayData = await AfterNextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
    }
    const itemObject = dayData.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
    const indexofcheckedhourwvisit = itemObject.workers[indexofworker].worker[1].hours.findIndex(e =>
        e.from === fromHourStart && e.to === toHourStart
    )
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].client[0].name = ""
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].client[0].contact = ""
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].status = 'active';

    const indexOfTableCheckedHourFrom = tableOfHours.findIndex(e => e.from === itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from);
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from = tableOfHours[indexOfTableCheckedHourFrom].from;
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to = tableOfHours[indexOfTableCheckedHourFrom].to;

    const indexOfTableCheckedHourTo = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to);
    for (let i = indexofcheckedhourwvisit + 1; i <= indexofcheckedhourwvisit + 11; i++) {
        if (itemObject.workers[indexofworker].worker[1].hours[i] !== undefined) {
            const indexOfTableCheckedHourToNextVisit = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[i].from);
            if (indexOfTableCheckedHourToNextVisit < indexOfTableCheckedHourTo) {
                itemObject.workers[indexofworker].worker[1].hours[i].status = 'deactivefrombreak';
            } else if (indexOfTableCheckedHourToNextVisit >= indexOfTableCheckedHourTo) {
                if (itemObject.workers[indexofworker].worker[1].hours[i].status === 'deactivefrombreak') {
                    itemObject.workers[indexofworker].worker[1].hours[i].status = 'active';
                } else break;
            }
        }
    }
    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
    }
}
async function addBreak(month, day, worker, fromStart, toStart, fromEnd, toEnd) {
    const tableOfHours = await transferTableOfHours('hours');
    let dayData;
    const dayChecked = day;
    const workerName = worker;
    const fromHourStart = fromStart;
    const toHourStart = toStart;
    const fromHourEnd = fromEnd;
    const toHourEnd = toEnd;

    switch (month) {
        case 'before':
            dayData = await BeforePreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
                .exec();
            break;
        case 'previous':
            dayData = await PreviousMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'current':
            dayData = await CurrentMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'next':
            dayData = await NextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
        case 'after':
            dayData = await AfterNextMonthModel
                .findOne({
                    day: dayChecked,
                })
            break;
    }
    const itemObject = dayData.toObject();
    const indexofworker = itemObject.workers.findIndex(e => e.worker[0].name === workerName);
    const indexofcheckedhourwvisit = itemObject.workers[indexofworker].worker[1].hours.findIndex(e =>
        e.from === fromHourStart && e.to === toHourStart
    )

    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].from = fromHourEnd;
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to = toHourEnd;
    itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].status = 'break';

    const indexOfTableCheckedHourTo = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[indexofcheckedhourwvisit].to);
    for (let i = indexofcheckedhourwvisit + 1; i <= indexofcheckedhourwvisit + 11; i++) {
        if (itemObject.workers[indexofworker].worker[1].hours[i] !== undefined) {
            const indexOfTableCheckedHourToNextVisit = tableOfHours.findIndex(e => e === itemObject.workers[indexofworker].worker[1].hours[i].from);
            if (indexOfTableCheckedHourToNextVisit < indexOfTableCheckedHourTo) {
                itemObject.workers[indexofworker].worker[1].hours[i].status = 'deactivefrombreak';
            } else if (indexOfTableCheckedHourToNextVisit >= indexOfTableCheckedHourTo) {
                if (itemObject.workers[indexofworker].worker[1].hours[i].status === 'deactivefrombreak') {
                    itemObject.workers[indexofworker].worker[1].hours[i].status = 'active';
                } else break;
            }
        }
    }

    switch (month) {
        case 'before':
            day = await BeforePreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'previous':
            day = await PreviousMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'current':
            day = await CurrentMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'next':
            day = await NextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
        case 'after':
            day = await AfterNextMonthModel
                .findOneAndUpdate({
                    day: dayChecked,
                }, {
                    workers: itemObject.workers,
                })
            break;
    }
}

setInterval(() => {
    checkCurrentDayAndMonth();
}, 5000)

export {
    transferAllMonths,
    addWorker,
    removeWorker,
    getWorkers,
    setChangeToWorkerInWeek,
    removeChangeToWorkerInWeek,
    setChangeToWorkerInMonth,
    removeChangeToWorkerInMonth,
    setChangeToWorkerInDay,
    removeChangeToWorkerInDay,
    transferDay,
    addClient,
    removeClient,
    getDatabaseWhatContainsCharacters,
    getFirst20ClientsOfDatabase,
    addClientToBlackList,
    removeClientFromDatabase,
    removeFromBlacklist,
    editClientInformations,
    addClientToDataBase,
    getLengthOfDatabase,
    getFirst20ClientsOfDatabaseFromProperty,
    getLengthOfDatabaseFromProperty,
    transfer3LastFreeTerms,
    checkDaysOfMonth,
    transferStatsForWorkerInPreviousMonth,
    transferStatsForWorkerInCurrentMonth,
    SetFreeDay,
    removeBreak,
    addBreak,
    unSetFreeDay,
    get20ClientsOfDatabaseFromProperty,
}