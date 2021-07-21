import mongoose from 'mongoose';

const {
    Schema
} = mongoose;

const afterSchema = new Schema({
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

const AfterNextMonthModel = mongoose.model('MonthAfterNext', afterSchema, 'AfterNextMonth');

export default AfterNextMonthModel;