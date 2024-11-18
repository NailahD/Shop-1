import { ObjectId } from "mongodb";

export interface Product {
    id?: ObjectId;
    displayName: string;
    photoURL?: string;
    darkTheme: boolean;
};