import express from 'express'
import multer from 'multer'
import mongoose from "mongoose";
import cors from 'cors'
import * as dotenv from 'dotenv'
import { Server } from 'socket.io';


dotenv.config()

import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import {UserController, PostController, CommentController} from "./controllers/index.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {getPostCommentsCount} from "./controllers/CommentController.js";
import {addMessage, getMessages} from "./controllers/MessageController.js";

mongoose.connect(process.env.MONGO_URL).then(() => {console.log('DB OK')}).catch((err) => {console.log('DB error', err)})

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors,UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({url: `uploads/${req.file.originalname}`})
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.get('/comments', CommentController.getAll)
app.get('/comments/:id', CommentController.getPostComments)
app.get('/comments/count/:id', CommentController.getPostCommentsCount)
app.post('/comments/:id', checkAuth, CommentController.create)
// app.patch('/comments/:id', checkAuth, CommentController.update)
app.delete('/comments/:id', checkAuth, CommentController.remove)

app.post('/addmsg/', addMessage)
app.post('/getmsg/', getMessages)

const server = app.listen(4444, (err) => {if(err){return console.log(err)}console.log('Server OK')})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});
