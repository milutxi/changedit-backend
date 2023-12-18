import { Request, Response } from "express";
import Post from "../models/Post";
import { assertDefined } from "../util/assertDefined";

export const createComment = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { userId } = req;

    assertDefined(userId);

    const { commentBody } = req.body

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({ message: 'nOT POST FOUND FOR ID: ' + postId});
    }


    post.comments.push({
        body: commentBody,
        author: (userId)
    })

    const savedPost = await post.save();

    res.status(201).json(savedPost);
 }

 export const deleteComment = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { userId } = req;

    assertDefined(userId);

    const post = await Post.findById(postId);

    if (!post) {
        return res.status(404).json({ message: 'No post found for id: ' + postId});
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
        return res.status(404).json({ message: 'No comment found for id: ' + commentId});
    }

    if (comment.author.toString() !== userId) {
        return res.status(403).json({message: 'Not authorized'})
    }

    comment.deleteOne()

    const updatePost = await post.save();

    return res.status(200).json(updatePost)
 }
