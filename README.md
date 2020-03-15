# HOTEL APP API
API which based on NodeJS, ExpressJs, MongoDB,Typescript and Webpack;
## Instalation
Just use:
```
npm run server
```
But if you want to launch client and server together:   
1. Clone https://github.com/DanikLebedev/Hotel_App_server and https://github.com/DanikLebedev/hotel_app_client in the same folder
2. Use 
```npm run dev```

(If your project doesn't running - use ```npm run build``` and after that  ```npm run dev```)

## Description
This API helps us to do CRUD operations with data which is stored in mongoDB. Full list of dependencies you can find in package.json.

Some examples:
```
//adminRoute.ts
router.get(
    '/customers',
    auth,
    async (req: Request, res: Response): Promise<Response> => {
        const customers: Customer[] = await CustomerInterlayer.getAllCustomers(CustomerModel);
        return res.json({ customers });
    },
);

//CustomerInterlayer
export default class CustomerInterlayer {
    public static async getAllCustomers(Model): Promise<Customer[]> {
        return await DbServices.getData(Model);
    }
  ...
}

//DbServices

export class DbServices {
    public static async getData(Model): Promise<any> {
        try {
            const data: any = await Model.find();
            return data;
        } catch (e) {
            console.log(e);
        }
    }
...
}    
```
## Tests
Also I added some unit tests. You can find them in folder 'tests'.
There are some examples:
```
const feedbackData = {
    message: 'asdasdas',
    userEmail: 'asdasd1@mail.ru',
    userLastName: 'dadada',
    userName: 'yulasdasdia',
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
...
}
```
## Find a bug?
Please send me an email to danik_lebedev1999@mail.ru with issue)