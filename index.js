const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/MongoDb');
const ImportData = require('./router');
const { notFound, errorHandler } = require('./Middleware/Error');
const productRoute = require('./Routes/ProductRoutes');
const userRoute = require('./Routes/UserRoutes');
const orderRouter = require('./Routes/orderRoutes');
dotenv.config()
const app = express()


app.use(express.json())
app.use(cors());
connectDatabase()


//Api
app.use("/api/import", ImportData)
app.use("/api/products", productRoute)
app.use("/api/users", userRoute)
app.use("/api/orders", orderRouter)

// Error Handler
app.use(notFound)
app.use(errorHandler)


app.get('/', (req,res)=>{
    res.send("API is Running....")
})

const PORT = process.env.PORT || 1000

app.listen(PORT, console.log(`Server is running on port ${PORT}`));