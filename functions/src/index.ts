import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';
import * as prerenderNode from 'prerender-node';

admin.initializeApp(functions.config().firebase);

const defaultTitle = 'lizt.co - checklists made easy';
const defaultDescription = 'community driven website for creating and sharing checklists';

function buildPrerenderedHtml(title: string, description: string, url: string): string {
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
    '<meta property="og:type" content="website">' +
    '<meta property="og:locale" content="en_US">' +
    '<link rel="icon" type="image/x-icon" href="https://lizt.co/favicon.ico">' +
    '</head></html>';
}

function buildPrerenderedHtmlForChecklist(checklist: any, url: string) {
  const title = checklist.title + ' - ' + defaultTitle;
  const description = checklist.description && checklist.description.length > 0 ? checklist.description : defaultDescription;
  return buildPrerenderedHtml(title, description, url);
}

function returnPrerenderedHtml(request, response) {
  const url = request.protocol + '://' + request.get('host') + request.url;
  const html = buildPrerenderedHtml(defaultTitle, defaultDescription, url);
  response.status(200).end(html);
}

function returnPrerenderedHtmlForChecklist(request, response, checklist) {
  const url = request.protocol + '://' + request.get('host') + request.url;
  const checklistHtml = buildPrerenderedHtmlForChecklist(checklist, url);
  response.status(200).end(checklistHtml);
}


export const prerender = functions.https.onRequest((request, response) => {
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
