import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showSpinner:boolean = false;
  myDetails:any = "";
  reloadMemberStatusSubscription:Subscription;
  joinedMembers:any[] = [];
  loggedMembers:any[] = [];
  matchs:any[] = [];
  currentPlan:any = {};
  blockCount:number = 0;
  likedCount:number = 0;
  shortlistedCount:number = 0;
  interestCount:number = 0;

  generatedTokenStatusSubscription:Subscription;
  isGettingCount:boolean = false;
  isGettingJoined:boolean = false;
  isGettingLogged:boolean = false;
  isGettingMatchs:boolean = false;
  isGettingPlan:boolean = false;
  isNoResultsJoined:boolean = false;
  isNoResultsLogged:boolean = false;
  isNoResultsMatchs:boolean = false;

  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) {
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getDashboardCount();
        this.getJoinedMembers();
        this.getLoggedMembers();
        this.getCurrentPlan();
      }
    }); 
    this.reloadMemberStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
      if(res){
        this.myDetails = this.loginService.memberDetails;
        this.getMatchs();
      }
    }); 
   }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.reloadMemberStatusSubscription.unsubscribe();
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
  getCurrentPlan(){
    this.isGettingPlan = true;
    this.currentPlan = {};
    this.loginService.getCurrentPlan().subscribe((res:any)=>{
      this.isGettingPlan = false;
      if((res["status"]=="success")){ 
        this.currentPlan = res["data"];
      }else{
        console.log(res["errmessage"]);
      }
    },error=>{
      this.isGettingPlan = false;
    }); 
  }
  getDashboardCount(){
    this.isGettingCount = true;
    this.loginService.getDashboardCount().subscribe((res:any)=>{
      this.isGettingCount = false;
      if((res["status"]=="success")){ 
        this.blockCount = res["block_count"];
        this.likedCount = res["like_count"];
        this.shortlistedCount = res["shortlist_count"];
        this.interestCount = res["interest_count"];
      }else{
        console.log(res["errmessage"]);
      }
    },error=>{
      this.isGettingCount = false;
    }); 
  }
  getJoinedMembers(){
    this.isNoResultsJoined = false;
    this.isGettingJoined = true;
    this.loginService.getJoinedMembers().subscribe((res:any)=>{
      this.joinedMembers = [];
      this.isGettingJoined = false;
      if((res["status"]=="success")){        
        this.joinedMembers = res["data"];
      }else{
        this.isNoResultsJoined = true;
      }
    },error=>{
      this.isGettingJoined = false;
    }); 
  }
  getLoggedMembers(){
    this.isNoResultsLogged = false;
    this.isGettingLogged = true;
    this.loginService.getLoggedMembers().subscribe((res:any)=>{
      this.loggedMembers = [];
      this.isGettingLogged = false;
      if((res["status"]=="success")){        
        this.loggedMembers = res["data"];
      }else{
        this.isNoResultsLogged = true;
      }
    },error=>{
      this.isGettingLogged = false;
    }); 
  }
  getMatchs(){
    this.isNoResultsMatchs = false;
    this.isGettingMatchs = true;
    let requestData = new FormData();
    requestData.append("from_height",this.myDetails["part_height"]);
    requestData.append("to_height",this.myDetails["part_height_to"]);
    requestData.append("from_age",this.myDetails["part_frm_age"]);
    requestData.append("to_age",this.myDetails["part_to_age"]);
    // requestData.append("looking_for",this.myDetails["looking_for"]);      
    // requestData.append("caste",this.myDetails["part_caste"]);
    // requestData.append("country",this.myDetails["part_country_living"]);      
    // requestData.append("state",this.myDetails["part_state"]);
    // requestData.append("city",this.myDetails["part_city"]);      
    // requestData.append("mothertongue",this.myDetails["part_mother_tongue"]);
    // requestData.append("education",this.myDetails["part_education"]);      
    // requestData.append("occupation",this.myDetails["part_occupation"]);
    // requestData.append("income",this.myDetails["part_income"]);      
    // requestData.append("smoking",this.myDetails["part_smoke"]);
    // requestData.append("drink",this.myDetails["part_drink"]);      
    // requestData.append("diet",this.myDetails["part_diet"]);
    // requestData.append("photo_search","");
    // requestData.append("complexion",this.myDetails["part_complexion"]);      
    // requestData.append("bodytype",this.myDetails["part_bodytype"]);

    requestData.append("religion","30");
    requestData.append("user_agent","NI-AAPP");
    requestData.append("search_order","latest_first");
    this.loginService.search(requestData,1).subscribe((res:any)=>{
      this.matchs = [];
      this.isGettingMatchs = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.matchs = res["data"].slice(0, 5);
      }else{
        this.isNoResultsMatchs = true;
      }
    },error=>{
      this.isGettingMatchs = false;
    }); 
  }
}
