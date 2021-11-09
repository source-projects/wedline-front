import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 loginStatusSubscription:Subscription;
 profileStatusSubscription:Subscription;
 hasLoggedIn:boolean = false;
 profileStatus:string = "Subscribed";
 reloadMemberDataStatusSubscription:Subscription;
 messageReceptionStatusSubscription:Subscription;
 notificationReceptionStatusSubscription:Subscription;
 memberDetails:any = "";
 messages:any[] = [];
 notifications:any[] = [];
 isNoMessages:boolean = false;
 isGettingMessages:boolean = true;
 isNoNotifications:boolean = false;
 isGettingNotifications:boolean = true;
 unreadMessageCount:number = 0;
 unreadNotificationCount:number = 0;
  constructor(
    private loginService:LoginService,
    private router:Router,
    private snackBar:MatSnackBar
  ) {     
    this.loginStatusSubscription = this.loginService.getLoginSetStatus().subscribe(res=>{
      this.hasLoggedIn = res;
      this.getCsrfToken();
    }); 
    this.profileStatusSubscription = this.loginService.getProfileStatus().subscribe(res=>{
      this.profileStatus = res;
    });
    this.messageReceptionStatusSubscription = this.loginService.getMessageReceptionStatus().subscribe(res=>{
      if(this.hasLoggedIn&&res){
        this.getMessages();
      }
    }); 
    this.notificationReceptionStatusSubscription = this.loginService.getNotificationReceptionStatus().subscribe(res=>{
      if(this.hasLoggedIn&&res){
        this.getNotifications();
      }
    }); 
  }

  ngOnInit(): void {   
  }
  ngOnDestroy():void{
    this.loginStatusSubscription.unsubscribe();
    this.messageReceptionStatusSubscription.unsubscribe();
    this.notificationReceptionStatusSubscription.unsubscribe();
    this.profileStatusSubscription.unsubscribe();
  }
  getCsrfToken(){
    this.loginService.getCsrfToken().subscribe((res:any)=>{
      this.loginService.token = res["tocken"];
      this.loginService.generatedToken.next(true);
      if(this.hasLoggedIn){
        if(localStorage.getItem("profileStatus")){
          if(localStorage.getItem("profileStatus")=="Subscribed")
             this.getMyProfileDetails();
        }else{
          this.getMyProfileDetails();
        }
        this.getMessages();
        this.getNotifications();
      }
    },error=>{
      alert(error["message"]);
    });
  }
  logout(){
    this.loginService.logout().subscribe((res:any)=>{
        localStorage.setItem("matri","");
        localStorage.setItem("profileStatus","");
        this.loginService.hasLoggedIn.next(false);
        this.loginService.memberDetails = "";
        this.loginService.reloadMemberData.next(false);
        this.router.navigateByUrl("/login");    
   },error=>{
     this.showSnackbar("Connection error",true,"close");
   });  
  }
  getMyProfileDetails(){
    this.loginService.getMyProfile().subscribe((res:any)=>{
      console.log(res);
      if(res["status"]=="success"){
         this.memberDetails = res["data"];
         this.loginService.memberDetails = res["data"];
         this.loginService.reloadMemberData.next(true);
      }else{
        this.showSnackbar(res["errmessage"],true,"close");
      }
   },error=>{
     this.showSnackbar("Connection Error!",true,"close");
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
  getMessages(){
    this.isNoMessages = false;
    this.isGettingMessages = true;
    let requestData = new FormData();
    requestData.append("mode","inbox");
    requestData.append("nav","Yes");
    this.loginService.getMessages(requestData,1,10).subscribe((res:any)=>{
      this.messages = [];
      this.isGettingMessages = false;
      if(res["status"]=="success"){
        this.unreadMessageCount = res["total_count"];        
        this.messages = res["data"];
      }else{
        this.unreadMessageCount = 0;
        this.isNoMessages = true;
      }
    },error=>{
      this.isNoMessages = false;
      this.showSnackbar("Connection error!",true,"close");    
    }); 
  }
  getNotifications(){
    this.isNoNotifications = false;
    this.isGettingNotifications = true;
    let requestData = new FormData();
    requestData.append("nav","Yes");
    this.loginService.getNotifications(requestData,1,10).subscribe((res:any)=>{
      this.notifications = [];
      this.isGettingNotifications = false;
      if(res["status"]=="success"){
        this.unreadNotificationCount = res["total_count"];        
        this.notifications = res["data"];
      }else{
        this.unreadNotificationCount = 0;
        this.isNoNotifications = true;
      }
    },error=>{
      this.isNoNotifications = false;
      this.showSnackbar("Connection error!",true,"close");    
    }); 
  }
  continueRegisterProcess(){
    switch(this.profileStatus){
      case "Started":{
        this.router.navigateByUrl("/plans");
        break;
      }
      case "Registered":{
        this.router.navigateByUrl("/profile-starter");
        break;
      }
    }
  }
}
