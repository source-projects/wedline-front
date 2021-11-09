import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import * as _moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ImageCropperComponent } from 'src/app/dialogs/image-cropper/image-cropper.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpEventType } from '@angular/common/http';
import { Image, LibConfig, ModalGalleryConfig, ModalGalleryRef, ModalGalleryService, Size } from '@ks89/angular-modal-gallery';
const moment = _moment;
@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent implements OnInit {
  basicInfoForm: FormGroup;
  lifeStyleForm: FormGroup;
  aboutMeForm:FormGroup;
  religionForm:FormGroup;
  locationForm:FormGroup;
  educationForm:FormGroup;
  familyForm:FormGroup;

  isUploading:boolean = false;

  photoProgress:number = 0; 
  photoFile:File; 
  photoNumber:number = 1
  idFile:File; 
  idProgress:number = 0; 

  basicPartnerForm: FormGroup;
  lifeStylePartnerForm: FormGroup;
  religionPartnerForm:FormGroup;
  locationPartnerForm:FormGroup;
  educationPartnerForm:FormGroup;

  isSavingDetails:boolean = false;
  album:any[] = [];
  countries:any[] = [];
  states:any[] = [];
  cities:any[] = [];
  partStates:any[] = [];
  partCities:any[] = [];
  languages:any[] = [];
  streams:any[] = [];
  castes:any[] = [];
  occupations:any[] = [];
  designations:any[] = [];
  countryCodes:any[] = [];
  generatedTokenStatusSubscription:Subscription;
  reloadMemberDataStatusSubscription:Subscription;
  memberDetails:any = "";

  date = moment();

  selDate: string;
  selDay: string;
  selMonth: string;
  selYear: string;

  minDate = new Date(1956, 0, 1);
  maxDate = new Date(2003, 11, 31);
  constructor(
   private loginService:LoginService,
   private snackBar:MatSnackBar,
   private fb:FormBuilder,
   public dialog: MatDialog,
   private modalGalleryService: ModalGalleryService
  ) {
  this.basicInfoForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname:['',Validators.required],
    mother_tongue:['',Validators.required],
    marital_status:['',Validators.required],
    total_children:['',Validators.required],
    status_children:['',Validators.required],
    languages_known:['',Validators.required],
    height:['',Validators.required],
    weight:['',Validators.required],
    dateOfBirth:['',Validators.required]
  }); 

  this.lifeStyleForm = this.fb.group({
    bodytype: ['', Validators.required],
    diet:['',Validators.required],
    smoke:['',Validators.required],
    drink:['',Validators.required],
    complexion:['',Validators.required],
    blood_group:['']
   });

   this.aboutMeForm = this.fb.group({
    profile_text: ['', Validators.required],
    hobby:['',Validators.required],
    birthplace:[''],
    birthtime:[''],
    profileby:['',Validators.required],
    reference:['',Validators.required]    
  }); 

  this.religionForm = this.fb.group({
    caste: ['', Validators.required],
    subcaste:['']
  }); 
  this.locationForm = this.fb.group({
    country_id: ['', Validators.required],
    state_id:['',Validators.required],
    city:['',Validators.required],
    address:[''],
    country_code:['',Validators.required],
    mobile_num:['',Validators.required],
    time_to_call:[''],
    residence:['']
  }); 

  this.educationForm = this.fb.group({
    employee_in: [''],
    income:[''],
    occupation:['',Validators.required],
    designation:[''],
    education_detail:['',Validators.required]
  });

  this.familyForm = this.fb.group({
    family_type: [''],
    father_name:[''],
    father_occupation:[''],
    mother_name:[''],
    mother_occupation:[''],
    family_status:[''],
    no_of_brothers:[''],
    no_of_married_brother:[''],
    no_of_sisters:[''],
    no_of_married_sister:[''],
    family_details:['']
  }); 

  this.basicPartnerForm = this.fb.group({
    looking_for: ['', Validators.required],
    part_complexion:[''],
    part_frm_age:['',Validators.required],
    part_to_age:['',Validators.required],
    part_height:['',Validators.required],
    part_height_to:['',Validators.required],
    part_mother_tongue:['',Validators.required],
    part_expect:[''],
  }); 
  this.lifeStylePartnerForm = this.fb.group({
    part_bodytype: [''],
    part_diet:[''],
    part_smoke:[''],
    part_drink:['']
  }); 
  this.religionPartnerForm = this.fb.group({
    // part_religion: [''],
    part_caste:['']
  }); 
  this.locationPartnerForm = this.fb.group({
    part_country_living: [''],
    part_state:[''],
    part_city:[''],
    part_resi_status:['']
  }); 

  this.educationPartnerForm = this.fb.group({
    part_education: [''],
    part_employee_in:[''],
    part_occupation:[''],
    part_designation:[''],
    part_income:['']
  }); 
  this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
    if(res){
      this.getCountries();
      this.getLanguages();
      this.getStreams();
      this.getOccupations();
      this.getDesignations();
      this.getCasteList();
      this.getMobileCountryCode();
    }
  }); 
  this.reloadMemberDataStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
    if(res){
      this.memberDetails = Object.assign({},this.loginService.memberDetails);
      this.setAlbum();
      this.setExistingFormValues();
    }
  });  
 }
 
 ngOnInit(): void {
}
 ngOnDestroy():void{
  this.generatedTokenStatusSubscription.unsubscribe();
  this.reloadMemberDataStatusSubscription.unsubscribe();
 }
 addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  this.date = moment(event.value);
  this.selDate = this.date.format('DD');
  this.selDay = this.date.format('dddd');
  this.selMonth = this.date.format('MM');
  this.selYear = this.date.format('YYYY');
 }  
 showSnackbar(content:string,hasDuration:boolean,action:string){
   const config = new MatSnackBarConfig();
   if(hasDuration){
     config.duration = 3000;
   }
   config.panelClass = ['snackbar-styler'];
   return this.snackBar.open(content, action, config);
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
  if(this.locationForm.get("country_id")?.valid){
    this.loginService.getDropdownList("state_list",this.locationForm.get("country_id")?.value,false).subscribe((res:any)=>{
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
getStatesForMultipleCountries(isIntializing:Boolean){
  if(this.locationPartnerForm.get("part_country_living")?.value){
    this.loginService.getDropdownList("state_list",this.locationPartnerForm.get("part_country_living")?.value.join(","),true).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.partStates = res["data"];
        this.partStates.shift();
        if(!isIntializing){
          this.locationPartnerForm.get("part_state")?.setValue([]);
          this.locationPartnerForm.get("part_city")?.setValue([]);
          this.getCitiesForMultipleStates(false);
        }
      }
    },error=>{
      alert(error["message"]);
    });
  }  
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

  getCities(){
    if(this.locationForm.get("state_id")?.valid){
      this.loginService.getDropdownList("city_list",this.locationForm.get("state_id")?.value,false).subscribe((res:any)=>{
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
  getCitiesForMultipleStates(isIntializing:boolean){
    if(this.locationPartnerForm.get("part_state")?.value){
      this.loginService.getDropdownList("city_list",this.locationPartnerForm.get("part_state")?.value.join(","),true).subscribe((res:any)=>{
        if(res["status"]=="success"){
          this.partCities = res["data"];
          this.partCities.shift();
          if(!isIntializing){
            this.locationPartnerForm.get("part_city")?.setValue("");
          }
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
        this.languages.shift();
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
  setExistingFormValues(){
    delete this.memberDetails["fileds"];

    //basic form
    this.basicInfoForm.get("dateOfBirth")?.setValue(this.memberDetails.birthdate);
    this.basicInfoForm.get("languages_known")?.setValue(this.memberDetails.languages_known?this.memberDetails.languages_known.split(','):"");
    delete this.memberDetails["languages_known"];
    delete this.memberDetails["birthdate"];
    this.basicInfoForm.patchValue(this.memberDetails);
    this.toggleChidrenInputs();

    //lifestyle form
    this.lifeStyleForm.patchValue(this.memberDetails);

    //aboutMeForm
    this.aboutMeForm.patchValue(this.memberDetails);

    //religion form
    this.religionForm.patchValue(this.memberDetails);

    //location form
    this.locationForm.patchValue(this.memberDetails);
    this.getStates();
    this.getCities();
    this.locationForm.get("country_code")?.setValue(this.memberDetails.mobile.split("-")[0]);
    this.locationForm.get("mobile_num")?.setValue(this.memberDetails.mobile.split("-")[1]);

    //eduction form
    this.educationForm.get("education_detail")?.setValue(this.memberDetails.education_detail?this.memberDetails.education_detail.split(','):"");
    delete this.memberDetails["education_detail"];
    this.educationForm.patchValue(this.memberDetails);  
    
    //family form
    this.familyForm.patchValue(this.memberDetails);
    setTimeout(()=>{
      this.familyForm.get("no_of_married_sister")?.setValue(this.memberDetails.no_of_married_sister);
      this.familyForm.get("no_of_married_brother")?.setValue(this.memberDetails.no_of_married_brother);
    },500);

    
    //partner basic info form
    this.basicPartnerForm.get("looking_for")?.setValue(this.memberDetails.looking_for?this.memberDetails.looking_for.split(','):"");
    delete this.memberDetails["looking_for"];
    this.basicPartnerForm.get("part_complexion")?.setValue(this.memberDetails.part_complexion?this.memberDetails.part_complexion.split(','):"");
    delete this.memberDetails["part_complexion"];
    this.basicPartnerForm.get("part_mother_tongue")?.setValue(this.memberDetails.part_mother_tongue?this.memberDetails.part_mother_tongue.split(','):"");
    delete this.memberDetails["part_mother_tongue"];
    this.basicPartnerForm.patchValue(this.memberDetails);


    //partner lifestyle form
    this.lifeStylePartnerForm.get("part_bodytype")?.setValue(this.memberDetails.part_bodytype?this.memberDetails.part_bodytype.split(','):"");
    delete this.memberDetails["part_bodytype"];
    this.lifeStylePartnerForm.get("part_diet")?.setValue(this.memberDetails.part_diet?this.memberDetails.part_diet.split(','):"");
    delete this.memberDetails["part_diet"];
    this.lifeStylePartnerForm.get("part_smoke")?.setValue(this.memberDetails.part_smoke?this.memberDetails.part_smoke.split(','):"");
    delete this.memberDetails["part_smoke"];
    this.lifeStylePartnerForm.get("part_drink")?.setValue(this.memberDetails.part_drink?this.memberDetails.part_drink.split(','):"");
    delete this.memberDetails["part_drink"];
    // this.lifeStyleForm.patchValue(this.memberDetails);//if needed

    //Religion partner preference
    this.religionPartnerForm.get("part_caste")?.setValue(this.memberDetails.part_caste?this.memberDetails.part_caste.split(','):"");
    delete this.memberDetails["part_caste"];
    // this.religionPartnerForm.patchValue(this.memberDetails);//if needed

    //Location Partner Preference
    this.locationPartnerForm.get("part_country_living")?.setValue(this.memberDetails.part_country_living?this.memberDetails.part_country_living.split(','):"");
    delete this.memberDetails["part_country_living"];
    this.locationPartnerForm.get("part_state")?.setValue(this.memberDetails.part_state?this.memberDetails.part_state.split(','):"");
    delete this.memberDetails["part_state"];
    this.getStatesForMultipleCountries(true);
    this.locationPartnerForm.get("part_city")?.setValue(this.memberDetails.part_city?this.memberDetails.part_city.split(','):"");
    delete this.memberDetails["part_city"];
    this.getCitiesForMultipleStates(true);
    this.locationPartnerForm.get("part_resi_status")?.setValue(this.memberDetails.part_resi_status?this.memberDetails.part_resi_status.split(','):"");
    delete this.memberDetails["part_resi_status"];
    // this.locationPartnerForm.patchValue(this.memberDetails);//if needed

    //education partner preference
    this.educationPartnerForm.get("part_education")?.setValue(this.memberDetails.part_education?this.memberDetails.part_education.split(','):"");
    delete this.memberDetails["part_education"];
    this.educationPartnerForm.get("part_occupation")?.setValue(this.memberDetails.part_occupation?this.memberDetails.part_occupation.split(','):"");
    delete this.memberDetails["part_occupation"];
    this.educationPartnerForm.get("part_employee_in")?.setValue(this.memberDetails.part_employee_in?this.memberDetails.part_employee_in.split(','):"");
    delete this.memberDetails["part_employee_in"];
    this.educationPartnerForm.get("part_designation")?.setValue(this.memberDetails.part_designation?this.memberDetails.part_designation.split(','):"");
    delete this.memberDetails["part_designation"];
    this.educationPartnerForm.patchValue(this.memberDetails);

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
       requestData.append("firstname",this.basicInfoForm.get("firstname")?.value);
       requestData.append("lastname",this.basicInfoForm.get("lastname")?.value);
       requestData.append("marital_status",this.basicInfoForm.get("marital_status")?.value);
       requestData.append("mother_tongue",this.basicInfoForm.get("mother_tongue")?.value);
       requestData.append("languages_known[]",this.basicInfoForm.get("languages_known")?.value?this.basicInfoForm.get("languages_known")?.value.join(','):"");
       requestData.append("height",this.basicInfoForm.get("height")?.value);
       requestData.append("weight",this.basicInfoForm.get("weight")?.value);
       if(this.basicInfoForm.get("marital_status")?.value!="Unmarried"){
          requestData.append("total_children",this.basicInfoForm.get("total_children")?.value);
          requestData.append("status_children",this.basicInfoForm.get("status_children")?.value);
       }
       requestData.append("birth_year",this.selYear);
       requestData.append("birth_month",this.selMonth);
       requestData.append("birth_day",this.selDate);
       requestData.append("user_agent","NI-AAPP");
       requestData.append("is_post","0");


       this.registerSteps(requestData,"basic-detail"); 
     }else{
       this.showSnackbar("Please fill all required fields",true,"okay");
     }       
 }
 lifeStyleFormSubmit(){
  if(this.lifeStyleForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("bodytype",this.lifeStyleForm.get("bodytype")?.value);
    requestData.append("diet",this.lifeStyleForm.get("diet")?.value);
    requestData.append("smoke",this.lifeStyleForm.get("smoke")?.value);
    requestData.append("drink",this.lifeStyleForm.get("drink")?.value);
    requestData.append("complexion",this.lifeStyleForm.get("complexion")?.value);   
    requestData.append("blood_group",this.lifeStyleForm.get("blood_group")?.value); 
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");


    this.registerSteps(requestData,"life-style-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }    
}
  aboutMeFormSubmit(){
    if(this.aboutMeForm.valid){
      this.showSnackbar("Saving details...",false,"");
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("profile_text",this.aboutMeForm.get("profile_text")?.value);
      requestData.append("hobby",this.aboutMeForm.get("hobby")?.value);
      requestData.append("birthplace",this.aboutMeForm.get("birthplace")?.value);
      requestData.append("profileby",this.aboutMeForm.get("profileby")?.value);
      requestData.append("birthtime",this.aboutMeForm.get("birthtime")?.value);
      requestData.append("reference",this.aboutMeForm.get("reference")?.value);    
      requestData.append("user_agent","NI-AAPP");
      requestData.append("is_post","0");
  
  
      this.registerSteps(requestData,"about-me-detail"); 
    }else{
      this.showSnackbar("Please fill all required fields",true,"okay");
    }       
 }

 religionFormSubmit(){
  if(this.religionForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("subcaste",this.religionForm.get("subcaste")?.value);
    requestData.append("caste",this.religionForm.get("caste")?.value);
    requestData.append("religion","30");    
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");


    this.registerSteps(requestData,"religious-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
locationFormSubmit(){
  if(this.locationForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("country_id",this.locationForm.get("country_id")?.value);
    requestData.append("state_id",this.locationForm.get("state_id")?.value);
    requestData.append("city",this.locationForm.get("city")?.value);
    requestData.append("address",this.locationForm.get("address")?.value);
    requestData.append("country_code",this.locationForm.get("country_code")?.value);
    requestData.append("mobile_num",this.locationForm.get("mobile_num")?.value);
    requestData.append("time_to_call",this.locationForm.get("time_to_call")?.value);
    requestData.append("residence",this.locationForm.get("residence")?.value);
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");


    this.registerSteps(requestData,"residence-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
educationFormSubmit(){
  if(this.educationForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("education_detail[]",this.educationForm.get("education_detail")?.value?this.educationForm.get("education_detail")?.value.join(','):"");
    requestData.append("employee_in",this.educationForm.get("employee_in")?.value);
    requestData.append("income",this.educationForm.get("income")?.value);
    requestData.append("occupation",this.educationForm.get("occupation")?.value);
    requestData.append("designation",this.educationForm.get("designation")?.value);
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");


    this.registerSteps(requestData,"education-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
familyFormSubmit(){
  if(this.familyForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("family_type",this.familyForm.get("family_type")?.value);
    requestData.append("father_name",this.familyForm.get("father_name")?.value);
    requestData.append("father_occupation",this.familyForm.get("father_occupation")?.value);
    requestData.append("mother_name",this.familyForm.get("mother_name")?.value);
    requestData.append("mother_occupation",this.familyForm.get("mother_occupation")?.value);
    requestData.append("family_status",this.familyForm.get("family_status")?.value);
    requestData.append("no_of_brothers",this.familyForm.get("no_of_brothers")?.value);
    requestData.append("no_of_married_brother",this.familyForm.get("no_of_married_brother")?.value);
    requestData.append("no_of_sisters",this.familyForm.get("no_of_sisters")?.value);
    requestData.append("no_of_married_sister",this.familyForm.get("no_of_married_sister")?.value);
    requestData.append("family_details",this.familyForm.get("family_details")?.value);
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");


    this.registerSteps(requestData,"family-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}

basicPartnerFormSubmit(){
  if(this.basicPartnerForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("part_mother_tongue[]",this.basicPartnerForm.get("part_mother_tongue")?.value?this.basicPartnerForm.get("part_mother_tongue")?.value.join(','):"");
    requestData.append("part_complexion[]",this.basicPartnerForm.get("part_complexion")?.value?this.basicPartnerForm.get("part_complexion")?.value.join(','):"");
    requestData.append("looking_for[]",this.basicPartnerForm.get("looking_for")?.value?this.basicPartnerForm.get("looking_for")?.value.join(','):"");
    requestData.append("part_frm_age",this.basicPartnerForm.get("part_frm_age")?.value);
    requestData.append("part_to_age",this.basicPartnerForm.get("part_to_age")?.value);
    requestData.append("part_height",this.basicPartnerForm.get("part_height")?.value);
    requestData.append("part_height_to",this.basicPartnerForm.get("part_height_to")?.value);
    requestData.append("part_expect",this.basicPartnerForm.get("part_expect")?.value);
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");


    this.registerSteps(requestData,"part-basic-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
lifeStylePartnerFormSubmit(){
  if(this.lifeStylePartnerForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("part_bodytype[]",this.lifeStylePartnerForm.get("part_bodytype")?.value?this.lifeStylePartnerForm.get("part_bodytype")?.value.join(','):"");
    requestData.append("part_diet[]",this.lifeStylePartnerForm.get("part_diet")?.value?this.lifeStylePartnerForm.get("part_diet")?.value.join(','):"");
    requestData.append("part_smoke[]",this.lifeStylePartnerForm.get("part_smoke")?.value?this.lifeStylePartnerForm.get("part_smoke")?.value.join(','):"");
    requestData.append("part_drink[]",this.lifeStylePartnerForm.get("part_drink")?.value?this.lifeStylePartnerForm.get("part_drink")?.value.join(','):"");
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");
    this.registerSteps(requestData,"part-basic-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
religionPartnerFormSubmit(){
  if(this.religionPartnerForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("part_religion[]","30");
    requestData.append("part_caste[]",this.religionPartnerForm.get("part_caste")?.value?this.religionPartnerForm.get("part_caste")?.value.join(','):"");
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");
    this.registerSteps(requestData,"part-religious-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
locationPartnerFormSubmit(){
  if(this.locationPartnerForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("part_country_living[]",this.locationPartnerForm.get("part_country_living")?.value?this.locationPartnerForm.get("part_country_living")?.value.join(','):"");
    requestData.append("part_state[]",this.locationPartnerForm.get("part_state")?.value?this.locationPartnerForm.get("part_state")?.value.join(','):"");
    requestData.append("part_city[]",this.locationPartnerForm.get("part_city")?.value?this.locationPartnerForm.get("part_city")?.value.join(','):"");
    requestData.append("part_resi_status[]",this.locationPartnerForm.get("part_resi_status")?.value?this.locationPartnerForm.get("part_resi_status")?.value.join(','):"");
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");
    this.registerSteps(requestData,"part-location-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
educationPartnerFormSubmit(){
  if(this.educationPartnerForm.valid){
    this.showSnackbar("Saving details...",false,"");
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("part_education[]",this.educationPartnerForm.get("part_education")?.value?this.educationPartnerForm.get("part_education")?.value.join(','):"");
    requestData.append("part_employee_in[]",this.educationPartnerForm.get("part_employee_in")?.value?this.educationPartnerForm.get("part_employee_in")?.value.join(','):"");
    requestData.append("part_occupation[]",this.educationPartnerForm.get("part_occupation")?.value?this.educationPartnerForm.get("part_occupation")?.value.join(','):"");
    requestData.append("part_designation[]",this.educationPartnerForm.get("part_designation")?.value?this.educationPartnerForm.get("part_designation")?.value.join(','):"");
    requestData.append("part_income",this.educationPartnerForm.get("part_income")?.value);
    requestData.append("user_agent","NI-AAPP");
    requestData.append("is_post","0");
    this.registerSteps(requestData,"part-education-detail"); 
  }else{
    this.showSnackbar("Please fill all required fields",true,"okay");
  }       
}
registerSteps(formData:FormData,steps:string){
  this.loginService.saveProfile(formData,steps).subscribe((res:any)=>{
  this.isSavingDetails = false;
  this.showSnackbar(res["errmessage"],true,"close");
  this.loginService.hasLoggedIn.next(true);
},error=>{
  this.isSavingDetails = false;
  this.showSnackbar("Connection error!",true,"close");
});     
}
onIdSelect(event:any){
  this.idFile = event.target.files[0];
  if(this.idFile){  
    this.uploadIdPic(event)
  }
}
onPhotoSelect(event:any){
  this.photoFile = event.target.files[0];
  if(this.photoFile){  
    this.openImageCropper(event);
  }
}
deleteIdProof(){
  this.isSavingDetails = true;
  const uploadData = new FormData();
  uploadData.append('delete_id_proof_photo', "delete");
  this.loginService.deleteIdProof(uploadData).subscribe((res:any)=>{
  this.isSavingDetails = false;
  this.loginService.hasLoggedIn.next(true);
  this.showSnackbar(res["errmessage"],true,"close");
},error=>{
  this.isSavingDetails = false;
  this.showSnackbar("Connection error!",true,"close");
}); 
}
uploadIdPic(fileEvent:any){
  this.isUploading =true;
  this.showSnackbar("Please be patient! uploading id proof...",true,"okay");
  const uploadData = new FormData();
  uploadData.append('is_post', "1");
  uploadData.append('id_proof', this.idFile);

  this.loginService.uploadIdProof(uploadData).subscribe((event:any) => {
    switch (event.type) {
      case HttpEventType.Sent:
        this.idProgress = 1;
        break;
      case HttpEventType.ResponseHeader:
        break;
      case HttpEventType.UploadProgress:
        this.idProgress = Math.round(event.loaded / event.total * 100);
        break;
      case HttpEventType.Response:
        this.isUploading = false;
        if(event.body["status"]=="success"){
          this.showSnackbar(event.body["errmessage"],true,"close");            
          this.idFile = null as any;
          var reader = new FileReader();   
          reader.onload = (event:any) => {
          } 
          reader.readAsDataURL(fileEvent.target.files[0]);        
          this.loginService.hasLoggedIn.next(true);
        }else{
          this.showSnackbar(event.body["errmessage"],true,"close");
        }
        setTimeout(() => {
          this.idProgress = 0;
        }, 1500);
        break;
      default:
        this.idProgress = 0;
        return `Unhandled event: ${event.type}`;
    }
  },error=>{
      this.idProgress = 0;
      this.isUploading = false;
      this.showSnackbar("Connection Error!",true,"close");
  }); 
  }
openImageCropper(event:any){
  const dialogRef = this.dialog.open(ImageCropperComponent,{
    data:{
      event:event
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result){     
      this.uploadPhotoPic(result.event,result.cropImage);   
    }
  });
}

uploadPhotoPic(fileEvent:any,cropImage:any){
this.isUploading =true;
this.showSnackbar("Please be patient! uploading pic...",true,"okay");
const uploadData = new FormData();
uploadData.append('photo_number', this.photoNumber.toString());
uploadData.append('is_ajax', "1");
uploadData.append('profile_photo'+this.photoNumber+'_crop', new File([cropImage], "crop-image.png",{type:"mime", lastModified:new Date().getTime()}));
uploadData.append('profile_photo'+this.photoNumber+'_org', this.photoFile);

this.loginService.uploadGalleryPhoto(uploadData).subscribe((event:any) => {
  switch (event.type) {
    case HttpEventType.Sent:
      this.photoProgress = 1;
      break;
    case HttpEventType.ResponseHeader:
      break;
    case HttpEventType.UploadProgress:
      this.photoProgress = Math.round(event.loaded / event.total * 100);
      break;
    case HttpEventType.Response:
      this.isUploading = false;
      if(event.body["status"]=="success"){
        this.showSnackbar(event.body["errmessage"],true,"close");            
        this.photoFile = null as any;
        var reader = new FileReader();   
        reader.onload = (event:any) => {
        } 
        reader.readAsDataURL(fileEvent.target.files[0]);        
        this.loginService.hasLoggedIn.next(true);
      }else{
        this.showSnackbar(event.body["errmessage"],true,"close");
      }
      setTimeout(() => {
        this.photoProgress = 0;
      }, 1500);
      break;
    default:
      this.photoProgress = 0;
      return `Unhandled event: ${event.type}`;
  }
},error=>{
    this.photoProgress = 0;
    this.isUploading = false;
    this.showSnackbar("Connection Error!",true,"close");
}); 
}

setPhotoNumber(photoNumber:number){
  this.photoNumber = photoNumber;
}
setAsProfilePic(photoNumber:number){
  this.isSavingDetails = true;
  const uploadData = new FormData();
  uploadData.append('photo_number',photoNumber.toString());
  uploadData.append('is_ajax', "1");
  uploadData.append('set_profile', "set_profile");
  this.loginService.setAsProfilePic(uploadData).subscribe((res:any)=>{
  this.isSavingDetails = false;
  this.loginService.hasLoggedIn.next(true);
  this.showSnackbar(res["errmessage"],true,"close");
},error=>{
  this.isSavingDetails = false;
  this.showSnackbar("Connection error!",true,"close");
}); 
}
deletePhoto(photoNumber:number){
  this.isSavingDetails = true;
  const uploadData = new FormData();
  uploadData.append('photo_number',photoNumber.toString());
  uploadData.append('is_ajax', "1");
  uploadData.append('delete_photo', "delete");
  this.loginService.deletePhoto(uploadData).subscribe((res:any)=>{
  this.isSavingDetails = false;
  this.loginService.hasLoggedIn.next(true);
  this.showSnackbar(res["errmessage"],true,"close");
},error=>{
  this.isSavingDetails = false;
  this.showSnackbar("Connection error!",true,"close");
}); 
}

setAlbum(){
  let count = 0;
  this.album = [];
  for (let i = 2; i <= 5; i++) {
    if(this.memberDetails["photo"+i]){      
      this.album.push(new Image(count++, {
        img:this.memberDetails['photo' + i]
      }));
    }    
  }  
}
open(imageIndex: number) { 
  const DEFAULT_SIZE_PREVIEWS: Size = {
    width: '100px',
    height: 'auto'
  };
  const libConfig: LibConfig = {
    slideConfig: {
      infinite: true,
      sidePreviews: {
        show: false,
        size: DEFAULT_SIZE_PREVIEWS
      }
    }
  };
    
    let id = imageIndex;
    const imageToShow: Image = this.album.find((obj:Image)=>{
      return obj.modal.img == this.memberDetails["photo"+imageIndex];
    })
    let dialogRef = this.modalGalleryService.open({
      id,
      images: this.album,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig);
  
}

}
