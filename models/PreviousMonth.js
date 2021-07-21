import mongoose from 'mongoose';

const {
    Schema
} = mongoose;

const prevSchema = new Schema({
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

const PreviousMonthModel = mongoose.model('MonthPrev', prevSchema, 'PreviousMonth');

export default PreviousMonthModel