"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const path = require("path");
const prerenderNode = require("prerender-node");
admin.initializeApp(functions.config().firebase);
const defaultTitle = 'lizt.co - checklists made easy';
const defaultDescription = 'community driven website for creating and sharing checklists';
const defaultUrl = 'https://lizt.co';
function websiteUrl() {
    const domain = functions.config().domain;
    if (!domain) {
        return defaultUrl;
    }
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
            .then((snapshot) => {
            const checklist = snapshot.data();
            returnPrerenderedHtmlForChecklist(request, response, checklist);
        })
            .catch((reason) => {
            returnPrerenderedHtml(request, response);
        });
        return;
    }
    returnPrerenderedHtml(request, response);
});
//# sourceMappingURL=index.js.map