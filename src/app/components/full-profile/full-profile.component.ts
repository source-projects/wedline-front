import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Image, LibConfig, ModalGalleryConfig, ModalGalleryService, Size } from '@ks89/angular-modal-gallery';
import { Subscription } from 'rxjs';
import { ComposeMessageComponent } from 'src/app/dialogs/compose-message/compose-message.component';
import { ErrorDialogComponent } from 'src/app/dialogs/error-dialog/error-dialog.component';
import { InterestMessagesComponent } from 'src/app/dialogs/interest-messages/interest-messages.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-full-profile',
  templateUrl: './full-profile.component.html',
  styleUrls: ['./full-profile.component.css']
})
export class FullProfileComponent implements OnInit {
  memberDetails:any = "";
  album:any[] = [];
  memberId:any = null;
  isGettingProfile:boolean = true;
  isGettingContact:boolean = false;
  isViewedContact:boolean = false;
  generatedTokenStatusSubscription:Subscription;
  email:string = "";
  mobileNumber:string = "";
  whatsappNumber:string = "";
  constructor(
    private route:ActivatedRoute,
    private loginService:LoginService,
    private modalGalleryService: ModalGalleryService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog,
    private location:Location
  ) {
    this.route.paramMap.subscribe(params => {
      this.memberId = atob(String(params.get('memberId')));      
    });
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.getProfileDetails();
      }
    }); 
   }

  ngOnInit(): void {
  }
  ngOnDestroy(): void{
    this.generatedTokenStatusSubscription.unsubscribe();
  }
  setAlbum(){
    let regx = /photos/gi;
    let count = 0;
    this.album = [];
    for (let i = 2; i <= 5; i++) {
      if(this.memberDetails["photo"+i]){ 
        this.album.push(new Image(count++, {
          img: this.memberDetails['photo' + i].replace(regx, "photos_big")
        }));
      }    
    }  
  }
  open(imageIndex: number) {
    let regx = /photos/gi; 
    const DEFAULT_SIZE_PREVIEWS: Size = {
      width: 'auto',
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
        return obj.modal.img == this.memberDetails["photo"+imageIndex].replace(regx, "photos_big");
      })
      let dialogRef = this.modalGalleryService.open({
        id,
        images: this.album,
        currentImage: imageToShow,
        libConfig
      } as ModalGalleryConfig);
    
  }
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }  
  getProfileDetails(){
    this.isGettingProfile = true;
    let requestData = new FormData();
    requestData.append("member_id",this.memberId);
    this.loginService.viewProfileDetails(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        this.isGettingProfile = false;
        this.memberDetails = res.data;
        console.log(this.memberDetails);
        this.setAlbum();
      }else{
        this.showErrorDialog(res["errmessage"]);
      }
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });  

  }
  showErrorDialog(message:string){
    const dialogRef = this.dialog.open(ErrorDialogComponent,{
      data:message
    });
  
    dialogRef.afterClosed().subscribe(result => {
       this.location.back();
    });
  }
  expressInterest(id:string,isBlocked:number){
    if(isBlocked){
      this.showSnackbar("Oops! You have blocked this member",true,"okay");
      return;
    }
    const dialogRef = this.dialog.open(InterestMessagesComponent,{
      data:{}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){ 
        this.isGettingProfile = true;  
        let requestData = new FormData();
        requestData.append("message",result);
        requestData.append("receiver",id);
        this.loginService.expressInterest(requestData).subscribe((res:any)=>{
          this.isGettingProfile = false;
          if((res["status"]=="success")){  
           this.getProfileDetails();
          }
          this.showSnackbar(res["errmessage"],true,"close");
      },error=>{
        this.isGettingProfile = false;
        this.showSnackbar("Connection error!",true,"close");    
      });     
      }
    });
  }
  toggleLike(action:string,id:string){
    this.isGettingProfile = true;
    let requestData = new FormData();
    requestData.append("like_status",action);
    requestData.append("other_id",id);
    this.loginService.toggleLike(requestData).subscribe((res:any)=>{
      this.isGettingProfile = false;
      if((res["status"]=="success")){  
        this.getProfileDetails();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.isGettingProfile = false;
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  toggleShortlist(action:string,id:string){
    this.isGettingProfile = true;
    let requestData = new FormData();
    requestData.append("shortlist_action",action);
    requestData.append("shortlisteduserid",id);
    this.loginService.toggleShortlist(requestData).subscribe((res:any)=>{
      this.isGettingProfile = false;
      if((res["status"]=="success")){  
        this.getProfileDetails();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.isGettingProfile = false;
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  toggleBlock(action:string,id:string){
    this.isGettingProfile = true;
    let requestData = new FormData();
    requestData.append("blacklist_action",action);
    requestData.append("blockuserid",id);
    this.loginService.toggleBlocked(requestData).subscribe((res:any)=>{
      this.isGettingProfile = false;
      if((res["status"]=="success")){  
        this.getProfileDetails();
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.isGettingProfile = true;
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  message(memberId:any){
    const dialogRef = this.dialog.open(ComposeMessageComponent,{
      data:memberId,
      width:"100%"
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){  
        console.log("sent successfully");
      }
    });
  }
  viewContact(memberId:any){
    this.isGettingContact = true;
    this.isViewedContact = false;
    let requestData = new FormData();
    requestData.append("receiver_matri_id",memberId);
    this.loginService.viewContactDetails(requestData).subscribe((res:any)=>{
      this.isGettingContact = false;
      if(res["success"]=="success"){  
        this.email = res["contact_details"]["email"];
        this.mobileNumber = res["contact_details"]["mobile"];
        this.whatsappNumber = res["contact_details"]["whatsapp_number"]?res["contact_details"]["whatsapp_number"]:"-";
        this.isViewedContact = true;
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.isGettingContact = false;
    this.showSnackbar("Connection error!",true,"close");    
  });   
  }
}
