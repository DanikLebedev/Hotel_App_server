import { Schema, model, Document, Model } from 'mongoose';

const categorySchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
});

export interface CategoryInt extends Document {
    title: string;
}

const CategoryModel: Model<CategoryInt> = model<CategoryInt>('Category', categorySchema);

export default CategoryModel;
