import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';
import * as prerenderNode from 'prerender-node';

admin.initializeApp(functions.config().firebase);

function buildHtmlWithChecklist(checklist: any, url: string) {
  const title = checklist.title + ' - lizt.co - checklists made easy';
  const string = '<!doctype html><html lang="en">' +
    '<meta charset="utf-8">' +
    '<title>' + title + '</title>' +
    '<meta property="og:title" content="' + title + '">' +
    '<meta property="twitter:title" content="' + title + '">' +
    '<meta property="description" content="' + checklist.description + '">' +
    '<meta property="og:description" content="' + checklist.description + '">' +
    '<meta property="twitter:description" content="' + checklist.description + '">' +
    '<meta property="og:url" content="' + url + '">' +
    '<meta property="twitter:url" content="' + url + '">' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:locale" content="en_US">' +
    '<link rel="icon" type="image/x-icon" href="https://lizt.co/favicon.ico">' +
    '</head></html>';
  return string;
}

function buildDefaultHtml(url: string) {
  const title = 'lizt.co - checklists made easy';
  const description = 'community driven website for creating and sharing checklists';
  const string = '<!doctype html><html lang="en">' +
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
  return string;
}

function returnDefaultHtml(request, response) {
  const html = buildDefaultHtml(request.path);
  response.status(200).end(html);
}


export const application = functions.https.onRequest((request, response) => {
  console.log(prerenderNode);
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
        const checklistHtml = buildHtmlWithChecklist(checklist, request.path);
        response.status(200).end(checklistHtml);
      })
      .catch((reason) => {
        returnDefaultHtml(request, response);
      });
    return;
  }

  returnDefaultHtml(request, response);

});
