import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-interest-messages',
  templateUrl: './interest-messages.component.html',
  styleUrls: ['./interest-messages.component.css']
})
export class InterestMessagesComponent implements OnInit {
  messageControl:FormControl;
  constructor(
    public dialogRef: MatDialogRef<InterestMessagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar:MatSnackBar
  ) {
    this.messageControl = new FormControl("I am interested in your profile. Please Accept if you are interested.",Validators.required);
   }

  ngOnInit(): void {
  }
  send(){
      if(this.messageControl.valid){
        this.dialogRef.close(this.messageControl.value);
      }else{
        this.showSnackbar("Select a message to send",true,"okay");
      }
  }
  dismiss(){
    this.dialogRef.close(null);
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
}
