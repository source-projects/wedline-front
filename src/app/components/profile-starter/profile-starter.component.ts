import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImageCropperComponent } from 'src/app/dialogs/image-cropper/image-cropper.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile-starter',
  templateUrl: './profile-starter.component.html',
  styleUrls: ['./profile-starter.component.css']
})
export class ProfileStarterComponent implements OnInit {
 @ViewChild("stepper") stepper:MatStepper;
 basicInfoForm: FormGroup;
 educationQualificationForm: FormGroup;
 foodLifeForm: FormGroup;
 aboutMeForm: FormGroup;

 isCompletedBasic:boolean = false;
 isCompletedEducation:boolean = false;
 isCompletedLife:boolean = false;
 isCompletedAbout:boolean = false;
 isCompletedProfile:boolean = false;

 isSavingDetails:boolean = false;
 isUploading:boolean = false;

 profileProgress:number = 0;

 profilePreview:any[] = [];

 profileFile:File;

 countries:any[] = [];
 states:any[] = [];
 cities:any[] = [];
 languages:any[] = [];
 streams:any[] = [];
 occupations:any[] = [];
 designations:any[] = [];

 generatedTokenStatusSubscription:Subscription;
 constructor(
   private loginService:LoginService,
   private snackBar:MatSnackBar,
   private fb:FormBuilder,
   public dialog: MatDialog,
   private cdr:ChangeDetectorRef,
   private router:Router
 ) {  
   this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
    if(res){
      this.getCountries();
      this.getLanguages();
      this.getStreams();
      this.getOccupations();
      this.getDesignations();
    }
  }); 
  }

 ngOnInit(): void {
   this.basicInfoForm = this.fb.group({
    country_id: ['', Validators.required],
    state_id:['',Validators.required],
    city:['',Validators.required],
    marital_status:['',Validators.required],
    total_children:['',Validators.required],
    status_children:['',Validators.required],
    mother_tongue:['',Validators.required],
    looking_for:['',Validators.required],
    part_frm_age:['',Validators.required],
    part_to_age:['',Validators.required],
    part_height:['',Validators.required],
    part_height_to:['',Validators.required]
   });  
   this.educationQualificationForm = this.fb.group({
    education_detail: ['', Validators.required],
    education_in_detail:[''],
    employee_in:['',Validators.required],
    income:['',Validators.required],
    occupation:['',Validators.required],
    designation:['',Validators.required]    
   });
   this.foodLifeForm = this.fb.group({
    height: ['', Validators.required],
    weight:['',Validators.required],
    diet:['',Validators.required],
    smoke:['',Validators.required],
    drink:['',Validators.required],
    bodytype:['',Validators.required],
    complexion:['',Validators.required]   
   });
   this.aboutMeForm = this.fb.group({
    aboutemedemo: ['', Validators.required],
    hobby:['',Validators.required]   
  });
 }
 ngOnDestroy():void{
  this.generatedTokenStatusSubscription.unsubscribe();
 }  
 showSnackbar(content:string,hasDuration:boolean,action:string){
   const config = new MatSnackBarConfig();
   if(hasDuration){
     config.duration = 3000;
   }
   config.panelClass = ['snackbar-styler'];
   return this.snackBar.open(content, action, config);
 }
 
