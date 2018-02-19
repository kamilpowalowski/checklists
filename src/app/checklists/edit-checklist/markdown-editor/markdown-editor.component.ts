import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild
  } from '@angular/core';
import { TdTextEditorComponent } from '@covalent/text-editor';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss']
})
export class MarkdownEditorComponent implements OnInit {
  @Input() placeholder: string;
  @Input() initialValue: string | null;

  @ViewChild('textEditor') private textEditor: TdTextEditorComponent;

  options: any = {
    hideIcons: ['side-by-side', 'fullscreen'],
    placeholder: this.placeholder,
    status: false
  };

  constructor() { }

  ngOnInit() {
    this.textEditor.textarea.nativeElement.placeholder = this.placeholder;
  }

}
