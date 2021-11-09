import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  captchaCode:string;
  loginForm:FormGroup;
  isProccessing:boolean = false;
  constructor(
    private router:Router,
    private loginService:LoginService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
  ) { 
    this.captchaCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.loginForm = this.fb.group({
      email:['',[Validators.required]],    
      password:['',Validators.required],     
      captcha:['',Validators.required]
    });  
  }

  ngOnInit(): void {
  }
  login(){
    if(this.loginForm.valid){
      if(this.loginForm.get("captcha")?.value==this.captchaCode){
        this.isProccessing = true;
        let requestData = new FormData();             
        requestData.append("username",this.loginForm.get("email")?.value);
        requestData.append("password",this.loginForm.get("password")?.value);

        this.loginService.login(requestData).subscribe((res:any)=>{
          this.isProccessing = false;
          if(res["status"]=="success"){
           localStorage.setItem("matri","1234");
           localStorage.setItem("profileStatus","Subscribed");
           this.loginService.hasLoggedIn.next(true);
           this.router.navigateByUrl("/dashboard");
          }else{
            this.showSnackbar(res["errmessage"],true,"close");
          }
       },error=>{
         this.showSnackbar("Internal Server error",true,"close");
       });

      }else{
        this.showSnackbar("Wrong captcha",true,"okay");
      }
    }else{
      this.showSnackbar("Please check all required fields",true,"okay");
    }
  }
  refreshCaptcha(){
    this.captchaCode =  Math.floor(100000 + Math.random() * 900000).toString();
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
