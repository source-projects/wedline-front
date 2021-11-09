import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-success-stories',
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.css']
})
export class SuccessStoriesComponent implements OnInit {
  config:any = {};
  results:any[] = [];
  generatedTokenStatusSubscription:Subscription; 
  profileStatusSubscription:Subscription;
  profileStatus:string = "Subscribed";
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 6;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) {
    this.pageConfigRefresher();    
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
       this.getStories();
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
  pageChange(newPage: number){
    this.pageNumber = newPage;
    this.getStories();
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  pageConfigRefresher(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNumber;
    this.config["itemsPerPage"] = this.pageSize; 
  }
  getStories(){
    this.isNoResults = false;
    this.isSavingDetails = true;
    let requestData = new FormData();
    // requestData.append("religion","30");
    this.pageConfigRefresher();
    this.loginService.getSuccessStories(requestData,this.pageNumber,this.pageSize).subscribe((res:any)=>{
      console.log(res);
      this.results = [];
      this.isSavingDetails = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.config["totalItems"] = res["total_count"];
        this.results = res["data"];
        this.results.map(result=>result.id = btoa(result.id));
      }else{
        this.isNoResults = true;
        this.showSnackbar(res["errmessage"],true,"close");
      }
    },error=>{
      this.isSavingDetails = false;
      this.showSnackbar("Connection error!",true,"close");    
    }); 
  }
}
