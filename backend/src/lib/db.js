import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGOODB_URI)
        console.log(`MongooDB connected: ${conn.connection.host}`)
    }catch (error){
        console.log("MongooDB connection error:",error)

    }
}