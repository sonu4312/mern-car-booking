"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cars_1 = __importDefault(require("../models/cars"));
const express_validator_1 = require("express-validator");
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = __importDefault(require("../middleware/auth"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
const router = express_1.default.Router();
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = constructSearchQuery(req.query);
        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerDayAsc":
                sortOptions = { pricePerDay: 1 };
                break;
            case "pricePerDayDsc":
                sortOptions = { pricePerDay: -1 };
                break;
        }
        //pagination is defined so the if many users hit the search it will not need to load all the cars , which can fine more charges to the deployment servers many time. so i decide to send only 5 pages
        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        //pagenumber = 3
        const skip = (pageNumber - 1) * pageSize;
        const cars = yield cars_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);
        const total = yield cars_1.default.countDocuments(query);
        const response = {
            data: cars,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.json(response);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield cars_1.default.find().sort("-lastUpdated");
        res.json(cars);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error fetching cars" });
    }
}));
router.get("/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("Car ID is required")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
        const car = yield cars_1.default.findById(id);
        res.json(car);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching car" });
    }
}));
router.post("/:carId/bookings/payment-intent", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //my-todos:
    // 1.totalcost
    // 2 carid
    // 3 userID
    const { numberOfDays } = req.body;
    const carId = req.params.carId;
    const car = yield cars_1.default.findById(carId);
    if (!car) {
        return res.status(400).json({ message: "Car not found" });
    }
    const totalCost = car.pricePerDay * numberOfDays;
    //debit no for inr - 4000003560000008
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "inr",
        metadata: {
            carId,
            userId: req.userId,
        },
    });
    if (!paymentIntent.client_secret) {
        return res.status(500).json({ message: "Error creating payment intent" });
    }
    const response = {
        // changes made
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };
    res.send(response);
}));
router.post("/:carId/bookings", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntentId = req.body.paymentIntentId;
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (!paymentIntent) {
            return res.status(400).json({ message: "payment intent not found" });
        }
        if (paymentIntent.metadata.carId !== req.params.carId ||
            paymentIntent.metadata.userId !== req.userId) {
            return res.status(400).json({ message: "payment intent mismatch" });
        }
        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
            });
        }
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        const car = yield cars_1.default.findOneAndUpdate({ _id: req.params.carId }, {
            $push: { bookings: newBooking },
        });
        if (!car) {
            return res.status(400).json({ message: "Car not found" });
        }
        yield car.save();
        res.status(200).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }
    if (queryParams.passengerCount) {
        constructedQuery.passengerCount = {
            $gte: parseInt(queryParams.passengerCount),
        };
    }
    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }
    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }
    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star) => parseInt(star))
            : parseInt(queryParams.stars);
        constructedQuery.starRating = { $in: starRatings };
    }
    if (queryParams.maxPrice) {
        constructedQuery.pricePerDay = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    return constructedQuery;
};
exports.default = router;
