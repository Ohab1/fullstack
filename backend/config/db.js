const mongoose=require("mongoose")

const connectDB=async()=>{
   try {
    await mongoose.connect("mongodb+srv://ohab000001:Nu0vgoS4uNUm3Fvz@cluster0.pjajr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("MongoDB succesfully connected");
    
} catch (error) {
    console.log("MongoDB connection error",error);
   }
}

module.exports=connectDB