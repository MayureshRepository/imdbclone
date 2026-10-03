import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  dialog= inject(MatDialog);

  private dialogConfig(title: string): MatDialogConfig {
    return {
      width: '600px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'modern-dialog',
      autoFocus: false,
      data: { title }
    };
  }

  openAbout() {
    this.dialog.open(AboutComponent, this.dialogConfig('About Us'));
  }

  openContact() {
    this.dialog.open(ContactComponent, this.dialogConfig('Contact Us'));
  }

  openPrivacyPolicy() {
    this.dialog.open(PrivacypolicyComponent, this.dialogConfig('Privacy Policy'));
  }
}
