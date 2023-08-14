import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Express and TypeORM!');
});

export default app;