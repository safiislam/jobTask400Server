const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MOGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.yrhbvyy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// console.log(process.env.MOGODB_USERNAME)
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const porductCollection = client.db("shoping_cart").collection("products");
    const usersCollection = client.db("shoping_cart").collection("users");
    const addToCollection = client.db("shoping_cart").collection("addToCart");
    app.get("/products", async (req, res) => {
      const porduct = await porductCollection.find().toArray();
      res.send(porduct);
    });
    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const porduct = await porductCollection.findOne(query);
      res.send(porduct);
    });
    app.post("/user", async (req, res) => {
      const data = req.body;
      const result = await usersCollection.insertOne(data);
      res.send(result);
    });
    // app.get("/user", async (req, res) => {
    //   const email = res.query.email;
    //   const query = { email: email };
    //   const result = usersCollection.findOne(query);
    // });
    // app.post("/add_to_cart", async (req, res) => {
    //   const data = req.body;
    //   const result = await addToCollection.insertOne(data);
    //   res.send(result);
    // });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("port:", port);
});
