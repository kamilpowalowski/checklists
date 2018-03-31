"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const functions = require("firebase-functions");
const path = require("path");
const prerenderNode = require("prerender-node");
const app = express();
if (functions.config().prerenderio && functions.config().prerenderio.token) {
    const token = functions.config().prerenderio.token;
    app.use(prerenderNode.set('prerenderToken', token));
}
function angularResponse(request, response) {
    response.sendFile(path.join(__dirname + '/../dist/index.html'));
}
app.use(express.static(`${__dirname}/../dist`));
app.get('*', angularResponse);
exports.application = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map