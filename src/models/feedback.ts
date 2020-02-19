import { Schema, model, Model, Document } from 'mongoose';

const feedbackSchema: Schema = new Schema({
    userEmail: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userLastName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
});

export interface Feedback extends Document {
    userEmail: string;
    userName: string;
    userLastName: string;
    message: string;
    approved: boolean
}

const FeedbackModel: Model<Feedback> = model<Feedback>('Feedback', feedbackSchema);

export default FeedbackModel;
