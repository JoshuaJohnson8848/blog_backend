import express from 'express'
import cors from 'cors'
import connectDB from './config/dbConfig.js';
import UserRouter from './routes/user.js'
import AuthRouter from './routes/auth.js'
import BlogRouter from './routes/blog.js'
import CommentRouter from './routes/comments.js'

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", UserRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/blog", BlogRouter);
app.use("/api/comment", CommentRouter);

connectDB().then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server running at PORT ${process.env.PORT}`)
        });
    }).catch((error) => {
        console.log(`Server Error`);
    })
