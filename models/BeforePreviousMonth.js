import mongoose from 'mongoose';
const {
    Schema
} = mongoose;

const beforeSchema = new Schema({
    day: {
        type: Number,
    },
    status: {
        type: String,
    },
    dayOfTheWeek: {
        type: String,
    },
    currentDay: {
        type: Boolean,
    },
}, {
    strict: false
});

const BeforePreviousMonthModel = mongoose.model('MonthBeforePrevious', beforeSchema, 'BeforePreviousMonth');

export default BeforePreviousMonthModel;