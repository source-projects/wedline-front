import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  loginStatusSubscription:Subscription;
  hasLoggedIn:boolean = false;
   constructor(
     private loginService:LoginService,
     private router:Router
   ) { 
     this.loginStatusSubscription = this.loginService.getLoginSetStatus().subscribe(res=>{
       this.hasLoggedIn = res;
     });
   }
 
   ngOnInit(): void {   
   }
   ngOnDestroy():void{
     this.loginStatusSubscription.unsubscribe();
   }

}
