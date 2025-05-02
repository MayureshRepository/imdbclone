import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  openAbout() {
    this.dialog.open(AboutComponent, {
      width: '600px',
      height: '600px',
      data: { title: 'About Us' }
    });
  }


  openContact() {
    this.dialog.open(ContactComponent, {
      width: '600px',
      height: '500px',
      data: { title: 'Contact Us' }
    });
  }

  openPrivacyPolicy() {
    this.dialog.open(PrivacypolicyComponent, {
      width: '600px',
      height: '600px',
      data: { title: 'Privacy Policy' }
    }); 

  }



}
