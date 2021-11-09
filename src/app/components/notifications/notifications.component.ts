import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  config:any = {};
  results:any[] = [];
  generatedTokenStatusSubscription:Subscription; 
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 10;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
  ) { 
    this.pageConfigRefresher();   
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getNotifications();
      }
    });
  }

  ngOnInit(): void {
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
  pageConfigRefresher(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNumber;
    this.config["itemsPerPage"] = this.pageSize; 
  }
  pageChange(newPage: number){
    this.pageNumber = newPage;
    this.getNotifications();
  } 
  getNotifications(){
    this.isNoResults = false;
    this.isSavingDetails = true;
    this.pageConfigRefresher();
    let requestData = new FormData();
    this.loginService.getNotifications(requestData,this.pageNumber,this.pageSize).subscribe((res:any)=>{
      this.results = [];
      this.isSavingDetails = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.config["totalItems"] = res["total_count"];
        this.results = res["data"];
        const unreadIds = this.results.filter(x=>x.read_status == "No").map(x=>x.id);
        if(unreadIds.length){
          this.readMessage(unreadIds);
        }
      }else{
        this.isNoResults = true;
        this.showSnackbar(res["errmessage"],true,"close");
      }
    },error=>{
      this.isSavingDetails = false;
      this.showSnackbar("Connection error!",true,"close");    
    }); 
  }  
  readMessage(notificationIds:any){
    let requestData = new FormData();
    requestData.append("mode","read");
    requestData.append("selected_val",notificationIds.join(","));
    this.loginService.updateNotificationStatus(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        // console.log("read notifications");
        this.loginService.notificationReceptionStatus.next(true);    
      }else{
        // console.log(res["errmessage"]);
      }
    },error=>{
      this.showSnackbar("Connection error!",true,"close");    
    });
  }
  deleteMessage(id:string,event:any){
    event.stopPropagation();
    let requestData = new FormData();
    requestData.append("mode","delete");
    requestData.append("selected_val",id);
    this.loginService.updateNotificationStatus(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        if((this.results.length==1)&&(this.pageNumber!=1)){
          this.pageNumber = this.pageNumber-1;  
        } 
        this.getNotifications();
        this.loginService.notificationReceptionStatus.next(true);
      }
      this.showSnackbar(res["errmessage"],true,"close");
    },error=>{
      this.showSnackbar("Connection error!",true,"close");    
    });
  }

}
