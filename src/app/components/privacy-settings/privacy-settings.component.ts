import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.css']
})
export class PrivacySettingsComponent implements OnInit {
  isSavingDetails:boolean = true;
  photoControl:FormControl;
  contactControl:FormControl;
  reloadMemberDataStatusSubscription:Subscription;
  memberDetails:any = "";
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) {
    this.photoControl = new FormControl("1",Validators.required);
    this.contactControl = new FormControl("1",Validators.required);
    this.reloadMemberDataStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
      if(res){
        this.memberDetails = this.loginService.memberDetails;
        this.photoControl.setValue(this.memberDetails.photo_view_status);
        this.contactControl.setValue(this.memberDetails.contact_view_security);
        this.isSavingDetails = false;
      }
    });  
  }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.reloadMemberDataStatusSubscription.unsubscribe();
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }

  changePrivacy(privacyType:string){
    this.isSavingDetails = true;
    const requestData = new FormData();
    requestData.append('user_agent', "NI-AAPP");
    if(privacyType === "photo_view_status"){
      requestData.append('photo_view_status',this.photoControl.value);
    }else{
      requestData.append('contact_view_security',this.contactControl.value);
    }
    this.loginService.changePrivacySetting(requestData,privacyType).subscribe((res:any)=>{
    this.isSavingDetails = false;
    console.log(res);
    if(res["status"]==="success"){
      this.loginService.hasLoggedIn.next(true);
    }  
    this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.isSavingDetails = false;
    this.showSnackbar("Connection error!",true,"close");
  }); 
  }
}
