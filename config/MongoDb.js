const mongoose = require('mongoose')

const connectDatabase = async ()=>{
    try {
        const connection  = await mongoose.connect(process.env.MONGO_URL,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        })
        console.log("MongoDb connected successfully");
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit(1);
        
    }
}

module.exports = connectDatabase