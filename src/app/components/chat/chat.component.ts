import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ComposeMessageComponent } from 'src/app/dialogs/compose-message/compose-message.component';
import { ReadMessageComponent } from 'src/app/dialogs/read-message/read-message.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  isInbox:boolean = true;
  isSent:boolean = false;
  isImportant:boolean = false;
  config:any = {};
  results:any[] = [];
  generatedTokenStatusSubscription:Subscription; 
  // messageReceptionStatusSubscription:Subscription;
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 10;
  requestData:FormData;
  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
  ) { 
    this.requestData = new FormData();
    this.requestData.append("mode","inbox");
    this.pageConfigRefresher();   
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getMessages();
      }
    }); 
    // this.messageReceptionStatusSubscription = this.loginService.getMessageReceptionStatus().subscribe(res=>{
    //   if(res){
    //     this.getMessages();
    //   }
    // });
  }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.generatedTokenStatusSubscription.unsubscribe();
    // this.messageReceptionStatusSubscription.unsubscribe();
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
    this.getMessages();
  } 
  tabSwitcher(selectedAction:string){
    this.requestData.set("mode",selectedAction);
    this.pageNumber = 1;
    this.isInbox = (selectedAction == "inbox");
    this.isImportant = (selectedAction == "important");
    this.isSent = (selectedAction == "sent");
    this.getMessages();
  }  
  getMessages(){
    this.isNoResults = false;
    this.isSavingDetails = true;
    this.pageConfigRefresher();
    this.loginService.getMessages(this.requestData,this.pageNumber,this.pageSize).subscribe((res:any)=>{
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
  toggleImportant(isImportant:boolean,id:string,event:any){
    event.stopPropagation();
    let requestData = new FormData();
    requestData.append("mode",String(this.requestData.get("mode")));
    requestData.append("status",isImportant?"unimported":"imported");
    requestData.append("selected_val",id);
    this.loginService.updateMessageStatus(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){ 
        if((this.results.length==1)&&(this.pageNumber!=1)&&this.isImportant){
          this.pageNumber = this.pageNumber-1;  
        } 
        this.getMessages();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     
  }
  readMessage(messageObject:any){
    messageObject["mode"] = this.requestData.get("mode");
    const dialogRef = this.dialog.open(ReadMessageComponent,{
      data:messageObject
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){  
        this.results.map(x=>x.id==messageObject.id?x.read_status = "Yes":"");
        this.loginService.messageReceptionStatus.next(true);
      }
    });
  }
  reply(memberId:any,event:any){
    event.stopPropagation();
    this.composeMessage(memberId);
  }
  deleteMessage(id:string,event:any){
    event.stopPropagation();
    let requestData = new FormData();
    requestData.append("mode",String(this.requestData.get("mode")));
    requestData.append("status","delete");
    requestData.append("selected_val",id);
    this.loginService.updateMessageStatus(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        if((this.results.length==1)&&(this.pageNumber!=1)){
          this.pageNumber = this.pageNumber-1;  
        } 
        this.getMessages();
        this.loginService.messageReceptionStatus.next(true);
      }
      this.showSnackbar(res["errmessage"],true,"close");
    },error=>{
      this.showSnackbar("Connection error!",true,"close");    
    });
  }
  composeMessage(memberId:any){
    const dialogRef = this.dialog.open(ComposeMessageComponent,{
      data:memberId,
      width:"100%"
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){  
        if(this.requestData.get("mode")!="sent"){
          this.tabSwitcher("sent");
        }else if(this.results.length==10){
          this.pageNumber = this.pageNumber+1;  
        } 
        this.getMessages();
      }
    });
  }
}