getCountries(){
  this.loginService.getDropdownList("country_list","",false).subscribe((res:any)=>{
    if(res["status"]=="success"){
      this.countries = res["data"];
      this.countries[0].id = "";
      this.countries[0].val = "Select Country";
    }
  },error=>{
    alert(error["message"]);
  });
}
getStates(){
  if(this.basicInfoForm.get("country_id")?.valid){
    this.loginService.getDropdownList("state_list",this.basicInfoForm.get("country_id")?.value,false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.states = res["data"];
        this.states[0].id = "";
        this.states[0].val = "Select State";
      }
    },error=>{
      alert(error["message"]);
    });
  }  
}
  getCities(){
    if(this.basicInfoForm.get("state_id")?.valid){
      this.loginService.getDropdownList("city_list",this.basicInfoForm.get("state_id")?.value,false).subscribe((res:any)=>{
        if(res["status"]=="success"){
          this.cities = res["data"];
          this.cities[0].id = "";
          this.cities[0].val = "Select City";
        }
      },error=>{
        alert(error["message"]);
      });
    }
  }
  getLanguages(){
    this.loginService.getDropdownList("mothertongue_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.languages = res["data"];
        this.languages[0].id = "";
        this.languages[0].val = "Select Language";
      }
    },error=>{
      alert(error["message"]);
    });
  }
  getStreams(){
    this.loginService.getDropdownList("education_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.streams = res["data"];
        this.streams[0].id = "";
        this.streams[0].val = "Select Education";
      }
    },error=>{
      alert(error["message"]);
    });
  }
  getOccupations(){
    this.loginService.getDropdownList("occupation_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.occupations = res["data"];
        this.occupations[0].id = "";
        this.occupations[0].val = "Select Occupations";
      }
    },error=>{
      alert(error["message"]);
    });
  }
  getDesignations(){
    this.loginService.getDropdownList("designation_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.designations = res["data"];
        this.designations[0].id = "";
        this.designations[0].val = "Select Designations";
      }
    },error=>{
      alert(error["message"]);
    });
  }
  toggleChidrenInputs(){
    if(this.basicInfoForm.get("marital_status")?.value!="Unmarried"&&this.basicInfoForm.get("marital_status")?.value!=""){
      this.basicInfoForm.get("total_children")?.setValidators([Validators.required]);
      this.basicInfoForm.get("status_children")?.setValidators([Validators.required]);  
    } else {
      this.basicInfoForm.get("total_children")?.setValidators(null);
      this.basicInfoForm.get("status_children")?.setValidators(null);      
    }
    this.basicInfoForm.get("total_children")?.updateValueAndValidity();
    this.basicInfoForm.get("status_children")?.updateValueAndValidity();
  }
 basicInfoFormSubmit(){
   if(this.basicInfoForm.valid){
       this.showSnackbar("Saving details...",false,"");
       this.isSavingDetails = true;
       let requestData = new FormData();
       requestData.append("country_id",this.basicInfoForm.get("country_id")?.value);
       requestData.append("state_id",this.basicInfoForm.get("state_id")?.value);
       requestData.append("city",this.basicInfoForm.get("city")?.value);
       requestData.append("marital_status",this.basicInfoForm.get("marital_status")?.value);
       requestData.append("mother_tongue",this.basicInfoForm.get("mother_tongue")?.value);
       requestData.append("looking_for[]",this.basicInfoForm.get("looking_for")?.value.join(','));
       requestData.append("part_frm_age",this.basicInfoForm.get("part_frm_age")?.value);
       requestData.append("part_to_age",this.basicInfoForm.get("part_to_age")?.value);
       requestData.append("part_height",this.basicInfoForm.get("part_height")?.value);
       requestData.append("part_height_to",this.basicInfoForm.get("part_height_to")?.value);
       if(this.basicInfoForm.get("marital_status")?.value!="Unmarried"){
          requestData.append("total_children",this.basicInfoForm.get("total_children")?.value);
          requestData.append("status_children",this.basicInfoForm.get("status_children")?.value);
       }
       requestData.append("user_agent","NI-AAPP");
       requestData.append("is_post","0");


       this.registerSteps(requestData,"step1"); 
     }else{
       this.showSnackbar("Please fill all required fields",true,"okay");
     }       
 }

 educationQualificationFormSubmit(){
  if(this.educationQualificationForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingDetails = true;

      let requestData = new FormData();
      requestData.append("employee_in",this.educationQualificationForm.get("employee_in")?.value);
      requestData.append("education_in_detail",this.educationQualificationForm.get("education_in_detail")?.value);
      requestData.append("income",this.educationQualificationForm.get("income")?.value);
      requestData.append("occupation",this.educationQualificationForm.get("occupation")?.value);
      requestData.append("designation",this.educationQualificationForm.get("designation")?.value);
      requestData.append("education_detail[]",this.educationQualificationForm.get("education_detail")?.value.join(','));     
     
      requestData.append("user_agent","NI-AAPP");
      requestData.append("is_post","0");

      this.registerSteps(requestData,"step2");      
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }       
}

foodLifeFormSubmit(){
  if(this.foodLifeForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingDetails = true;

      let requestData = new FormData();
      requestData.append("height",this.foodLifeForm.get("height")?.value);
      requestData.append("weight",this.foodLifeForm.get("weight")?.value);
      requestData.append("diet",this.foodLifeForm.get("diet")?.value);
      requestData.append("smoke",this.foodLifeForm.get("smoke")?.value);
      requestData.append("drink",this.foodLifeForm.get("drink")?.value);
      requestData.append("bodytype",this.foodLifeForm.get("bodytype")?.value);
      requestData.append("complexion",this.foodLifeForm.get("complexion")?.value);
      requestData.append("user_agent","NI-AAPP");
      requestData.append("is_post","0");

      this.registerSteps(requestData,"step3");
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }       
}

