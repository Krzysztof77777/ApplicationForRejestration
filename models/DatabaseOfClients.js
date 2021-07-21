import mongoose from 'mongoose';

const {
    Schema
} = mongoose;

const clientSchema = new Schema({
    name: {
        type: String,
        text: true,
    },
    contact: {
        type: String,
        text: true,
    },
    status: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "none",
    }
}, {
    strict: false
});

const DatabaseOfClients = mongoose.model('databaseClient', clientSchema, 'databaseOfClients');

export default DatabaseOfClients;