import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import multer from 'multer';
import * as authController from "./controllers/auth";
import validateToken from "./middleware/validateToken";
import * as postsController from './controllers/posts';
import * as commentsController from './controllers/comments'
import * as votesController from './controllers/votes'
import * as imagesController from './controllers/images'

const app = express()

app.use(cors());
app.use(express.json()); //middleware
app.use('/static/', express.static(__dirname + '/../uploads'));

const upload= multer();

app.post('/register', authController.register)
app.post('/login', authController.logIn);
app.get('/profile', validateToken, authController.profile);

app.post('/posts', validateToken, upload.single('image'), postsController.create);
app.get('/posts', postsController.getAllPosts);
app.get('/posts/:id', postsController.getPost);

app.post('/posts/:postId/comments', validateToken, commentsController.createComment);
app.delete('/posts/:postId/comments/:commentId', validateToken, commentsController.deleteComment);

app.post('/posts/:postId/upvote', validateToken, votesController.upvote);
app.post('/posts/:postId/downvote', validateToken, votesController.downvote);

app.get('/images/:fileId', imagesController.getImage)

const mongoURL = process.env.DB_URL;

if(!mongoURL) throw Error("Missing db url");

mongoose.connect(mongoURL)
    .then(() => {

        const port = parseInt(process.env.PORT || '3500');

        app.listen(port, () => {
            console.log('server listening on port' + port);
        })
    })



