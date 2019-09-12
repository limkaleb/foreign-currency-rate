const Rate = require('../models/Rate');
const Pair = require('../models/Pair');
const moment = require('moment');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../helpers/response');

exports.inputData = async function (req, res, next) {
    try {
        let checkPair = await Pair.findOne({ from: req.body.from, to: req.body.to });
        let checkDate = await Rate.findOne({ date: new Date(req.body.date), pair: checkPair._id })
        if (checkPair && !checkDate) {
            let rates = await Rate.create({
                date: req.body.date,
                rate: req.body.rate,
                pair: checkPair._id
            });
            checkPair.rates.push(rates);
            let result = await checkPair.save();
            res.status(201).json(successResponse("Post item to database success", result));
        } else {
            res.status(404).json(errorResponse("Currency pair is not found or date already has rate"));
        }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when creating an item", err));
    }
}

exports.getData = async function (req, res, next) {
    try {
        let pair = await Pair
            .findOne({ from: req.body.from, to: req.body.to })
            .select(['from', 'to', 'rates'])
            .populate({
                path: 'rates',
                select: ['date', 'rate']
            });
        res.status(200).json(successResponse("Get all rates is success", pair));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data", err));
    }
}

exports.getAverage = async function (req, res, next) {
    try {
        let inputDate = req.body.date;
        const average = await Rate.aggregate([
            {
                $match: { date: { $lte: new Date(inputDate), $gt: new Date(moment(inputDate).add(-4, 'days')) } }
            },
            {
                $group: {
                    _id: "$pair",
                    count: { $sum: 1 },
                    rate: { $avg: "$rate" },
                    maxRate: { $max: "$rate" },
                    minRate: { $min: "$rate" }
                }
            },
            {
                $addFields: {
                    variance: { $subtract: ["$maxRate", "$minRate"] }
                }
            }
        ])
        res.status(200).json(successResponse('success', average));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data", err));
    }
}

exports.changeRate = async function (req, res, next) {
    try {
        const id = req.params.rateId;
        let newRate = await Rate.findByIdAndUpdate({ _id: id },
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(successResponse("Update an item is success", newRate));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when updating rate", err));
    }
}

exports.deleteAll = async function (req, res, next) {
    let rates = await Rate.deleteMany({});
    let pairs = await Pair.deleteMany({});
    res.status(200).json(successResponse("Delete all rates is success", rates));
}