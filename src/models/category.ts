import { Schema, model, Document, Model } from 'mongoose';

const categorySchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
});

export interface Category extends Document {
    title: string;
}

const CategoryModel: Model<Category> = model<Category>('Category', categorySchema);

export default CategoryModel;
