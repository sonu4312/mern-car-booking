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
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const cars_1 = __importDefault(require("../models/cars"));
const auth_1 = __importDefault(require("../middleware/auth"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
//upload will use to store the only 6 image and of size 5MB
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, //5MB
    },
});
// Get current date/time in UTC
const utcDate = new Date();
// Define Indian Standard Time (IST) offset in milliseconds (5 hours and 30 minutes ahead of UTC)
const istOffset = 5.5 * 60 * 60 * 1000;
// Adjust UTC date/time to IST
const indianDate = new Date(utcDate.getTime() + istOffset);
//api/my-cars
router.post("/", auth_1.default, [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("city").notEmpty().withMessage("City is required"),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Country is required"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Car type is required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Descripton is required"),
    (0, express_validator_1.body)("pricePerDay")
        .notEmpty()
        .isNumeric()
        .withMessage("Price per day is required and must be a number"),
    (0, express_validator_1.body)("facilities")
        .notEmpty()
        .isArray()
        .withMessage("Facilities are requiFred"),
], upload.array("imageFiles", 6), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFiles = req.files;
        const newCar = req.body;
        // 1. Upload the images to cloudinary
        const imageUrls = yield uploadImages(imageFiles);
        newCar.imageUrls = imageUrls;
        // Store indianDate as the lastUpdated field
        newCar.lastUpdated = indianDate;
        // newCar.lastUpdated = new Date();
        newCar.userId = req.userId;
        // 3. save the new car in our database.
        const car = new cars_1.default(newCar);
        yield car.save();
        //4. return a 201 status.
        res.status(201).send(car);
    }
    catch (e) {
        console.log("Error creating car", e);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cars = yield cars_1.default.find({ userId: req.userId });
        res.json(cars);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cars" });
    }
}));
router.get("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id.toString();
    try {
        const car = yield cars_1.default.findOne({
            _id: id,
            userId: req.userId,
        });
        res.json(car);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cars" });
    }
}));
router.put("/:carId", auth_1.default, upload.array("imageFiles"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedCar = req.body;
        updatedCar.lastUpdated = indianDate;
        const car = yield cars_1.default.findOneAndUpdate({
            _id: req.params.carId,
            userId: req.userId,
        }, updatedCar, {
            new: true,
        });
        if (!car) {
            return res.status(404).json({ message: "Car not found!!" });
        }
        const files = req.files;
        const updatedImageUrls = yield uploadImages(files);
        car.imageUrls = [...updatedImageUrls, ...(updatedCar.imageUrls || [])];
        yield car.save();
        res.status(201).json(car);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
function uploadImages(imageFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadPromises = imageFiles.map((image) => __awaiter(this, void 0, void 0, function* () {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            return res.url;
        }));
        const imageUrls = yield Promise.all(uploadPromises);
        return imageUrls;
    });
}
exports.default = router;
