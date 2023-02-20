import express from 'express'
import multer from 'multer'
import mongoose from "mongoose";
import cors from 'cors'

import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import {UserController, PostController, CommentController} from "./controllers/index.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";

mongoose.connect("mongodb+srv://qwerty:00000000@cluster0.wweg9.mongodb.net/blog?retryWrites=true&w=majority").then(() => {console.log('DB OK')}).catch((err) => {console.log('DB error', err)})

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

app.use(express.json())
app.use(cors())

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
app.post('/posts',checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.get('/comments', CommentController.getAll)
app.get('/comments/:id', CommentController.getPostComments)
app.post('/comments/:id', checkAuth, CommentController.create)
// app.patch('/comments/:id', checkAuth, CommentController.update)
app.delete('/comments/:id', checkAuth, CommentController.remove)


app.listen(4444, (err) => {if(err){return console.log(err)}console.log('Server OK')})
