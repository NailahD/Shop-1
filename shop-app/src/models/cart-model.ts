import { ObjectId } from "mongodb";
import { Product } from "./product-model";
import { User } from "./user-model";

export interface CartItem {
    _id?: ObjectId;
    userId: ObjectId;
    product: Product;
    quantity: number;
};