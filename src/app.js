import express from 'express'
import cors from 'cors'
import connectDB from './config/dbConfig.js';
import UserRouter from './routes/user.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", UserRouter);

connectDB().then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running at PORT ${process.env.PORT}`)
        });
    }).catch((error) => {
        console.log(`Server Error`);
    })
