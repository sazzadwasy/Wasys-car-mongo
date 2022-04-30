const express = require("express")
const cors = require("cors")
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, MongoRuntimeError, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqqkb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const serviceCollection = client.db('wasysCar').collection('service')
        const orderCollection = client.db('wasysCar').collection('order')

        //auth
        // app.get('/login', async (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '1d'
        //     });
        //     res.send({ accessToken })
        // })

        app.get('/order', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })
        //port user
        app.post('/service', async (req, res) => {
            const newService = req.body
            console.log(newService)
            const result = await serviceCollection.insertOne(newService)
            console.log(result)
            res.send(result)
        })
        //read post
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)

            //find one
            app.get('/service/:id', async (req, res) => {
                const id = req.params.id
                const query = { _id: ObjectId(id) }
                const service = await serviceCollection.findOne(query)
                res.send(service)
            })
            //delete post
            app.delete('/service/:id', async (req, res) => {
                const id = req.params.id
                const query = { _id: ObjectId(id) }
                const result = await serviceCollection.deleteOne(query)
                console.log(id)
                res.send(result)
            })
            // order collection api

            // app.get('/order', async (req, res) => {
            //     const email = req.query
            //     // console.log(email)
            //     const query = {}
            //     const cursor = orderCollection.find(query)
            //     // console.log(cursor)
            //     const orders = await cursor.toArray()

            //     res.send(orders)
            // })
            app.post('/order', async (req, res) => {
                const order = req.body
                const result = await orderCollection.insertOne(order)
                res.send(result)

            })
        })
    }
    finally {
        console.log('connected to db')
    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Wasys car services running')
})
app.listen(port, () => {
    console.log('working in wasys car services', port)
})