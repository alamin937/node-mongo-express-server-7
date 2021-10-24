const express = require('express')
const cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000

// midleware
app.use(cors())
app.use(express.json())

app.get('/', (req,res) =>{
    res.send('Hello World')
})



var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.bzphb.mongodb.net:27017,cluster0-shard-00-01.bzphb.mongodb.net:27017,cluster0-shard-00-02.bzphb.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-rs3vfq-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("Services");
      const serviceCollection = database.collection("User Info");
    //   get api
    app.get('/services', async(req,res) =>{
        const cursor = serviceCollection.find({})
        const result = await cursor.toArray();
        res.send(result);
    })
    // show specific item
    app.get('/services/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        console.log(result)
        res.json(result);
    })

    // post api
    app.post('/services', async(req,res) =>{
        const  services = req.body;
        const result = await serviceCollection.insertOne(services)
        console.log('hitting api', result)
        console.log('hitted', req.body)
        res.json(result);
        })

        // delete
        app.delete('/services/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = serviceCollection.deleteOne(query)
            res.json(result)
        })






    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.listen(port, () =>{
    console.log('server successfully running port', port)
})