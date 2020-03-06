const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

/**
 * Schema describing database name and fields
 */
const grabbedEmailsSchema = new Schema(
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

/**
 * Class managing working with database
 */
class DbManager {
    connectOptions = {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor(grabbedEmailsSchema) {
        this.MONGODB_URI = 'mongodb://localhost:27017/';
        this.MONGODB_DB_MAIN = 'grabbed_data';
        this.MONGO_URI = `${this.MONGODB_URI}${this.MONGODB_DB_MAIN}`;

        this.connections = mongoose.createConnection(this.MONGO_URI, this.connectOptions);
        this.connectionsModel = this.connections.model('GrabbedEmailsModel', grabbedEmailsSchema);
    }

    /**
     * Saves emails into database collection
     * @param {*} emails the array of valid emails
     */
    async saveEmails(emails) {
        try {
            emails.forEach((email) => this.connectionsModel.create({ email }));
        } catch (error) { }
    };
};

/**
 * Class getting web-page html and extracting emails
 */
class EmailGrabber {
    constructor() {
        this.WEB_PAGE = 'http://localhost:3000/v1/users';
    }

    /**
     * Gets web page body
     * @returns html of the page body
     */
    async getPageBody() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(this.WEB_PAGE);

        const body = await page.evaluate(() => document.body.innerHTML);

        await browser.close();
        return body;
    }

    /**
     * Extracts emails from the html
     * @returns the array of valid emails
     */
    async grabEmails() {
        const emailMatcher = new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        const body = await this.getPageBody();

        return body.match(emailMatcher);
    };
}

const dbManager = new DbManager(grabbedEmailsSchema);
const emailGrabber = new EmailGrabber();

emailGrabber.grabEmails()
    .then((emails) => dbManager.saveEmails(emails))
    .then(() => console.log('The end of grabbing process.'));
