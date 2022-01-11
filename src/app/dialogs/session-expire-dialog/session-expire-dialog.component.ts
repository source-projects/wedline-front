import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-session-expire-dialog',
  templateUrl: './session-expire-dialog.component.html',
  styleUrls: ['./session-expire-dialog.component.css']
})
export class SessionExpireDialogComponent implements OnInit {
  isProccessing:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<SessionExpireDialogComponent>,
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) {  
   }

  ngOnInit(): void {
  }
  dismiss(isLogin:boolean){
    this.dialogRef.close(isLogin);
  }
  login(){
        this.isProccessing = true;
        let requestData = new FormData();             
        requestData.append("username",localStorage.getItem("wedlineMatriEmail") as string);
        requestData.append("password",localStorage.getItem("wedlineMatriPassword") as string);
        this.loginService.login(requestData).subscribe((res:any)=>{
          this.isProccessing = false;
          if(res["status"]=="success"){
            localStorage.setItem("profileStatus",res["user_data"]["profile_status"]);
            this.dismiss(true);
          }else{
            this.showSnackbar("Oops! something went wrong...",true,"close");
            this.dismiss(false);
          }
       },error=>{
           this.showSnackbar("Oops! something went wrong...",true,"close");
       });

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
