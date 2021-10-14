const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

// REGISTER
router.post("/register", async (req, res) => {
  // const { username, email, password } = req.body

  const findUser = await User.findOne({ email: req.body.email })

  if (!findUser) {
    return res.status(401).json("Wrong password or username")
  }

  if (!!findUser.username) {
    return res.status(401).json("The user already exists")
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString()
  })

  try {
    const user = await newUser.save()

    const { password, ...info } = user._doc
    return res.status(200).json(info)
  } catch (err) {
    return res.status(500).json(err)
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  // const { email, password } = req.body

  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(401).json("Wrong password or username")
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    const originPass = bytes.toString(CryptoJS.enc.Utf8)

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    )

    if (originPass !== req.body.password) {
      return res.status(401).json("Wrong password or username")
    }

    const { password, ...info } = user._doc

    return res.status(200).json({ ...info, accessToken })
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router