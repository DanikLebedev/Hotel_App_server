import { Schema, model, Document, Model } from 'mongoose';
const commentSchema: Schema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        articleId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export interface CommentInt extends Document {
    createdAt: string;
    userEmail: string;
    text: string;
}

const CommentModel: Model<CommentInt> = model<CommentInt>('Comment', commentSchema);

export default CommentModel;
