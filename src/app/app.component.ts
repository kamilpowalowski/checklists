import { Component, OnInit } from '@angular/core';
import { AccountService } from './shared/account.service';
import * as EmojiOne from 'emojione';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    EmojiOne.emojiSize = '64';
  }
}
