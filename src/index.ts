import "reflect-metadata"
import 'dotenv/config'
import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello, Express and TypeORM!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
