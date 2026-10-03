import { Component, inject } from '@angular/core';
import { ClickEffectsService } from './service/click-effects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'imdbclone';

  constructor() {
    inject(ClickEffectsService).init();
  }
}
