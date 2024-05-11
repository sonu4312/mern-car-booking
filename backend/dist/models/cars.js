"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    passengerCount: { type: Number, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    userId: { type: String, required: true },
    totalCost: { type: Number, required: true },
});
const carSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    passengerCount: { type: Number, required: true },
    facilities: [{ type: String, required: true }],
    pricePerDay: { type: Number, required: true },
    starRating: { type: Number, required: true, min: 1, max: 5 },
    imageUrls: [{ type: String, required: true }],
    lastUpdated: { type: Date, required: true },
    bookings: [bookingSchema],
});
const Car = mongoose_1.default.model("Car", carSchema);
exports.default = Car;
