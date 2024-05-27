import express from "express";
import cors from "cors";
import router from "../router/product.router";

export const createServer=()=>{
    try{
        const app=express();

        app.use(express.json());
        app.use(cors());

        app.use(router);

        return app

    }catch(err){
        console.log(err)
    }
}
