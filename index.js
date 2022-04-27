const express = require("express")
const cors = require("cors")
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
            app.delete('service/:id', async (req, res) => {
                const id = req.params.id
                const query = { _id: ObjectId(id) }
                const result = await serviceCollection.deleteOne(query)
                console.log(result)
                res.send(result)
            })

        })
    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Wasys car services running')
})
app.listen(port, () => {
    console.log('working in wasys car services')
})