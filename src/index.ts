import "reflect-metadata"
import "dotenv/config"
import { AppDataSource } from "./typeorm/data-source";


AppDataSource.initialize().then(async () => {
    console.log("Database initialized successfully");
    // Start server here
}).catch(error => console.log(error))
