import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
  } from '@angular/core';
import * as SimpleMDE from 'simplemde';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss']
})
export class MarkdownEditorComponent implements OnInit {
  @Input() placeholder: string;
  @Input() initialValue: string | null;

  @ViewChild('textarea') textarea: ElementRef;

  constructor() { }

  ngOnInit() {
    const mardownEditor = new SimpleMDE({
      element: this.textarea.nativeElement.value,
      hideIcons: ['side-by-side', 'fullscreen'],
      placeholder: this.placeholder,
      initialValue: this.initialValue,
      status: false
    });
  }

}
