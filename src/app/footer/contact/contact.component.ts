import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {


    constructor(
      @Inject(MatDialogRef) public dialogRef: MatDialogRef<ContactComponent>
    ) {}
  
    contactForm = {
      name: '',
      email: '',
      message: ''
    };

    onSubmit  (): void {
      // Handle form submission logic here
      console.log('Form submitted:', this.contactForm);
      // Close the dialog after submission
      this.dialogRef.close();
    }
    
    onCancel(): void {
      this.dialogRef.close();
    }
  

    
}
