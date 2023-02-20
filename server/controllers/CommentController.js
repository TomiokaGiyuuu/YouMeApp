import CommentModel from "../models/Comment_model.js";

export const getAll = async (req, res) => {
    try{
        const comments = await CommentModel.find().populate("user", ["fullName", "avatarUrl"] ).exec()
        res.json(comments)
    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Can't get comments"
        })
    }
}

export const getPostComments = async (req, res) => {
    try{
        const postId = req.params.id

        CommentModel.find({
                postId: postId
            },
            {}, {},
            (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Can't return comments"
                    })
                }

                if(!doc) {
                    return res.status(404).json({
                        message: "Comments not found"
                    })
                }

                res.json(doc)
            }

        ).populate('user')

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Can't get comments"
        })
    }
}

export const remove = async (req, res) => {
    try{
        const commentId = req.params.id

        CommentModel.findOneAndDelete({
            _id: commentId
        }, (err, doc) => {
            if(err){
                console.log(err)
                return res.status(500).json({
                    message: "Can not delete the comment"
                })
            }

            if(!doc){
                return res.status(404).json({
                    message: "Comment not found"
                })
            }

            res.json({
                success: true
            })
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Can't get comments"
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            postId: req.params.id,
            user: req.userId,
        })

        const comment = await doc.save()

        res.json(comment)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't create the comment"
        })
    }
}

export const update = async (req, res) => {
    try{
        const commentId = req.params.id

        await CommentModel.updateOne({
                _id: commentId,
            }, {
            text: req.body.text,
            postId: req.params.id,
            user: req.userId,
                // $set: req.body
            }
        )

        res.json({
            success: true,
        })

    }catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Can't update the comment"
        })
    }
}
