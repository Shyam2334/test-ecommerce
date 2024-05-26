import express from "express";
import cors from "cors";

export const createServer=()=>{
    try{
        const app=express();

        app.use(express.json());
        app.use(cors());

        return app

    }catch(err){
        console.log(err)
    }
}
