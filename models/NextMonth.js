import mongoose from 'mongoose';

const {
    Schema
} = mongoose;

const nextSchema = new Schema({
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
    }
}, {
    strict: false
});

const NextMonthModel = mongoose.model('MonthNext', nextSchema, 'NextMonth');

export default NextMonthModel;