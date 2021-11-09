import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-my-likes',
  templateUrl: './my-likes.component.html',
  styleUrls: ['./my-likes.component.css']
})
export class MyLikesComponent implements OnInit {

  config:any = {};
  results:any[] = [];
  generatedTokenStatusSubscription:Subscription;
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 10;
  action:string = "like";
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) { 
    this.pageConfigRefresher();
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getLikedMembers();
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
    this.getLikedMembers();
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
  toggleLikeUnlikeListing(){
    if(this.action=="like"){
      this.action = "unlike";
    }else{
      this.action = "like";
    }
    this.pageNumber = 1;
    this.getLikedMembers();
  }
  getLikedMembers(){
    this.isNoResults = false;
    this.isSavingDetails = true;
    let requestData = new FormData();
    requestData.append("action",this.action);
    this.pageConfigRefresher();
    this.loginService.getLikedMembers(requestData,this.pageNumber).subscribe((res:any)=>{
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
  toggleLike(action:string,id:string){
    let requestData = new FormData();
    requestData.append("like_status",action);
    requestData.append("other_id",id);
    this.loginService.toggleLike(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        if((this.results.length==1)&&(this.pageNumber!=1)){
          this.pageNumber = this.pageNumber-1;
        } 
        this.getLikedMembers();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
}
