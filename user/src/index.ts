import { createServer } from "./config/app";
import { connectDB } from "./config/connectdb";

const app=createServer();

connectDB().then(()=>{
    app?.listen(3000,()=>{
        console.log("Server is running on port 3000");
    })
})