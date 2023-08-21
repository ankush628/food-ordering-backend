const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
router.use(bodyParser.json())

const jwtSecret = "My name is Ankush. I am as useless as mobile without internet."
router.post('/createUser',
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'invalid password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })

        const salt = await bcrypt.genSalt(10)
        let secPass = await bcrypt.hash(req.body.password,salt)

        try {
            await User.create({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                password: secPass
            })
            res.json({ success: true })
        }
        catch (error) {
            res.json({ success: false })
            console.log(error)
        }
    })

router.post('/login',
    body('email').isEmail(),
    body('password', 'invalid password').isLength({ min: 5 }),
    async (req, res) => {
        let email = req.body.email
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() })
        try {
            let userData = await User.findOne({email})

            if (!userData)
                return res.status(400).json({ errors: 'Try logging with different email or password' })

            const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
            if (!pwdCompare)
                return res.status(400).json({ errors: 'Try logging with different email or password' })

            const data = {
                user:{
                    id:userData._id
                }
            }

            const authToken = jwt.sign(data,jwtSecret)

            return res.json({ success: true, authToken:authToken })
        }
        catch (error) {
            res.json({ success: false })
            console.log(error)
        }
    })

module.exports = router