const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const WEB_PAGE = 'http://localhost:3000/v1/users';
const MONGODB_URI = 'mongodb://localhost:27017/';
const MONGODB_DB_MAIN = 'grabbed_data';
const MONGO_URI = `${MONGODB_URI}${MONGODB_DB_MAIN}`;

const connectOptions = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connections = mongoose.createConnection(MONGO_URI, connectOptions);

const GrabbedEmailsSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        }
    },
    {
        collection: 'GrabbingEmails',
        versionKey: false,
    }
);

const connectionsModel = connections.model('GrabbedEmailsModel', GrabbedEmailsSchema);


const grabEmails = new Promise(async (resolve) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(WEB_PAGE);

    const body = await page.evaluate(() => document.body.innerHTML);
    const emailMatcher = new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

    await browser.close();

    resolve(body.match(emailMatcher));
});

const saveEmails = (emails) => {
    try {
        emails.forEach((email) => connectionsModel.create({ email }));
    } catch (error) {
    }
};

grabEmails.then(saveEmails).then(() => console.log('The end of grabbing process.'));
