const router = require("express").Router()
const CryptoJS = require("crypto-js")

const User = require("../models/User")
const verify = require("../middleware/verifyToken")

//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString()
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: req.body
        },
        { new: true }
      )
      const { password, ...info } = updateUser._doc

      return res.status(200).json(info)
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You can update only your account!")
  }
})

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(
        req.params.id
      )

      return res.status(200).json("User has been deleted!")
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You can delete only your account!")
  }
})

//GET

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    )

    const { password, ...info } = user._doc

    return res.status(200).json(info)
  } catch (err) {
    return res.status(500).json(err)
  }
})

//GET ALL
router.get("/", verify, async (req, res) => {
  const query = req.query.limit
  console.log('limit', query)
  if (req.user.isAdmin) {
    try {
      const users = query ?
        await User.find().sort({ _id: -1 }).limit(+query) :
        await User.find()

      return res.status(200).json(users)
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status(403).json("You are not allowed to see all users!")
  }
})

//GET USER STATS
router.get("/stats", async (req, res) => {
  const today = new Date()
  const lastYear = today.setFullYear(today.setFullYear() - 1)

  const monthArray = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ]

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        }
      },
    ])

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router