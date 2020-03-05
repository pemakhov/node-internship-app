const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const WEB_PAGE = 'http://localhost:3000/v1/users';
const MONGODB_URI = 'mongodb://localhost:27017/';
const MONGODB_DB_MAIN = 'grabbed_data';
const MONGO_URI = `${MONGODB_URI}${MONGODB_DB_MAIN}`;
const FILE_NAME = 'site-screen.png';

const connectOptions = {
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connections = mongoose.createConnection(MONGO_URI, connectOptions);

const ScreenshotsSchema = new Schema(
    {
        link: {
            type: String,
            required: true,
        }
    },
    {
        collection: 'Screenshots',
        versionKey: false,
    }
);

const connectionsModel = connections.model('ScreenshotsModel', ScreenshotsSchema);

const grabScreenshot = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(WEB_PAGE);

    await page.screenshot({ path: FILE_NAME });

    await browser.close();
};

const SCREEN_LINK_BODY = 'https://drive.google.com/open?id=';

const saveLink = (id) => {
    try {
        const link = SCREEN_LINK_BODY + id;
        connectionsModel.create({ link });
    } catch (error) {
    }
};


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}

const uploadScreen = (auth) => {
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        'name': FILE_NAME
    };
    const media = {
        mimeType: 'image/png',
        body: fs.createReadStream(FILE_NAME)
    };

    const makeLinkSharable = (id) => {
        drive.permissions.create({
            fileId: id,
            resource: {
                role: 'reader',
                type: 'anyone'
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
            }
        });
    }

    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            console.error(err);
        } else {
            console.log('Screennshot was successfully uploaded');
            makeLinkSharable(file.data.id);
            saveLink(file.data.id);
        }
    });
};

grabScreenshot().then(() => {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content), uploadScreen);
    });
});
