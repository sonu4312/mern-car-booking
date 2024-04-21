import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Car from "../models/cars";
import { CarType } from "../shared/types";

const router = express.Router();

//api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const cars = await Car.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = cars.map((car) => {
      const userBookings = car.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const carWithUserBookings: CarType = {
        ...car.toObject(),
        bookings: userBookings,
      };

      return carWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;
