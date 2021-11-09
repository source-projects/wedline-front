import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-read-message',
  templateUrl: './read-message.component.html',
  styleUrls: ['./read-message.component.css']
})
export class ReadMessageComponent implements OnInit {
  isProcessing:boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ReadMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public messageObject: any,
    private snackBar:MatSnackBar,
    private loginService:LoginService
  ) {
      if(this.messageObject.mode=="sent"){
        this.isProcessing = false;
      }else{
        this.readMessage();
      }
   }

  ngOnInit(): void {
  }
  dismiss(){
    this.dialogRef.close(!this.isProcessing);
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  readMessage(){
    let requestData = new FormData();
    requestData.append("mode",this.messageObject.mode);
    requestData.append("status","read");
    requestData.append("selected_val",this.messageObject.id);
    this.loginService.updateMessageStatus(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        this.isProcessing = false;      
      }else{
        this.showSnackbar(res["errmessage"],true,"close");
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");    
    });
  }
}
