const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RateSchema = new Schema({
    date: {
        type: Date
    },
    rate: {
        type: Number,
        required: true
    },
    pair: {
        type: Schema.Types.ObjectId,
        ref: 'Pair'
    }
}, { collection: 'rateCollection' });


const Rate = mongoose.model('Rate', RateSchema);
module.exports = Rate;