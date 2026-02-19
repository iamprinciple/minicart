const express = require("express")
const app = express()

require("dotenv").config()
const cors = require("cors")
const dbConnect = require("./src/Config/db.config")
const adminRouter = require("./src/routes/adminRouter")
const userRouter = require("./src/routes/userRouter")

app.use(express.urlencoded({extended:true}))
app.use(express.json({extended: true, limit:"50mb"}))
app.use(cors({origin:"*"}))
app.use('/admin', adminRouter)
app.use('/user', userRouter)


dbConnect()
let port = process.env.PORT || 4000;
app.listen(port, () =>{
    console.log(`App started at ${port}`);
    
})
