import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { InterestMessagesComponent } from 'src/app/dialogs/interest-messages/interest-messages.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  matchCount:number = 0;
  searchMethod:string="NORMAL";
  config:any = {};
  results:any[] = [];
  countries:any[] = [];
  states:any[] = [];
  cities:any[] = [];
  languages:any[] = [];
  streams:any[] = [];
  castes:any[] = [];
  occupations:any[] = [];
  designations:any[] = [];
  generatedTokenStatusSubscription:Subscription;
  txt_id_search:FormControl;
  search_order:FormControl;
  keyword:FormControl;
  searchForm:FormGroup;
  isSavingDetails:boolean = false;
  isNoResults:boolean = false;
  pageNumber:number = 1;
  pageSize:number = 10;
  constructor(
    private loginService:LoginService,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
  ) {
    this.pageConfigRefresher();
    this.keyword = new FormControl("",Validators.required);
    this.txt_id_search = new FormControl("",Validators.required);
    this.search_order = new FormControl("latest_first",Validators.required);
    this.searchForm = this.fb.group({
      // from_height: ['48'],
      // to_height:['85'],
      // from_age:['18'],
      // to_age:['65'],
      from_height: [''],
      to_height:[''],
      from_age:[''],
      to_age:[''],
      looking_for:[''],
      caste:[''],
      country:[''],
      state:[''],
      city:[''],
      mothertongue:[''],
      education:[''],
      occupation:[''],
      income:[''],
      employee_in:[''],
      smoking:[''],
      drink:[''],
      diet:[''],
      photo_search:[''],
      complexion:[''],
      bodytype:['']
    });   
    this.generatedTokenStatusSubscription = this.loginService.getGeneratedTokenStatus().subscribe(res=>{
      if(res){
        this.search();
        this.getCountries();
        this.getLanguages();
        this.getStreams();
        this.getOccupations();
        this.getCasteList();
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
    switch(this.searchMethod){
      case "NORMAL":{
        this.search();
        break;
      }
      case "KEYWORD":{
        this.searchByKeyword();
        break;
      }
      case "ID":{
        this.searchById();
        break;
      }
    }
  } 
  showSnackbar(content:string,hasDuration:boolean,action:string){
    const config = new MatSnackBarConfig();
    if(hasDuration){
      config.duration = 3000;
    }
    config.panelClass = ['snackbar-styler'];
    return this.snackBar.open(content, action, config);
  }
  
getCountries(){
  this.loginService.getDropdownList("country_list","",false).subscribe((res:any)=>{
    if(res["status"]=="success"){
      this.countries = res["data"];
      this.countries[0].id = "";
      this.countries[0].val = "Select Country";
    }
  },error=>{
    alert(error["message"]);
  });
}
getStatesForMultipleCountries(){
  if(this.searchForm.get("country")?.value){
    this.loginService.getDropdownList("state_list",this.searchForm.get("country")?.value.join(","),true).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.searchForm.get("state")?.setValue([]);
        this.searchForm.get("city")?.setValue([]);
        this.states = res["data"];
        this.states.shift();        
        this.getCitiesForMultipleStates();
      }
    },error=>{
      alert(error["message"]);
    });
  }  
}
getCasteList(){
  this.loginService.getDropdownList("caste_list","30",false).subscribe((res:any)=>{
    if(res["status"]=="success"){
      this.castes = res["data"];
      this.castes.shift();
    }
  },error=>{
    alert(error["message"]);
  });
}
  getCitiesForMultipleStates(){
    if(this.searchForm.get("state")?.value){
      this.loginService.getDropdownList("city_list",this.searchForm.get("state")?.value.join(","),true).subscribe((res:any)=>{
        if(res["status"]=="success"){
        this.searchForm.get("city")?.setValue("");
          this.cities = res["data"];
          this.cities.shift();
        }
      },error=>{
        alert(error["message"]);
      });
    }  
  }
  getLanguages(){
    this.loginService.getDropdownList("mothertongue_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.languages = res["data"];
        this.languages.shift();
      }
    },error=>{
      alert(error["message"]);
    });
  }
  getStreams(){
    this.loginService.getDropdownList("education_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.streams = res["data"];
        this.streams[0].id = "";
        this.streams[0].val = "Select Education";
      }
    },error=>{
      alert(error["message"]);
    });
  }
  getOccupations(){
    this.loginService.getDropdownList("occupation_list","",false).subscribe((res:any)=>{
      if(res["status"]=="success"){
        this.occupations = res["data"];
        this.occupations[0].id = "";
        this.occupations[0].val = "Select Occupations";
      }
    },error=>{
      alert(error["message"]);
    });
  }
  searchByKeyword(){
    if(this.keyword.valid){
      if(this.isSavingDetails){
        this.showSnackbar("Please wait",true,"okay");
        return;
      }
      if(this.searchMethod!="KEYWORD"){
        this.searchMethod = "KEYWORD";
        this.pageNumber = 1;
      }
      this.txt_id_search.setValue("");
      // this.showSnackbar("Fetching details...",true,"");
      this.isNoResults = false;
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("religion","30");
      requestData.append("user_agent","NI-AAPP");
      requestData.append("keyword",this.keyword.value);
      this.dataFetcher(requestData);
    }else{
      this.showSnackbar("Please enter a keyword",true,"okay");
    }
  }
  searchById(){
    if(this.txt_id_search.valid){
      if(this.isSavingDetails){
        this.showSnackbar("Please wait",true,"okay");
        return;
      }
      if(this.searchMethod!="ID"){
        this.searchMethod = "ID";
        this.pageNumber = 1;
      }
      this.keyword.setValue("");
      // this.showSnackbar("Fetching details...",true,"");
      this.isNoResults = false;
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("religion","30");
      requestData.append("user_agent","NI-AAPP");
      requestData.append("txt_id_search",this.txt_id_search.value);
      this.dataFetcher(requestData);
    }else{
      this.showSnackbar("Please enter an id",true,"okay");
    }
  }
  search(){
    if(this.search_order.valid){ 
      if(this.searchMethod!="NORMAL"){
        this.searchMethod = "NORMAL";
        this.pageNumber = 1;
      }
      this.keyword.setValue("");
      this.txt_id_search.setValue("");
      // this.showSnackbar("Fetching details...",true,"");
      this.isNoResults = false;
      this.isSavingDetails = true;
      let requestData = new FormData();
      requestData.append("from_height",this.searchForm.get("from_height")?.value);
      requestData.append("to_height",this.searchForm.get("to_height")?.value);
      requestData.append("from_age",this.searchForm.get("from_age")?.value);
      requestData.append("to_age",this.searchForm.get("to_age")?.value);
      requestData.append("looking_for",this.searchForm.get("looking_for")?.value?this.searchForm.get("looking_for")?.value.join(','):"");      
      requestData.append("caste",this.searchForm.get("caste")?.value?this.searchForm.get("caste")?.value.join(','):"");
      requestData.append("country",this.searchForm.get("country")?.value?this.searchForm.get("country")?.value.join(','):"");      
      requestData.append("state",this.searchForm.get("state")?.value?this.searchForm.get("state")?.value.join(','):"");
      requestData.append("city",this.searchForm.get("city")?.value?this.searchForm.get("city")?.value.join(','):"");      
      requestData.append("mothertongue",this.searchForm.get("mothertongue")?.value?this.searchForm.get("mothertongue")?.value.join(','):"");
      requestData.append("education",this.searchForm.get("education")?.value?this.searchForm.get("education")?.value.join(','):"");      
      requestData.append("occupation",this.searchForm.get("occupation")?.value?this.searchForm.get("occupation")?.value.join(','):"");
      requestData.append("income",this.searchForm.get("income")?.value?this.searchForm.get("income")?.value.join(','):"");      
      requestData.append("smoking",this.searchForm.get("smoking")?.value?this.searchForm.get("smoking")?.value.join(','):"");
      requestData.append("drink",this.searchForm.get("drink")?.value?this.searchForm.get("drink")?.value.join(','):"");      
      requestData.append("diet",this.searchForm.get("diet")?.value?this.searchForm.get("diet")?.value.join(','):"");
      requestData.append("photo_search",this.searchForm.get("photo_search")?.value?"photo_search":"");
      requestData.append("complexion",this.searchForm.get("complexion")?.value?this.searchForm.get("complexion")?.value.join(','):"");      
      requestData.append("bodytype",this.searchForm.get("bodytype")?.value?this.searchForm.get("bodytype")?.value.join(','):"");

      requestData.append("religion","30");
      requestData.append("user_agent","NI-AAPP");
      requestData.append("search_order",this.search_order.value);
      this.dataFetcher(requestData);
    }else{
      this.showSnackbar("Sort order is not set",true,"okay");
    }
  }
  pageConfigRefresher(){
    this.config["totalItems"] = 0;
    this.config["currentPage"] = this.pageNumber;
    this.config["itemsPerPage"] = this.pageSize; 
  }
  dataFetcher(formData:FormData){ 
    this.pageConfigRefresher();
    this.loginService.search(formData,this.pageNumber).subscribe((res:any)=>{
      this.results = [];
      this.matchCount = res["total_count"];
      this.isSavingDetails = false;
      if((res["status"]=="success")&&(res["total_count"]>0)){        
        this.config["totalItems"] = res["total_count"];
        this.results = res["data"];
        console.log(this.results);
      }else{
        this.isNoResults = true;
        this.showSnackbar(res["errmessage"],true,"close");
      }
  },error=>{
    this.isSavingDetails = false;
    this.showSnackbar("Connection error!",true,"close");    
  });     
  }

  toggleShortlist(action:string,id:string){
    let requestData = new FormData();
    requestData.append("shortlist_action",action);
    requestData.append("shortlisteduserid",id);
    this.loginService.toggleShortlist(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        let index = this.results.findIndex(x=>x.matri_id == id);
        if(index>-1){
          this.results[index].action[0].is_shortlist = action=="add"?1:0;
        }
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  toggleBlock(action:string,id:string){
    let requestData = new FormData();
    requestData.append("blacklist_action",action);
    requestData.append("blockuserid",id);
    this.loginService.toggleBlocked(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        let index = this.results.findIndex(x=>x.matri_id == id);
        if(index>-1){
          this.results[index].action[0].is_block = action=="add"?1:0;
        }
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
  });     

  }
  toggleLike(action:string,id:string){
    let requestData = new FormData();
    requestData.append("like_status",action);
    requestData.append("other_id",id);
    this.loginService.toggleLike(requestData).subscribe((res:any)=>{
      if((res["status"]=="success")){  
        let index = this.results.findIndex(x=>x.matri_id == id);
        if(index>-1){
          this.results[index].action[0].is_like = action;
        }
      }
      this.showSnackbar(res["errmessage"],true,"close");
  },error=>{
    this.showSnackbar("Connection error!",true,"close");    
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
        let requestData = new FormData();
        requestData.append("message",result);
        requestData.append("receiver",id);
        this.loginService.expressInterest(requestData).subscribe((res:any)=>{
          if((res["status"]=="success")){  
            let index = this.results.findIndex(x=>x.matri_id == id);
            if(index>-1){
              this.results[index].action[0].is_interest = "Pending";
            }
          }
          this.showSnackbar(res["errmessage"],true,"close");
      },error=>{
        this.showSnackbar("Connection error!",true,"close");    
      });     
      }
    });
  }
}
