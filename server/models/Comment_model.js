import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        postId: {
          type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: Number,
        dislikes: Number,
    },{
        timestamps: true,
    }
)

export default mongoose.model('Comment', CommentSchema)
