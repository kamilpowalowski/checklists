// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAOOjobvFzapuiSAqaPB7J-jEvvlZmoQTA',
    authDomain: 'lizt.co',
    databaseURL: 'https://checklists-75c83.firebaseio.com',
    projectId: 'checklists-75c83',
    storageBucket: 'checklists-75c83.appspot.com',
    messagingSenderId: '513542089540'
  }
};
