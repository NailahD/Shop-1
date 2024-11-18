import { ObjectId } from "mongodb";

export interface User {
    id?: ObjectId;
    displayName: string;
    photoURL?: string;
    darkTheme: boolean;
};