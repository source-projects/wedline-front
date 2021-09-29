import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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

  constructor(
    private loginService:LoginService,
    private snackBar:MatSnackBar
  ) {
    this.reloadMemberStatusSubscription = this.loginService.getreloadMemberDataStatus().subscribe(res=>{
      if(res){
        this.myDetails == this.loginService.memberDetails;
      }
    }); 
   }

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.reloadMemberStatusSubscription.unsubscribe();
  }  
  
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
}