aboutMeFormSubmit(){
  if(this.aboutMeForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("hobby",this.aboutMeForm.get("hobby")?.value);
      requestData.append("aboutemedemo",this.aboutMeForm.get("aboutemedemo")?.value);
      if(this.aboutMeForm.get("aboutemedemo")?.value.length>20){
        requestData.append("profile_text",this.aboutMeForm.get("aboutemedemo")?.value.substring(0,20));
      }else{
        requestData.append("profile_text",this.aboutMeForm.get("aboutemedemo")?.value);
      }
      requestData.append("user_agent","NI-AAPP");
      requestData.append("is_post","0");

      this.registerSteps(requestData,"step4"); 


      // subcaste: Hehehe
      // manglik: Do not know
      // star: 7
      // horoscope: Do not know
      // gothra: sdfsdf
      // moonsign: 11
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }       
}
 onProfileSelect(event:any){
     this.profileFile = event.target.files[0];
     if(this.profileFile){  
       this.openImageCropper(event);
     }
 }

 uploadProfilePic(fileEvent:any,cropImage:any){
   this.isUploading =true;
   this.showSnackbar("Please be patient! uploading profile pic...",true,"okay");
   const uploadData = new FormData();
   uploadData.append('photo_number', "1");
   uploadData.append('user_agent',"NI-AAPP");
   uploadData.append('is_ajax', "1");
   uploadData.append('profil_photo', new File([cropImage], "crop-image.png",{type:"mime", lastModified:new Date().getTime()}));
   uploadData.append('profile_photo_org', this.profileFile);

   this.loginService.registerSteps(uploadData,"step5").subscribe((event:any) => {
     switch (event.type) {
       case HttpEventType.Sent:
         this.profilePreview = [];
         this.profileProgress = 1;
         break;
       case HttpEventType.ResponseHeader:
         break;
       case HttpEventType.UploadProgress:
         this.profileProgress = Math.round(event.loaded / event.total * 100);
         break;
       case HttpEventType.Response:
         this.isUploading = false;
         if(event.body["status"]=="success"){
           this.showSnackbar(event.body["errmessage"],true,"close");            
           this.profileFile = null as any;
           var reader = new FileReader();   
           reader.onload = (event:any) => {
             this.profilePreview.push(event.target.result);  
           } 
           reader.readAsDataURL(fileEvent.target.files[0]);
         }else{
           this.showSnackbar(event.body["errmessage"],true,"close");
         }
         setTimeout(() => {
           this.profileProgress = 0;
         }, 1500);
         break;
       default:
         this.profileProgress = 0;
         return `Unhandled event: ${event.type}`;
     }
   },error=>{
       this.profileProgress = 0;
       this.isUploading = false;
       this.showSnackbar("Connection Error!",true,"close");
   }); 
}
saveStatusAndRedirect(){
  this.isCompletedProfile = true;
  this.cdr.detectChanges();
  this.router.navigateByUrl("/plans");
}
  registerSteps(formData:FormData,steps:string){
        this.loginService.registerSteps(formData,steps).subscribe((res:any)=>{
        this.isSavingDetails = false;
        this.showSnackbar(res["errmessage"],true,"close");
        switch(steps){
          case "step1":{
            this.isCompletedBasic = true;
            break;
          }
          case "step2":{
            this.isCompletedEducation = true;
            break;
          }
          case "step3":{
            this.isCompletedLife = true;
            break;
          }
          case "step4":{
            this.isCompletedAbout = true;
            localStorage.setItem("wedlineMatriChristianProfileStatus","Started");
            this.loginService.profileStatus.next("Started");
            break;
          }
        }
        this.cdr.detectChanges();
        this.stepper.next();
      },error=>{
        this.isSavingDetails = false;
        this.showSnackbar("Connection error!",true,"close");
      });     
  }

  openImageCropper(event:any){
    const dialogRef = this.dialog.open(ImageCropperComponent,{
      data:{
        event:event
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){     
        this.uploadProfilePic(result.event,result.cropImage);   
      }
    });
  }
}
