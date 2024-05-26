import { createServer } from "./config/app";

const app=createServer();

app?.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
