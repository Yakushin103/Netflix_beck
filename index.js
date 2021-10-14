const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()

const authRouter = require("./routers/auth")

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
})
  .then(() => console.log("DB Connection Succesfull"))
  .catch((err) => console.log("ERROR", err))

app.use(express.json())

app.use("/api/auth", authRouter)

app.listen(8800, () => {
  console.log(`Backend server is running!`)
})