import { ChecklistItem } from './checklist-item.model';
import { Checklist } from './checklist.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class ChecklistService {

  private exampleChecklist = new Checklist(
    'Deploy Angular 4 App to Firebase using Travis CI',
    'This tutorial shows how to deploy OSS Angular 4 app from github to Firebase using Travis CI',
    [
      new ChecklistItem(
        'Active Travis CI',
        null,
        [
          new ChecklistItem('Turn on your project on Travis CI', null, null),
          new ChecklistItem('Select `build only if .travis.yml is pressent` from settings', null, null)
        ]
      ),
      new ChecklistItem(
        'Add `.travis.yml` to project',
        'fill it with:\n' +
        '\n' +
        'Inline `code` has `back-ticks around` it.\n' +
        '\n' +
        '```yaml\n' +
        'language: node_js\n' +
        'node_js:\n' +
        '  - node\n' +
        '\n' +
        'branches:\n' +
        '  only:\n' +
        '      - master # will only build for master branch commits\n' +
        '\n' +
        'before_script:\n' +
        '  - npm install -g --silent firebase-tools # installs firebase to run firebase deploy\n' +
        '  - npm install -g --silent @angular/cli\n' +
        '\n' +
        'script:\n' +
        '  - ng build --prod\n' +
        '\n' +
        'after_success:\n' +
        '  - firebase deploy --token $FIREBASE_TOKEN --non-interactive # firebase deploy after angular-cli build\n' +
        '\n' +
        'notifications:\n' +
        '  email:\n' +
        '    on_failure: change\n' +
        '    on_success: change\n' +
        '```',
        null
      ),
      new ChecklistItem('Obtain FIREBASE_TOKEN', null, [
        new ChecklistItem('Install firebase CLI', '`npm install -g firebase-tools`', null),
        new ChecklistItem('Call `firebase login:ci` from command line', null, null)
      ]),
      new ChecklistItem(
        'Add new Enviromental variable to Travis CI',
        'call it FIREBASE_TOKEN, as value put token returned from `firebase login:ci`',
        null
      )
    ]
  );

  constructor() { }

  getChecklist(id: string): Observable<Checklist> {
    return Observable.of(this.exampleChecklist);
  }
}
