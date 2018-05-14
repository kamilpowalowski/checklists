import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';
import * as prerenderNode from 'prerender-node';
import * as telegraf from 'telegraf';

// Read README before deploying this functions

// Prerendering

admin.initializeApp(functions.config().firebase);

const defaultTitle = 'lizt.co - checklists made easy';
const defaultDescription = 'community-driven website for creating and sharing checklists';

function websiteUrl(): string {
  const domain = functions.config().domain;
  return domain.protocol + '://' + domain.host;
}

function buildPrerenderedHtml(title: string, description: string, url: string, imageUrl: string): string {
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

function buildPrerenderedHtmlForChecklist(checklist: any, url: string, imageUrl: string) {
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

export const newUser = functions.auth.user().onCreate(_ => {
  return bot.sendMessage(
    functions.config().bot.chat,
    `New user joined ${functions.config().domain.host} 🎉`
  );
});

// User removed his account notification

export const removeUser = functions.auth.user().onDelete(event => {
  return bot.sendMessage(
    functions.config().bot.chat,
    `User with uid '${event.data.uid}' removed account ${functions.config().domain.host} 😭`
  );
});

// Checklists collection changed

function modifyChecklistCount(modifier: number): Promise<FirebaseFirestore.WriteResult> {
  const reference = admin.firestore()
    .collection('stats')
    .doc('values');

  return reference
    .get()
    .then(snapshot => {
      const currentValue: number = snapshot.get('checklists');
      return reference
        .update({ checklists: currentValue + modifier });
    });
}

export const checklistCreated = functions.firestore.document('checklists/{checklistId}')
  .onCreate(_ => {
    return modifyChecklistCount(+1);
  });

export const checklistRemoved = functions.firestore.document('checklists/{checklistId}')
  .onDelete(_ => {
    return modifyChecklistCount(-1);
  });

// Users collection changed

function modifyUsersCount(modifier: number): Promise<FirebaseFirestore.WriteResult> {
  const reference = admin.firestore()
    .collection('stats')
    .doc('values');

  return reference
    .get()
    .then(snapshot => {
      const currentValue: number = snapshot.get('users');
      return reference
        .update({ users: currentValue + modifier });
    });
}

export const usersCreated = functions.firestore.document('users/{userId}')
  .onCreate(_ => {
    return modifyUsersCount(+1);
  });

export const usersRemoved = functions.firestore.document('users/{userId}')
  .onDelete(_ => {
    return modifyUsersCount(-1);
  });

// Store daily data

export const dailyStats = functions.https.onRequest((request, response) => {
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

        const checklists: number = snapshot.get('checklists');
        const checklistsDaily: [{ date: Date, value: number }] = snapshot.get('checklists-daily');
        checklistsDaily.push({
          date: date,
          value: checklists
        });

        const users: number = snapshot.get('users');
        const usersDaily: [{ date: Date, value: number }] = snapshot.get('users-daily');
        usersDaily.push({
          date: date,
          value: users
        });

        reference
          .update({
            'checklists-daily': checklistsDaily,
            'users-daily': usersDaily
          })
          .then(_ => {
            response.status(200).end();
          })
      });
  } else {
    response.status(401).end();
  }
});
