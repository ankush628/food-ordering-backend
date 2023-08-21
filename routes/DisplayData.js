const express = require('express')
const router = express.Router()

router.post('/foodData',async (req,res)=>{
    try {
        res.send([foodItems,foodCategory])
    } catch (error) {
        console.log(error.message)
        res.status('Server Error')
    }
})

module.exports = router