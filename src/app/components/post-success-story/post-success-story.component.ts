import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { LoginService } from 'src/app/services/login.service';
const moment = _moment;
@Component({
  selector: 'app-post-success-story',
  templateUrl: './post-success-story.component.html',
  styleUrls: ['./post-success-story.component.css']
})
export class PostSuccessStoryComponent implements OnInit {
  @ViewChild('terms') terms:ElementRef;
  successStoryForm:FormGroup
  isSavingDetails:boolean = false;
  isBrideIdValid:boolean = true;
  isGroomIdValid:boolean = true;
  photoProgress:number = 0; 
  date = moment();
  selDate: string;
  selDay: string;
  selMonth: string;
  selYear: string;
  // minDate = new Date(1956, 0, 1);
  // maxDate = new Date(2003, 11, 31);
  imagePreview:any[] = [];
  imageFile:File= null as any;
  constructor(
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private loginService:LoginService
  ) { 
    this.successStoryForm = this.fb.group({
      brideid: ['', Validators.required],
      groomid:['',Validators.required],
      bridename:['',Validators.required],
      groomname:['',Validators.required],
      marriagedate:['',Validators.required],
      successmessage:['',Validators.required]     
    }); 
  }

  ngOnInit(): void {
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.date = moment(event.value);
    this.selDate = this.date.format('DD');
    this.selDay = this.date.format('dddd');
    this.selMonth = this.date.format('MM');
    this.selYear = this.date.format('YYYY');
   } 
  checkMemberId(gender:string){
    if((gender == "Female")&&this.successStoryForm.get("brideid")?.valid){
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("type",gender);
      requestData.append("matri_id",this.successStoryForm.get("brideid")?.value);
      this.loginService.checkIfMemberExistsById(requestData).subscribe((res:any)=>{
        this.isSavingDetails = false;
         if(res["status"]=="success"){
           this.successStoryForm.get("bridename")?.setValue(res["username"]);
           this.isBrideIdValid = true;
         }else{
           this.successStoryForm.get("bridename")?.setValue("");
           this.showSnackbar(res["username"],true,"close");
           this.isBrideIdValid = false;
         }
      },error=>{
        this.isSavingDetails = false;
        this.isBrideIdValid = true;
        this.successStoryForm.get("bridename")?.setValue("");
        this.showSnackbar("Connection error",true,"close");
      });
      return;
    }
    if(this.successStoryForm.get("groomid")?.value){
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("type",gender);
      requestData.append("matri_id",this.successStoryForm.get("groomid")?.value);
      this.loginService.checkIfMemberExistsById(requestData).subscribe((res:any)=>{
        this.isSavingDetails = false;
         if(res["status"]=="success"){
           this.successStoryForm.get("groomname")?.setValue(res["username"]);
           this.isGroomIdValid = true;
         }else{
           this.successStoryForm.get("groomname")?.setValue("");
           this.showSnackbar(res["username"],true,"close");
           this.isGroomIdValid = false;
         }
      },error=>{
        this.isSavingDetails = false;
        this.successStoryForm.get("groomname")?.setValue("");
        this.isGroomIdValid = true;
        this.showSnackbar("Connection error",true,"close");
      });
    }    
  }
  onImageSelect(event:any,fileInput:any){
    this.imagePreview = [];
    var _size = event.target.files[0].size;
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),i=0;
        while(_size>900)
        {
          _size/=1024;
          i++;
        }
    if((((Math.round(_size*100)/100)>2)&&(i==2))||(i==3)){
      this.showSnackbar("File size is larger than 2 MB",true,"okay");
    }else{
      this.imageFile = event.target.files[0];    
      var reader = new FileReader();   
      reader.onload = (event:any) => {
        this.imagePreview.push(event.target.result);  
      } 
      reader.readAsDataURL(event.target.files[0]);
    }    
  }
  resetForm(){
    this.successStoryForm.reset();
    this.selDay = "";
    this.selDate = "";
    this.selMonth = "";
    this.selYear = "";
    this.terms.nativeElement.checked = false;
    this.imageFile = null as any;
    this.imagePreview = [];
  }
  postSuccessStory(){
    if(this.successStoryForm.valid&&this.isBrideIdValid&&this.isGroomIdValid){
      if(!this.imageFile){
        this.showSnackbar("Please select wedding photo",true,"okay");
        return;
      }
      if(!this.terms.nativeElement.checked){
        this.showSnackbar("Please agree to terms and conditions",true,"okay");
        return;
      }
      this.isSavingDetails =true;
      this.showSnackbar("Please be patient! posting story...",true,"okay");
      const uploadData = new FormData();
      uploadData.append('brideid',this.successStoryForm.get('brideid')?.value);
      uploadData.append('groomid',this.successStoryForm.get('groomid')?.value);
      uploadData.append('bridename',this.successStoryForm.get('bridename')?.value);
      uploadData.append('groomname',this.successStoryForm.get('groomname')?.value);
      uploadData.append('successmessage',this.successStoryForm.get('successmessage')?.value);
      uploadData.append('marriagedate',this.selDate+"-"+this.selMonth+"-"+this.selYear);
      uploadData.append('terms_condition',this.terms.nativeElement.checked?"yes":"");
      uploadData.append('weddingphoto', this.imageFile);

      this.loginService.postSuccessStory(uploadData).subscribe((event:any) => {
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
            this.isSavingDetails = false;
            if(event.body["status"]=="success"){
              this.showSnackbar(event.body["errmessage"],true,"close");            
              this.resetForm();
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
          this.isSavingDetails = false;
          this.showSnackbar("Connection Error!",true,"close");
      });
    }else{
      this.showSnackbar("Please check all required fields",true,"okay");
    }
  }
}
