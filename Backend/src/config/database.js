const mongoose = require("mongoose")


async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to Database")

    } catch(err) {
        console.log(err);
    }
}

module.exports = connectToDb

module.exports = connectToDb