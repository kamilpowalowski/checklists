import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as consts from '../firebase.consts';
import { ChecklistItem } from './../models/checklist-item.model';
import { Checklist } from './../models/checklist.model';
import { AccountService } from './account.service';
import { ChecklistService } from './checklist.service';


@Injectable()
export class TutorialChecklistService {

  constructor(
    private firestore: AngularFirestore,
    private accountService: AccountService,
    private checklistService: ChecklistService
  ) { }

  createTutorialChecklistIfNeeded(): Observable<string> {
    const id = this.accountService.profile.getValue().account.id;
    const reference = this.firestore
      .collection(consts.ACCOUNTS_COLLECTION)
      .doc(id);

    return Observable.fromPromise(reference.ref.get())
      .take(1)
      .filter(snapshot => snapshot.get('tutorial-created') !== true)
      .mergeMap(_ => this.checklistService.storeChecklist(this.generate(id)))
      .mergeMap(checklistId => {
        return Observable.fromPromise(
          reference.set({ 'tutorial-created': true }, { merge: true })
        )
          .map(_ => checklistId);
      });
  }

  private generate(owner: string): Checklist {
    return new Checklist(null, owner, new Date(),
      'Hello 👋, I\'m your first checklist, click on me now 👈',
      'I\'m here to explain to you how **lizt.co** works. Read points below and in a minute or two, you will be a checklists master.',
      ['tutorial'],
      false,
      Observable.of([
        new ChecklistItem(null, 0,
          'Every item has a checkbox. Click on it to mark item selected.',
          'Don\'t be afraid, do it now.',
          []
        ),
        new ChecklistItem(null, 1,
          'That was easy, right? Items may have subitems.',
          null,
          [
            new ChecklistItem(null, 0, 'you can select them separately...', null, []),
            new ChecklistItem(null, 1, '...but...', null, []),
            new ChecklistItem(null, 2, '...you can also select all of them at once by selecting a checkbox on the parent item.', null, [])
          ]),
        new ChecklistItem(null, 2,
          'On the bottom, you can find a Checklist owner menu.',
          '**EDIT** button allows editing a checklist.\n\n' +
          '**PUBLISH** makes a checklist public (check **Public checklists** section in the Main menu).\n\n' +
          '**SHARE** allows you to share a checklist. People with a link can view and use the checklist, even if it is not public.\n\n' +
          '**DELETE** will remove a checklist. You can use this to delete this checklist after finishing this tutorial.',
          []),
        new ChecklistItem(null, 3,
          'When you browsing checklists made by others, on the bottom you\'ll find Checklist menu',
          '**SHARE** allows you to share a checklist. People with a link can view and use the checklist, even if it is not public.\n\n' +
          '**SAVE** will add a checklist to your *saved* list. (You can find it under **My checklists** in the Main menu)\n\n' +
          '**REPORT** will inform **lizt.co** creator about an inappropriate checklist. Use this button if you found something that shouldn\'t be public.',
          []),
        new ChecklistItem(null, 4,
          'Congratulation to finishing "Using Checklist 101" 🎉',
          null, []),
        new ChecklistItem(null, 5,
          'Time to dive into checklist creation process.',
          'Press **EDIT** button on the bottom, and then scroll to this point on the edit page to continue reading.', []),
        new ChecklistItem(null, 6,
          'As you can see, edit page looks quite different.',
          null,
          [
            new ChecklistItem(null, 0,
              'On the top you can edit title, tags and description, then all items and subitems are listed.',
              null, []),
            new ChecklistItem(null, 1,
              'On the bottom, "SAVE AND QUIT" and "DISCARD" buttons are visible.',
              'Don\'t forget to save a checklist after edition.',
              []),
          ]),
        new ChecklistItem(null, 7,
          'Let\'s talk about tags.',
          'Tags are used instead of catalogue structure.\n\n' +
          'Add some tags to your checklist to easily find it on **My checklists** page.',
          []),
        new ChecklistItem(null, 8,
          'Checklist description field and descriptions of items/subitems supports Markdown',
          'If you don\'t know what *Markdown* is, don\'t worry. They also have simple rich text editing using buttons above 👆.\n\n' +
          'BTW: Syntax highlighting for few popular languages is also supported:\n' +
          '```javascript\n' +
          'alert("Hello! I am an alert box!!");\n' +
          '```',
          [
            new ChecklistItem(null, 0,
              'To add a description to item or subitem use notes button on the right 👉',
              null, [])
          ]),
        new ChecklistItem(null, 9,
          'You can add a new item using big "ADD ITEM" button above "SAVE AND QUIT" and "DISCARD" buttons.',
          null,
          [
            new ChecklistItem(null, 0,
              'To add a subitem press "ADD SUBITEM" button bellow specific item.',
              null, []),
            new ChecklistItem(null, 1,
              'You could also change an order of elements using buttons with arrows below every item/subitem.',
              null, [])
          ]),
        new ChecklistItem(null, 10,
          'Deleting item/subitem is also very easy. Press red trash button on the element that you want to remove.',
          null, []),
        new ChecklistItem(null, 11,
          'And that\'s all. You are now ready to use lizt.co 🎉🎆🎉',
          'Play with this checklist, modify it. And when you have enough, you can press SAVE AND QUIT.\n\n' +
          'Thank you for your time, I hope you will have a great time using **lizt.co**',
          [])
      ]),
    );
  }
}
