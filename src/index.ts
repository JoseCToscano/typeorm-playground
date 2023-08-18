import "reflect-metadata"
import "dotenv/config"
import AppDataSource from "./typeorm/data-source";
import serverStartup from "./server";

AppDataSource.initialize().then(async () => {
    console.log("Database initialized successfully");
    // Start server here
    serverStartup();
}).catch(error => console.log(error))
