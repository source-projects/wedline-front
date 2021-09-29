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
 hasLoggedIn:boolean = false;
 reloadMemberDataStatusSubscription:Subscription;
 memberDetails:any = "";
  constructor(
    private loginService:LoginService,
    private router:Router,
    private snackBar:MatSnackBar
  ) {     
    this.loginStatusSubscription = this.loginService.getLoginSetStatus().subscribe(res=>{
      this.hasLoggedIn = res;
      this.getCsrfToken();
    }); 
  }

  ngOnInit(): void {   
  }
  ngOnDestroy():void{
    this.loginStatusSubscription.unsubscribe();
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
      }
    },error=>{
      alert(error["message"]);
    });
  }
  logout(){
    this.loginService.logout().subscribe((res:any)=>{
        localStorage.setItem("matri","");
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
}
