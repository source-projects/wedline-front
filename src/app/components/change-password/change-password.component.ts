import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isSavingDetails:boolean = false;
  changePasswordForm: FormGroup;

  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    private fb:FormBuilder
  ) {
    this.changePasswordForm = this.fb.group({
      old_pass: ['', Validators.required],
      new_pass:['',Validators.required],
      cnfm_pass:['',Validators.required]
    }); 
   }

  ngOnInit(): void {
  }
  changePassword(){
    if(this.changePasswordForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("old_pass",this.changePasswordForm.get("old_pass")?.value);
      requestData.append("new_pass",this.changePasswordForm.get("new_pass")?.value);
      requestData.append("cnfm_pass",this.changePasswordForm.get("cnfm_pass")?.value);     
      this.loginService.changePassword(requestData).subscribe((res:any)=>{
        this.isSavingDetails = false;
        this.showSnackbar(res["errmessage"],true,"close");
      },error=>{
        this.isSavingDetails = false;
        this.showSnackbar("Connection error!",true,"close");
      });   
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }
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
