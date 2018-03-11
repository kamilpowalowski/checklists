import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';

@Component({
  selector: 'app-theme-switcher',
  styleUrls: ['./theme-switcher.component.scss'],
  templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent implements OnInit {
  theme: NbJSThemeOptions;

  constructor(private themeService: NbThemeService) { }

  ngOnInit() {
    this.themeService.getJsTheme()
      .subscribe((theme: NbJSThemeOptions) => this.theme = theme);
  }

  toggleTheme() {
    const name = this.isCosmicTheme() ? 'default' : 'cosmic';
    window.localStorage.setItem('selected-theme', name);
    this.themeService.changeTheme(name);
  }

  isCosmicTheme(): boolean {
    return this.theme.name === 'cosmic';
  }
}
