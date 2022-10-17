import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {  
  username: string;

  constructor(public ref: MatDialogRef<SigninComponent>) { }
  
  disableClick():boolean {
    return !this.username || this.username.length <= 0;
  }
}
