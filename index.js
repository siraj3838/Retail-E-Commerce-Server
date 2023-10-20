const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5020;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_KEY}:${process.env.DB_PASS}@cluster0.hq29e8f.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const amazonCollection = client.db("amazonDB").collection("amazon");
    const secondAmazonCollection = client.db("cartsDB").collection('cart');




    // amazon work
    app.post('/amazon', async (req, res) => {
      const user = req.body;
      console.log(user)
      const result = await amazonCollection.insertOne(user);
      res.send(result);
    })
    app.get('/amazon', async (req, res) => {
      const result = await amazonCollection.find().toArray();
      res.send(result)
    })


    app.get('/amazon/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await amazonCollection.findOne(query)
      res.send(result);
    })
    app.put('/amazon/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          category: product.category,
          name: product.name,
          photo: product.photo,
          brandName: product.brandName,
          price: product.price,
          rating: product.rating,
        }
      }
      const result = await amazonCollection.updateOne(filter, updateProduct, options)
      res.send(result);
    })

    // add to cart get data
    app.post('/carts', async (req, res) => {
      const user = req.body;
      const result = await secondAmazonCollection.insertOne(user);
      res.send(result);
      console.log(user, result)
    })
    app.get('/carts', async (req, res) => {
      const result = await secondAmazonCollection.find().toArray();
      res.send(result);
    })
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await secondAmazonCollection.deleteOne(query);
      res.send(result);
      console.log(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('My Server Running')
})
app.listen(port, () => {
  console.log(`My port all time running from port ${port}`)
})
