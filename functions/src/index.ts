import * as express from 'express';
import * as functions from 'firebase-functions';
import * as path from 'path';
import * as prerenderNode from 'prerender-node';

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

export const application = functions.https.onRequest(app);
