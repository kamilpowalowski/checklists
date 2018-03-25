// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyATHqidejoBjg0_QHsPDGKOsdGbQPjgB8w',
    authDomain: 'dev.lizt.co',
    databaseURL: 'https://checklists-a558f.firebaseio.com',
    projectId: 'checklists-a558f',
    storageBucket: 'checklists-a558f.appspot.com',
    messagingSenderId: '929729499240'
  }
};
