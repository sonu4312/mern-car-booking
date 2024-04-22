import express, { Request, Response } from "express";
import Car from "../models/cars";
import { BookingType, CarSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
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
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    //pagenumber = 3
    const skip = (pageNumber - 1) * pageSize;
    const cars = await Car.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Car.countDocuments(query);

    const response: CarSearchResponse = {
      data: cars,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const cars = await Car.find().sort("-lastUpdated");
    res.json(cars);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching cars" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Car ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const car = await Car.findById(id);
      res.json(car);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching car" });
    }
  }
);

router.post(
  "/:carId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    //my-todos:
    // 1.totalcost
    // 2 carid
    // 3 userID

    const { numberOfDays } = req.body;
    const carId = req.params.carId;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(400).json({ message: "Car not found" });
    }

    const totalCost = car.pricePerDay * numberOfDays;

    //debit no for inr - 4000003560000008
    const paymentIntent = await stripe.paymentIntents.create({
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
  }
);

router.post(
  "/:carId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );
      if (!paymentIntent) {
        return res.status(400).json({ message: "payment intent not found" });
      }

      if (
        paymentIntent.metadata.carId !== req.params.carId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const car = await Car.findOneAndUpdate(
        { _id: req.params.carId },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!car) {
        return res.status(400).json({ message: "Car not found" });
      }

      await car.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};
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
      ? queryParams.stars.map((star: string) => parseInt(star))
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
export default router;
