import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.css'
})
export class PrivacypolicyComponent {


    constructor(
      @Inject(MatDialogRef) public dialogRef: MatDialogRef<PrivacypolicyComponent>
    ) {}
  
    
    onCancel(): void {
      this.dialogRef.close();
    }
  

    
}
