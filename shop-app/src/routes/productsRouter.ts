import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { Product } from '../models/product-model';
import dotenv from 'dotenv';

dotenv.config();
const productsRouter = Router();
const client = new MongoClient(process.env.MONGODB_URI!);

//GET /products


productsRouter.get('/products', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<Product>('products');

        const query: any = {};
        

        if (req.query['max-price']) {
            query.price = { $lte: parseInt(req.query['max-price'] as string, 10)}
        }

        if (req.query.includes) {
            query.name = { $regex: new RegExp(req.query.includes as string, 'i')  };
        }

        if (req.query.limit) {
            const limit: number | null = parseInt(req.query.limit as string);
        }

            const products = await collection.find({}).toArray();
            res.json(products);
            

    } catch (error) {
        console.log(error);

    } finally {
        await client.close();
    }
});


//GET /products/:id

productsRouter.get('/products/:id', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<Product>('products');

        const id = new ObjectId(req.params.id);
         const result = await collection.find({id}).toArray();
         res.json(result);

    } catch {
        res.status(404).json({message: "Product not found"});

    } finally {
        await client.close();
    }
});

//POST /products

productsRouter.post('/products', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<Product>('product');
        const result = await collection.insertOne(req.body);
        res.json(result).status(201);

    } catch {

    } finally {
        await client.close();
    }
});


//PUT /products/:id

productsRouter.put('products/:id', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<Product>('products');
        const updatedProperties = req.body;
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedProperties }
            
        );

        if (result.matchedCount === 0) {
            res.status(404).json({message: 'Product not found'})
        };

        res.json(result).status(200)

    } catch (error) {
        console.log(error);

    } finally {
        await client.close();
    }
});


//DELETE /products/:id

productsRouter.delete('products/:id', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<Product>('products');
        const result = await collection.deleteOne(
            { _id : new ObjectId(req.params.id)}
        
        );

        if (result.deletedCount === 0) {
            res.status(404).json({message: 'Product not found'})
        };
        
        res.status(204);

    } catch (error) {
        console.log(error);

    } finally {
        await client.close();
    }
});

export default productsRouter;

