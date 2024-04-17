import mongoose from "mongoose";

export type CarType = {
    _id:string;
    userId:string;
    name:string;
    city:string;
    country:string;
    description:string;
    type:  string;
    // adultCount :number;
    // childCount:number;
    //instead of adult and child count we only need passanger count.
    passengerCount:number;
    facilities : string[];
    pricePerDay: number;
    starRating: number;
    lastUpdated: Date;
    imageUrls:string[];
}

const carSchema = new mongoose.Schema<CarType>({
    userId:{type: String, required:true},
    name:{type: String, required:true},
    city:{type: String, required:true},
    country:{type: String, required:true},
    description:{type: String, required:true},
    type:{type: String, required:true},
    passengerCount:{type: Number, required:true},
    facilities:[{type:String,required:true}],
    pricePerDay: {type:Number, required:true},
    starRating:{type: Number, required:true, min:1,max:5},
    imageUrls:[{type: String, required:true}],
    lastUpdated:{type:Date,required:true},
});

const Car = mongoose.model<CarType>("Car",carSchema)
export default Car;