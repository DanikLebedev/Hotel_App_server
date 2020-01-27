import router from '../routes/authRoute';
import request from 'supertest';

describe('Test the auth ', () => {
    test('It should response the Post method', done => {
        request(router)
            .post('/api/auth')
            .then(response => {
                expect(response.status).toBe(200);
                done();
            });
    });
});
