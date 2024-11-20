import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import {User}  from '../models/user-model';
import { Product } from '../models/product-model';
import { CartItem } from '../models/cart-model';
import dotenv from 'dotenv';

dotenv.config();
const cartRouter = Router();
const client = new MongoClient(process.env.MONGODB_URI!);


//GET /users/:userId/cart

cartRouter.get('/users/:userId/cart', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<CartItem>('user-cart');
        const userId = new ObjectId(req.params.userId);
        const cart = req.body.userId;
        const result = await collection.find({cart}).toArray();

        res.status(200).json(result);
       
    } catch (error) {
        console.log(error);

    } finally {
        await client.close();
    } 
});


//POST /users/:userId/cart


cartRouter.post('/users/:userId/cart', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<CartItem>('user-cart');

        const query: any = {};

        const userId = new ObjectId(req.params.userId);
        const cart = req.body.userId;

        if (req.query.product) {
            query.product = req.query.product;
        }

        const result = await collection.find(query).toArray();

        if (!result) {
            const newItem : CartItem = query.product;
            await collection.insertOne(newItem);
            res.status(201);

        } else {await collection.updateOne(
            {result},
            {$inc: {quantity: 1}}
        )
        res.status(200)
    };

        res.json(result);

    } catch (error) {
        console.log(error);

    } finally {
        await client.close();
    }
});


//PATCH /users/:userId/cart/:productId

cartRouter.patch('/users/:userId/cart/:productId', async (req, res)=>{
    try {
        await client.connect();
        const collection = client.db().collection<CartItem>('products');
        const cart = req.body.userId;
        const itemToUpdate = req.body.productId;
        const newQuantity = req.body

        const result = await collection.updateOne(
            {cart, itemToUpdate}, 
            {$inc: {newQuantity}}
        );

        if (result.modifiedCount === 0) {
            res.status(404).json({message: 'Not found'})
        };

        res.status(200).json(result);

    } catch (error) {
        console.log(error);

    } finally {
        await client.close();
    }
});


cartRouter.delete('/users/:userId/cart/:productId', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<CartItem>('product');

        const _id = new ObjectId(req.params.productId);

        const result = await collection.deleteOne({_id});

        if (result.deletedCount === 0) {
            res.status(404).json({message: 'Not found'});
        }

        res.status(204);

    } catch (error) {
        console.log(error);

    } finally {
        await client.close();

    }
});