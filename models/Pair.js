const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PairSchema = new Schema({
    from: {
        type: String,
        enum: ['GBP', 'USD', 'JPY', 'AUD', 'IDR'],
        required: true
    },
    to: {
        type: String,
        enum: ['GBP', 'USD', 'JPY', 'AUD', 'IDR'],
        required: true
    },
    rates: [{
        type: Schema.Types.ObjectId,
        ref: 'Rate'
    }]
}, { collection: 'pairCollection' });



PairSchema.index({ "from": 1, "to": 1 }, { "unique": true });
const Pair = mongoose.model('Pair', PairSchema);
module.exports = Pair;