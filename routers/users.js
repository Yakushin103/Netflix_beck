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
      const updateUser = await User.findByIdAndUpdate(req.user.id, {
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
//GET
//GET ALL
//GET USER STATS

module.exports = router