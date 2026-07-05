import { MongoClient } from "mongodb";

async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;

        const client = MongoClient.connect(process.env.MONGODB_URI);

        const db = (await client).db();

        const meetupsCollection = db.collection('meetups');

        const result = await meetupsCollection.insertOne(data);

        console.log(result);

        (await client).close();

        res.status(201).json({ message: 'Meetup inserted!' });
    }
}

export default handler;