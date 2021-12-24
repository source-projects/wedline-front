import { Component, OnInit } from '@angular/core';
import { Image, LibConfig, ModalGalleryConfig, ModalGalleryService, Size } from '@ks89/angular-modal-gallery';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-public-view',
  templateUrl: './public-view.component.html',
  styleUrls: ['./public-view.component.css']
})
export class PublicViewComponent implements OnInit {
  // generatedTokenStatusSubscription:Subscription;
  reloadMemberDataStatusSubscription:Subscription;
  memberDetails:any = "";
  album:any[] = [];

  constructor( 
     private loginService:LoginService,
     private modalGalleryService: ModalGalleryService
    ) { 
      // this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      //   if(res){
         
      //   }
      // }); 
      this.reloadMemberDataStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
        if(res){
          this.memberDetails = this.loginService.memberDetails;
          this.setAlbum();
        }
      });  
    }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.reloadMemberDataStatusSubscription.unsubscribe();
    // this.generatedTokenStatusSubscription.unsubscribe();
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
}
