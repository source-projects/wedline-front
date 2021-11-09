import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.css']
})
export class ComposeMessageComponent implements OnInit {
  isProcessing:boolean = false;
  messageForm:FormGroup;
  isMemberIdValid:boolean = true;
  gender:string = null as any;
  reloadMemberDataStatusSubscription:Subscription;
  memberDetails:any = "";
  constructor(
    private fb:FormBuilder,
    public dialogRef: MatDialogRef<ComposeMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public memberId: any,
    private snackBar:MatSnackBar,
    private loginService:LoginService
  ) {    
    this.messageForm = this.fb.group({
      toId: ['', Validators.required],
      toName:['',Validators.required],
      message:['',Validators.required]     
    }); 
    this.reloadMemberDataStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
      if(res){
        this.gender = this.loginService.memberDetails.gender=="Male"?"Female":"Male";
      }
    });
    if(this.memberId){
      this.messageForm.get("toId")?.setValue(this.memberId);
      this.checkMemberId();
    }
   }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.reloadMemberDataStatusSubscription.unsubscribe();
   }
  dismiss(isSend:boolean){
    this.dialogRef.close(isSend);
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  composeMessage(){
    if(this.messageForm.valid&&this.isMemberIdValid){
      this.isProcessing = true;
      let requestData = new FormData();
      requestData.append("msg_status","sent");
      requestData.append("message",this.messageForm.get("message")?.value);
      requestData.append("receiver_id",this.messageForm.get("toId")?.value);
      this.loginService.composeMessage(requestData).subscribe((res:any)=>{
        this.isProcessing = false;
        if((res["status"]=="success")){  
          this.dismiss(true);      
        }
        this.showSnackbar(res["errmessage"],true,"close");
      },error=>{
        this.isProcessing = false;
        this.showSnackbar("Connection error!",true,"close");    
      });
    }else{
      this.showSnackbar("Please check all required fields",true,"okay");
    }    
  }
  checkMemberId(){   
      if(this.gender&&this.messageForm.get("toId")?.valid){
        this.isProcessing = true;
        this.messageForm.get("toId")?.setValue(String(this.messageForm.get("toId")?.value).toUpperCase().trim());
        let requestData = new FormData();
        requestData.append("type",this.gender);
        requestData.append("matri_id",this.messageForm.get("toId")?.value);
        this.loginService.checkIfMemberExistsById(requestData).subscribe((res:any)=>{
          this.isProcessing = false;
           if(res["status"]=="success"){
             this.messageForm.get("toName")?.setValue(res["username"]);
             this.isMemberIdValid = true;
           }else{
             this.messageForm.get("toName")?.setValue("");
             this.showSnackbar(res["username"],true,"close");
             this.isMemberIdValid = false;
           }
        },error=>{
          this.isProcessing = false;
          this.isMemberIdValid = true;
          this.messageForm.get("toName")?.setValue("");
          this.showSnackbar("Connection error",true,"close");
        });
      }     
  }
}
