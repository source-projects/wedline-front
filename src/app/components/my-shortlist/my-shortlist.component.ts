import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-my-shortlist',
  templateUrl: './my-shortlist.component.html',
  styleUrls: ['./my-shortlist.component.css']
})
export class MyShortlistComponent implements OnInit {
  config:any = {};
  results:any[] = [];
  generatedTokenStatusSubscription:Subscription;
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 10;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) { 
    this.pageConfigRefresher();
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getShortlists();
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
    this.getShortlists();
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
  getShortlists(){
    this.isNoResults = false;
    this.isSavingDetails = true;
    let requestData = new FormData();
    this.pageConfigRefresher();
    this.loginService.getShortlistedMembers(requestData,this.pageNumber).subscribe((res:any)=>{
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
  removeShortlist(id:string){
    let requestData = new FormData();
    requestData.append("shortlist_action","remove");
    requestData.append("shortlisteduserid",id);
    this.loginService.toggleShortlist(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        if((this.results.length==1)&&(this.pageNumber!=1)){
          this.pageNumber = this.pageNumber-1;
        } 
        this.getShortlists();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
}
