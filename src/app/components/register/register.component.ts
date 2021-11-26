import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import * as _moment from 'moment';
import { Subscription } from 'rxjs';
const moment = _moment;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  countryCodes:any[] = [];
  castes:any[] = [];
  isProccessing:boolean = false;

  minDate = new Date(1956, 0, 1);
  maxDate = new Date(2003, 11, 31);
  @ViewChild('terms') terms:ElementRef;
  signupForm:FormGroup;
  date = moment();

  selDate: string;
  selDay: string;
  selMonth: string;
  selYear: string;
  generatedTokenStatusSubscription:Subscription;
  constructor(
    private loginService:LoginService,
    private router:Router,
    private fb:FormBuilder,
    private snackBar:MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      gender:['Male',Validators.required],
      email:['',[Validators.required,Validators.email]],
      country_code:['',Validators.required],
      mobile_number:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
      password:['',Validators.required],
      rePassword:['',Validators.required],
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      dateOfBirth:['',Validators.required],
      caste:['',Validators.required]
    }); 
    if(this.loginService.homeRegisterData){
      this.signupForm.patchValue(this.loginService.homeRegisterData);
    }  
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getMobileCountryCode();
        this.getCasteList();
      }
    });      
   }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.generatedTokenStatusSubscription.unsubscribe();
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.date = moment(event.value);
    this.selDate = this.date.format('DD');
    this.selDay = this.date.format('dddd');
    this.selMonth = this.date.format('MM');
    this.selYear = this.date.format('YYYY');
  }
  onSubmit(termsStatus:any){
      if(this.signupForm.valid){
        if(this.signupForm.get("password")?.value==this.signupForm.get("rePassword")?.value){
          if(termsStatus){
            this.isProccessing = true;
              let requestData = new FormData();             
              requestData.append("gender",this.signupForm.get("gender")?.value);
              requestData.append("email",this.signupForm.get("email")?.value);
              requestData.append("country_code",this.signupForm.get("country_code")?.value);
              requestData.append("mobile_number",this.signupForm.get("mobile_number")?.value);
              requestData.append("password",this.signupForm.get("password")?.value);
              requestData.append("firstname",this.signupForm.get("firstname")?.value);
              requestData.append("lastname",this.signupForm.get("lastname")?.value);
              requestData.append("caste",this.signupForm.get("caste")?.value);
              requestData.append("terms",termsStatus?"Yes":"No");
              requestData.append("birthdate",this.selYear+"-"+this.selMonth+"-"+this.selDate);
              this.register(requestData);
          }else{
            this.showSnackbar("Please agree to terms and conditions",true,"okay");
          }        
        }else{
          this.showSnackbar("Passwords don't match",true,"okay");
        }      
      }else{
        this.showSnackbar("Please check all required fields",true,"okay");
      }
  }

  getMobileCountryCode(){
    this.loginService.getMobileCountryCode().subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.countryCodes = res["data"];
        this.countryCodes.shift();
      }
    },error=>{
      alert(error["message"]);
    })
 }
 
 getCasteList(){
    this.loginService.getDropdownList("caste_list","30",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.castes = res["data"];
        this.castes.shift();
      }
    },error=>{
      alert(error["message"]);
    });
 }

 register(data:any){
  this.loginService.registerStarter(data).subscribe((res:any)=>{
    this.isProccessing = false;
     if(res["status"]=="success"){
      localStorage.setItem("matri","1234");
      localStorage.setItem("profileStatus","Registered");
      this.loginService.hasLoggedIn.next(true);
      this.loginService.profileStatus.next("Registered");
      this.router.navigateByUrl("/profile-starter");
     }else{
       this.showSnackbar(res["errmessage"],true,"close");
     }
  },error=>{
    this.showSnackbar("Connection error",true,"close");
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
