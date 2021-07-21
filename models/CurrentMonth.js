import mongoose from 'mongoose';

const {
    Schema
} = mongoose;

const currentSchema = new Schema({
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

const CurrentMonthModel = mongoose.model('MonthCurrent', currentSchema, 'CurrentMonth');

export default CurrentMonthModel;