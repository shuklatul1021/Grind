import { app } from "./server.js";
import cluster from "cluster";
import dotenv from "dotenv";
import os from "os";
dotenv.config();

const totalCPUs = os.cpus().length;
const PORT = process.env.PORT || 5000

if(cluster.isPrimary){
    console.log(`Primary ${process.pid} is running`);
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
}else{
    console.log(`Worker ${process.pid} started`);
    app.listen(PORT , ()=>{
        console.log("Server Is Running On The Server : http://localhost:5000")
    })
}
