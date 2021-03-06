"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const path = require("path");
const prerenderNode = require("prerender-node");
const telegraf = require("telegraf");
// Read README before deploying this functions
// Prerendering
admin.initializeApp();
const defaultTitle = 'lizt.co - checklists made easy';
const defaultDescription = 'community-driven website for creating and sharing checklists';
function websiteUrl() {
    const domain = functions.config().domain;
    return domain.protocol + '://' + domain.host;
}
function buildPrerenderedHtml(title, description, url, imageUrl) {
    return '<!doctype html><html lang="en">' +
        '<meta charset="utf-8">' +
        '<title>' + title + '</title>' +
        '<meta property="og:title" content="' + title + '">' +
        '<meta property="twitter:title" content="' + title + '">' +
        '<meta property="description" content="' + description + '">' +
        '<meta property="og:description" content="' + description + '">' +
        '<meta property="twitter:description" content="' + description + '">' +
        '<meta property="og:url" content="' + url + '">' +
        '<meta property="twitter:url" content="' + url + '">' +
        '<meta property="og:image" content="' + imageUrl + '">' +
        '<meta property="og:type" content="website">' +
        '<meta property="og:locale" content="en_US">' +
        '<link rel="icon" type="image/x-icon" href="https://lizt.co/favicon.ico">' +
        '</head></html>';
}
function buildPrerenderedHtmlForChecklist(checklist, url, imageUrl) {
    const title = checklist.title + ' - ' + defaultTitle;
    const description = checklist.description && checklist.description.length > 0 ? checklist.description : defaultDescription;
    return buildPrerenderedHtml(title, description, url, imageUrl);
}
function returnPrerenderedHtml(request, response) {
    const url = websiteUrl() + request.url;
    const imageUrl = websiteUrl() + '/assets/liztco-banner.jpg';
    const html = buildPrerenderedHtml(defaultTitle, defaultDescription, url, imageUrl);
    response.status(200).end(html);
}
function returnPrerenderedHtmlForChecklist(request, response, checklist) {
    const url = websiteUrl() + request.url;
    const imageUrl = websiteUrl() + '/assets/liztco-banner.jpg';
    const checklistHtml = buildPrerenderedHtmlForChecklist(checklist, url, imageUrl);
    response.status(200).end(checklistHtml);
}
exports.prerender = functions.https.onRequest((request, response) => {
    if (!prerenderNode.shouldShowPrerenderedPage(request)) {
        response.sendFile(path.join(__dirname + '/../dist/index.html'));
        return;
    }
    const pathElements = request.path.split('/');
    if (pathElements[1] === 'checklists' && pathElements[2]) {
        admin.firestore()
            .collection('checklists')
            .doc(pathElements[2])
            .get()
            .then(snapshot => {
            const checklist = snapshot.data();
            returnPrerenderedHtmlForChecklist(request, response, checklist);
        })
            .catch(reason => {
            returnPrerenderedHtml(request, response);
        });
        return;
    }
    returnPrerenderedHtml(request, response);
});
// New user notification
const bot = new telegraf.Telegram(functions.config().bot.token);
exports.newUser = functions.auth.user().onCreate(_ => {
    return bot.sendMessage(functions.config().bot.chat, `New user joined ${functions.config().domain.host} 🎉`);
});
// User removed his account notification
exports.removeUser = functions.auth.user().onDelete((userRecord, context) => {
    return bot.sendMessage(functions.config().bot.chat, `User with uid '${userRecord.uid}' removed account ${functions.config().domain.host} 😭`);
});
// Checklists collection changed
function modifyChecklistCount(modifier) {
    const reference = admin.firestore()
        .collection('stats')
        .doc('values');
    return reference
        .get()
        .then(snapshot => {
        const currentValue = snapshot.get('checklists');
        return reference
            .update({ checklists: currentValue + modifier });
    });
}
exports.checklistCreated = functions.firestore.document('checklists/{checklistId}')
    .onCreate(_ => {
    return modifyChecklistCount(+1);
});
exports.checklistRemoved = functions.firestore.document('checklists/{checklistId}')
    .onDelete(_ => {
    return modifyChecklistCount(-1);
});
// Users collection changed
function modifyUsersCount(modifier) {
    const reference = admin.firestore()
        .collection('stats')
        .doc('values');
    return reference
        .get()
        .then(snapshot => {
        const currentValue = snapshot.get('users');
        return reference
            .update({ users: currentValue + modifier });
    });
}
exports.usersCreated = functions.firestore.document('users/{userId}')
    .onCreate(_ => {
    return modifyUsersCount(+1);
});
exports.usersRemoved = functions.firestore.document('users/{userId}')
    .onDelete(_ => {
    return modifyUsersCount(-1);
});
// Store daily data
exports.dailyStats = functions.https.onRequest((request, response) => {
    const secretToken = functions.config().secret.token;
    if (request.query['token'] === secretToken) {
        const reference = admin.firestore()
            .collection('stats')
            .doc('values');
        reference
            .get()
            .then(snapshot => {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            const checklists = snapshot.get('checklists');
            const checklistsDaily = snapshot.get('checklists-daily');
            checklistsDaily.push({
                date: date,
                value: checklists
            });
            const users = snapshot.get('users');
            const usersDaily = snapshot.get('users-daily');
            usersDaily.push({
                date: date,
                value: users
            });
            return reference
                .update({
                'checklists-daily': checklistsDaily,
                'users-daily': usersDaily
            });
        })
            .then(_ => response.status(200).end())
            .catch(error => response.status(500).end(error));
    }
    else {
        response.status(401).end();
    }
});
//# sourceMappingURL=index.js.map