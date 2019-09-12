const Pair = require('../models/Pair');
const moment = require('moment');
const { successResponse, errorResponse } = require('../helpers/response');

exports.inputPair = async function (req, res, next) {
    try {
        let pairs = await Pair.create({
            from: req.body.from,
            to: req.body.to
        })
        res.status(201).json(successResponse("Create new pair success", pairs));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when creating new pair", err));
    }
}

exports.getPairs = async function (req, res, next) {
    let pairs = await Pair.find()
    res.status(200).json(successResponse("Get all pairs is success", pairs));
}

exports.deletePairs = async function (req, res, next) {
    let pairs = await Pair.deleteMany({});
    let rates = await Rate.deleteMany({});
    res.status(200).json(successResponse("Delete all pairs is success", pairs));
}

exports.deletePair = async function (req, res, next) {
    try {
        let check = await Pair.findOne({ _id: req.params.pairId });
        if (!check) {
            return res.status(404).json(errorResponse('Pair not found'));
        }
        let pair = await Pair.deleteOne({ _id: req.params.pairId });
        res.status(200).json(successResponse("Delete a pair is success", pair));
    } catch {
        res.status(422).json(errorResponse("Something is error when deleting a pair", err));
    }

}