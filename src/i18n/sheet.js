const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const langSupport = ['en', 'vi'];

const sheetID = '1GFrlko7VdXDgNqn84wCsvBPbr-Y1s85nVKEsOB_toqc';

const file = ['ui_component', 'slp', 'setting', 'common', 'inbox', 'error', 'contact', 'article'];

const SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
];

const TOKEN_PATH = 'src/googleapi/token.json';

// Load client secrets from a local file.
fs.readFile('src/googleapi/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), listMajors);
    // authorize(JSON.parse(content), downloadFile);
});

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, file);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', code => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function listMajors(auth, sheetsName) {
    const sheets = google.sheets({ version: 'v4', auth });
    const localeObj = {};

    Promise.all(sheetsName.map(range => getData(sheets, range))).then(values => {
        for (const i in langSupport) {
            const lang = langSupport[i];
            localeObj[lang] = {};
        }
        values.forEach((value, indexValue) => {
            const data = value.data.values;
            data.shift();
            const sheetName = sheetsName[indexValue].toLowerCase()

            for (const item of data) {
                const index = item[0];
                for (let i = 0; i < langSupport.length; i++) {
                    const lang = langSupport[i];
                    !localeObj[lang][sheetName] && (localeObj[lang][sheetName] = {});
                    localeObj[lang][sheetName][index] = item[i + 1];
                }
            }
        });
        const writeFS = fs.createWriteStream('src/i18n/i18.json');
        writeFS.write(JSON.stringify(localeObj));
        console.log('Build lang success');
    });
}

function getData(sheets, range) {
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get(
            {
                spreadsheetId: sheetID,
                range: range,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            },
        );
    });
}