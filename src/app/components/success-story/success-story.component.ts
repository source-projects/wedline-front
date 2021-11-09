import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-success-story',
  templateUrl: './success-story.component.html',
  styleUrls: ['./success-story.component.css']
})
export class SuccessStoryComponent implements OnInit {
  result:any = null;
  storyId:any = null;
  generatedTokenStatusSubscription:Subscription; 
  profileStatusSubscription:Subscription;
  profileStatus:string = "Subscribed";
  isSavingDetails:boolean = false;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    private route:ActivatedRoute,
    private router:Router
  ) {
    this.route.paramMap.subscribe(params => {
      this.storyId = params.get('id');      
    });
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
       this.getStory();
      }
    }); 
    this.profileStatusSubscription = this.loginService.getProfileStatus().subscribe(res=>{
      this.profileStatus = res;
    });
   }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.generatedTokenStatusSubscription.unsubscribe();
    this.profileStatusSubscription.unsubscribe();
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  getStory(){
    this.isSavingDetails = true;
    let requestData = new FormData();
    // requestData.append("religion","30");
    this.loginService.getSuccessStoryByBaseEncodedId(requestData,this.storyId).subscribe((res:any)=>{
      console.log(res);
      this.result = null;
      this.isSavingDetails = false;
      if(res["status"]=="success"){        
        this.result = res["data"];
      }else{
        this.showSnackbar(res["errmessage"],true,"close");
        this.router.navigateByUrl("success-stories");
      }
    },error=>{
      this.isSavingDetails = false;
      this.showSnackbar("Connection error!",true,"close");    
    }); 
  }
}
