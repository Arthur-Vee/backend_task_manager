require("dotenv").config()

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DATABASE_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },

});
async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);


module.exports = {
}