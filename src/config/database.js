const mongoose = require("mongoose")


async function connetToDb()
{
   try{await mongoose.connect(process.env.MONGO_URI)

    console.log("connected to Database")
   }
   catch(err)
   {
    console.log(err);
   }
}

module.exports = connetToDb