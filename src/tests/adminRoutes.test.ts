import request, { SuperTest, Response } from 'supertest';
import app from '../index';

describe('Testing authorize', () => {
    it('should create new customer', async () => {
        const res: Response = await request(app)
            .post('api/auth/register')
            .send({
                email: 'admin@gmail.ru',
                password: '1234312',
            });
        expect(res.status).toEqual(201);
    });

    it('should login ', async () => {
        const res: Response = await request(app)
            .post('api/auth/login')
            .send({
                email: 'admin@mail.ru',
                password: '123456',
            });
        expect(res.status).toEqual(201);
    });
});

describe('Testing category Endpoint ', () => {
    it('should get all categories', async () => {
        const res: Response = await request(app).get('/api/admin/category');
        expect(res.status).toEqual(200);
        expect(res.body[0].title).toBeDefined();
    });
    it('should return 404 error ', async () => {
        const res: Response = await request(app).get('/api/admin/categorys');
        expect(res.status).toEqual(404);
    });
    it('should create a new category', async () => {
        const res: Response = await request(app)
            .post('/api/admin/category')
            .send({
                title: 'Single',
            });
        expect(res.status).toEqual(201);
    });
    it('should return a 400 error(validation error)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/category')
            .send({
                title: 123,
            });
        expect(res.status).toEqual(400);
    });

    it('should return a 500 error(input is empty)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/category')
            .send({
                title: '',
            });
        expect(res.status).toEqual(500);
    });
});

describe('Testing Room Endpoint', () => {
    it(' should get all rooms', async () => {
        const res: Response = await request(app).get('/api/admin/room');
        expect(res.status).toEqual(200);
        expect(res.body[0].price).toBeDefined();
    });
    it('should create new room', async () => {
        const res: Response = await request(app)
            .post('/api/admin/room')
            .send({
                category: 'Standart',
                title: 'string',
                price: 234,
                area: 2423,
                guests: 23,
                rooms: 3,
                description: 'sdfsdfsdf',
                image: '23423423',
            });
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('data.category');
    });
    it('should return 404 error', async () => {
        const res: Response = await request(app)
            .post('/api/admin/rooms')
            .send({
                category: 'Standart',
                title: 'string',
                price: 234,
                area: 2423,
                guests: 23,
                rooms: 3,
                description: 'sdfsdfsdf',
                image: '23423423',
            });
        expect(res.status).toEqual(404);
    });
    it('should return a 500 error(some inputs are empty)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/room')
            .send({
                title: '1234',
                category: '123',
            });
        expect(res.status).toEqual(500);
    });
    it('should return 400 error(validation error)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/room')
            .send({
                category: 'Standart',
                title: 1231,
                price: '234',
                area: 2423,
                guests: 23,
                rooms: 3,
                description: 'sdfsdfsdf',
                image: '23423423',
            });
        expect(res.status).toEqual(400);
    });
});

describe('Testing Employee Endpoints', () => {
    it('should get all employee', async () => {
        const res: Response = await request(app).get('/api/admin/employee');
        expect(res.status).toEqual(200);
        expect(res.body[0].email).toBeDefined();
    });
    it('should create new employee', async () => {
        const res: Response = await request(app)
            .post('/api/admin/employee')
            .send({
                email: 'danik@mail.ru',
                password: '12314124',
                status: 'manager',
            });
        expect(res.status).toEqual(201);
    });

    it('should return 400 error (validation error)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/employee')
            .send({
                email: 'dani2.ru',
                password: '123',
                status: 'manager',
            });
        expect(res.status).toEqual(400);
    });
    it('should return 500 error (inputs are empty )', async () => {
        const res: Response = await request(app)
            .post('/api/admin/employee')
            .send({
                email: '',
                password: '123',
                status: '',
            });
        expect(res.status).toEqual(500);
    });
});

describe('Testing Status Endpoints', () => {
    it('should get all statuses', async () => {
        const res: Response = await request(app).get('/api/admin/status');
        expect(res.status).toEqual(200);
    });
    it('should create new status ', async () => {
        const res: Response = await request(app)
            .post('/api/admin/status')
            .send({
                title: 'frontEnd',
            });
        expect(res.status).toEqual(201);
    });

    it('should return 400 error(validation error)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/status')
            .send({
                title: 123,
            });
        expect(res.status).toEqual(400);
    });

    it('should return 500 error(input are empty)', async () => {
        const res: Response = await request(app)
            .post('/api/admin/status')
            .send({
                title: '',
            });
        expect(res.status).toEqual(500);
    });
});
