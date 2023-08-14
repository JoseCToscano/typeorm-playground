import "reflect-metadata"
import "dotenv/config"
import AppDataSource from "./typeorm/data-source";
import app from './server'

const port = process.env.PORT || 3000;


AppDataSource.initialize().then(async () => {
    console.log("Database initialized successfully");
    // Start server here

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => console.log(error))
