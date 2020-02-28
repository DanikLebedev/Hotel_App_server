import mongoose from 'mongoose';
import keys from '../../keys/keys';
import CategoryInterlayer from '../interlayers/category.interlayer';
import CategoryModel from '../models/category';
import FeedbackInterlayer from '../interlayers/feedback.interlayer';
import FeedbackModel from '../models/feedback';
import { DbServices } from '../db/dbServices';

const feedbackData = {
    message: 'asdasdas',
    userEmail: 'yulia_021@mail.ru',
    userLastName: 'kireaitsava',
    userName: 'yulia',
};

describe('Category model testing', () => {
    beforeAll(async () => {
        await mongoose.connect(
            keys.MONGODB_URI,
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
            err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
            },
        );
    });
    it('should get all feedbacks', async () => {
        const validFeedback = await FeedbackInterlayer.getAllFeedbacks(FeedbackModel);
        expect(validFeedback).toBeDefined();
        expect(typeof validFeedback[0].message).toBe('string');
    });

    it('should create new feedback', async () => {
        const validFeedback = await DbServices.postData(feedbackData, FeedbackModel);
        expect(validFeedback).toBeDefined();
        expect(validFeedback['message']).toBe(feedbackData.message);
    });

    it('should delete  feedback', async () => {
        const validFeedback = await FeedbackInterlayer.deleteFeedback(
            { _id: '5e537b9887cd152c2049f98b' },
            FeedbackModel,
        );
        expect(validFeedback).toBeDefined();
        expect(validFeedback['message']).toBe(feedbackData.message);
    });

    it('should return category validation error', async () => {
        const invalidCategory = await CategoryInterlayer.postCategories({ title: '' }, CategoryModel);
        expect(invalidCategory).toBeUndefined();
    });
});
