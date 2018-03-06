import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  ViewChild
  } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TdTextEditorComponent } from '@covalent/text-editor';

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ]
})
export class MarkdownEditorComponent implements ControlValueAccessor, OnInit {
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

  writeValue(obj: any): void {
    this.textEditor.writeValue(obj);
    this.textEditor.textarea.nativeElement.value = obj;
  }

  registerOnChange(fn: any): void {
    this.textEditor.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.textEditor.registerOnTouched(fn);
  }

}
