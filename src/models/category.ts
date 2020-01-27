import { Schema, model, Types, Document, Model } from 'mongoose';

const categorySchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    bedsQuantity: {
        type: Number,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    count: {
        type: String,
        required: true,
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    date: { type: Date, default: Date.now },
});

export interface Category extends Document {
    title: string;
    price: number;
    bedsQuantity: number;
    area: number;
    description: string;
    image: string;
    count: number;
}

const CategoryModel: Model<Category> = model<Category>('Category', categorySchema);

export default CategoryModel;
