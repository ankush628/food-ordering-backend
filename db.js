const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://goFood:Ankush123@cluster0.2ejom5i.mongodb.net/goFoodMern?retryWrites=true&w=majority'

const mongoDB = async() => {
    try {
        mongoose.set("strictQuery", false)
        await mongoose.connect(mongoURI)
        console.log("Connected to Mongo Successfully!")
        const food_items = mongoose.connection.db.collection("food_Items")
        global.foodItems = await food_items.find().toArray()

        const food_category = mongoose.connection.db.collection("food_Category")
        global.foodCategory = await food_category.find().toArray()
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoDB;