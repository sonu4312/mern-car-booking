import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Car from "../models/cars";
import { CarType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();

//upload will use to store the only 6 image and of size 5MB
const upload = multer({
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

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("type").notEmpty().withMessage("Car type is required"),
    body("description").notEmpty().withMessage("Descripton is required"),
    body("pricePerDay")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per day is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are requiFred"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];

      const newCar: CarType = req.body;

      // 1. Upload the images to cloudinary
      const imageUrls = await uploadImages(imageFiles);

      newCar.imageUrls = imageUrls;

      // Store indianDate as the lastUpdated field
      newCar.lastUpdated = indianDate;
      // newCar.lastUpdated = new Date();
      newCar.userId = req.userId;

      // 3. save the new car in our database.
      const car = new Car(newCar);
      await car.save();

      //4. return a 201 status.
      res.status(201).send(car);
    } catch (e) {
      console.log("Error creating car", e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const cars = await Car.find({ userId: req.userId });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const car = await Car.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
});

router.put(
  "/:carId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedCar: CarType = req.body;
      updatedCar.lastUpdated = indianDate;
      const car = await Car.findOneAndUpdate(
        {
          _id: req.params.carId,
          userId: req.userId,
        },
        updatedCar,
        {
          new: true,
        }
      );

      if (!car) {
        return res.status(404).json({ message: "Car not found!!" });
      }
      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      car.imageUrls = [...updatedImageUrls, ...(updatedCar.imageUrls || [])];

      await car.save();
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");

    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);

    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export default router;
