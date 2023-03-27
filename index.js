require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k5v5ibx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("moonTech");
    const productCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedProduct = {
        $set: {
          model: product.model,
          brand: product.brand,
          image: product.image,
          status: product.status,
          price: product.price,
          rating: product.rating,
          keyFeature: [
            product.keyFeature[0],
            product.keyFeature[1],
            product.keyFeature[2],
            product.keyFeature[3],
          ],
        },
      };

      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        option
      );
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
