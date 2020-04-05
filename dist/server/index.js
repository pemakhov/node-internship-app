import * as express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Hello world'));
app.listen(3000, () => console.log('My awesome app run on localhost'));
