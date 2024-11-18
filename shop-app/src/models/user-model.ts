import { ObjectId } from "mongodb";

export interface User {
    _id?: ObjectId;
    name: string;
    price: number;
    photoURL?: string;
};