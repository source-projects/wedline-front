import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-my-interest',
  templateUrl: './my-interest.component.html',
  styleUrls: ['./my-interest.component.css']
})
export class MyInterestComponent implements OnInit {
  config:any = {};
  results:any[] = [];
  generatedTokenStatusSubscription:Subscription;
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 10;
  action:string = "receive";
  filterControl:FormControl;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) { 
    this.filterControl = new FormControl("all_",Validators.required);
    this.pageConfigRefresher();
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getInterestMembers();
      }
    }); 
  }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.generatedTokenStatusSubscription.unsubscribe();
  }
  pageChange(newPage: number){
    this.pageNumber = newPage;
    this.getInterestMembers();
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
  toggleSentRecieveListing(){
    if(this.action == "sent"){
      this.action = "receive";
    }else{
      this.action = "sent";
    }
    this.pageNumber = 1;
    this.getInterestMembers();
  }
  filterChanged(){
    this.pageNumber = 1;
    this.getInterestMembers();
  }
  getInterestMembers(){
    this.isNoResults = false;
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("exp_status",this.filterControl.value+this.action);
    this.pageConfigRefresher();
    this.loginService.getInterestMembers(requestData,this.pageNumber).subscribe((res:any)=>{
      this.results = [];
      this.isSavingDetails = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.config["totalItems"] = res["total_count"];
        this.results = res["data"];
      }else{
        this.isNoResults = true;
        this.showSnackbar(res["errmessage"],true,"close");
      }
  },error=>{
    this.isSavingDetails = false;
    this.showSnackbar("Connection error!",true,"close");    
  });     
  }
  deleteInterest(id:string){
    let requestData = new FormData();
    requestData.append("exp_status",this.filterControl.value+this.action);
    requestData.append("status","delete");
    requestData.append("id",id);
    this.loginService.expressInterestAction(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        if((this.results.length==1)&&(this.pageNumber!=1)){
          this.pageNumber = this.pageNumber-1;
        } 
        this.getInterestMembers();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  sendRemainder(id:string){
    let requestData = new FormData();
    requestData.append("exp_status",this.filterControl.value+this.action);
    requestData.append("status","reminder");
    requestData.append("id",id);
    this.loginService.expressInterestAction(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        let index = this.results.findIndex(x=>x.id == id);
        if(index>-1){
          this.results[index].reminder_status="Yes";
        }
        if(!this.results.length){
          this.isNoResults = true;
        }
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  responseInterestAction(id:string,action:string){
    let requestData = new FormData();
    requestData.append("exp_status",this.filterControl.value+this.action);
    requestData.append("status",action);
    requestData.append("id",id);
    this.loginService.expressInterestAction(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        let index = this.results.findIndex(x=>x.id == id);
        if(index>-1){
          this.results[index].reminder_status = "No";
          this.results[index].receiver_response = action=="accept"?"Accepted":"Rejected";
        }
        if(!this.results.length){
          this.isNoResults = true;
        }
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
}
