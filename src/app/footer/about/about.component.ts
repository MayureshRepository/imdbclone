import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AboutComponent>
  ) {}

  
  onCancel(): void {
    this.dialogRef.close();
  }


}
