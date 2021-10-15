const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()

const authRouter = require("./routers/auth")
const userRouter = require("./routers/users")
const movieRouter = require("./routers/movies")
const listRouter = require("./routers/list")

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
app.use("/api/users", userRouter)
app.use("/api/movies", movieRouter)
app.use("/api/lists", listRouter)

app.listen(8800, () => {
  console.log(`Backend server is running!`)
})