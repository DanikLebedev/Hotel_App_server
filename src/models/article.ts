import { Schema, model, Document, Model } from 'mongoose';
const articleSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export interface ArticleInt extends Document {
    title: string;
    image: string;
    text: string;
}

const ArticleModel: Model<ArticleInt> = model<ArticleInt>('Article', articleSchema);

export default ArticleModel;
