import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import {User}  from '../models/user-model';
import dotenv from 'dotenv';

dotenv.config();
const userRouter = Router();
const client = new MongoClient(process.env.MONGODB_URI!);


//GET /users/:id

userRouter.get('/users/:id', async (req, res) => {
    try {
        await client.connect();
        const collection = client.db().collection<User>('users');
        const result = await collection.find({ _id: new ObjectId(req.params.id)}).toArray();

        res.json(result).status(200);

    } catch {
        res.status(404).json({message: 'User not found'});

    } finally {
        await client.close();
    }
});



//POST /users

userRouter.post('/users', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<User>('users');
        const newUser: User = req.body;
        const result = await collection.insertOne(newUser);
        res.status(201).json(result);

    } catch {

    } finally {
        await client.close();
    }
});


//PUT /users/:id

userRouter.put('/users/:id', async (req, res)=>{
    try {
        await client.connect();
        const collection = client.db().collection<User>('users');
        const updateInfo = req.body;

        
        const result = await collection.updateOne(
            {_id: new ObjectId(req.params.id)},
            {$set: updateInfo}
        );

        if (result.matchedCount === 0) {
            res.status(404).json({message: 'User not found'})
        }

        res.status(200).json(result);

    } catch {

    } finally {
        await client.close();
    }
});


//DELETE /users/:id


userRouter.delete('/users/:id', async (req, res)=> {
    try {
        await client.connect();
        const collection = client.db().collection<User>('users');
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id)});
        res.status(204);

        if (result.deletedCount === 0) {
            res.status(404).json({message: 'User not found'})
        }

    } catch {

    } finally {
        await client.close();
    }
});

export default userRouter;