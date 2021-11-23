const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.y5cda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('medcity');
    const doctorsCollection = database.collection('doctors');
    const departmentsCollection = database.collection('departments');

    // list of doctors
    app.get('/doctors', async (req, res) => {
      const result = await doctorsCollection.find({}).toArray();
      res.send(result);
    });
    // list of departments
    app.get('/departments', async (req, res) => {
      const result = await departmentsCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('initial setup is done for medcity');
});

app.listen(port, () => {
  console.log('Listening to the port: ', port);
});
