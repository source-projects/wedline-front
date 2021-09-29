import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  memberDetails:any = "";
  token:string = "";
  baseUrl:string = "https://demoweblinks.in/matrimony-demo/";
  public hasLoggedIn = new BehaviorSubject<boolean>(false);
  public generatedToken = new BehaviorSubject<boolean>(false);
  public reloadMemberData = new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient) {
    if(localStorage.getItem("matri")){
      this.hasLoggedIn.next(true);
    }
   }
   getLoginSetStatus():Observable<boolean>{
    return this.hasLoggedIn.asObservable();
  }
  getGeneratedTokenStatus():Observable<boolean>{
    return this.generatedToken.asObservable();
  }
  getreloadMemberDataStatus():Observable<boolean>{
    return this.reloadMemberData.asObservable();
  }
  getMobileCountryCode(){
    return this.http.get(this.baseUrl+"api/get_mobile_code",{withCredentials:true});
  }
  getCsrfToken(){
    return this.http.get(this.baseUrl+"api/get_tocken",{withCredentials:true});
  }
  getDropdownList(list:string,currentValue:string){
    let formData = new FormData();
    formData.append("csrf_new_matrimonial",this.token);
    formData.append("get_list",list);
    formData.append("currnet_val",currentValue);
    return this.http.post(this.baseUrl+"api/get_list_json",formData,{withCredentials:true});
  }
  registerStarter(formData:FormData){
    formData.append("csrf_new_matrimonial",this.token);
    formData.append("user_agent","NI-AAP");
    formData.append("religion","30");
    formData.append("is_post","0");
    return this.http.post(this.baseUrl+"/register/save_register",formData,{withCredentials:true});
  }
  registerSteps(formData:FormData,step:string){    
    formData.append("csrf_new_matrimonial",this.token);
    if(step == "step5"){
      return this.http.post(this.baseUrl+"register/save-register-step/"+step,formData,{
        withCredentials:true,
        reportProgress: true,
        observe: 'events'
      });
    }    
    return this.http.post(this.baseUrl+"register/save-register-step/"+step,formData,{
      withCredentials:true
    });
  }
  saveProfile(formData:FormData,step:string){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"my_profile/save_profile/"+step,formData,{
      withCredentials:true
    });
  }
  getAllPackages(){
    return this.http.get(this.baseUrl+"api/get_plan_data",{withCredentials:true});
  }
  getMyProfile(){
    let formData = new FormData();
    formData.append("csrf_new_matrimonial",this.token);
    formData.append("user_agent","NI-AAP");
    return this.http.post(this.baseUrl+"my_profile/get_my_profile",formData,{withCredentials:true});
  }
  verifyPaymentStatus(formData:FormData){
    formData.append("csrf_new_matrimonial",this.token);
    formData.append("user_agent","NI-AAP");
    return this.http.post(this.baseUrl+"premium_member/payment_success_in_app_purchase",formData,{withCredentials:true});
  }
  login(formData:FormData){
    formData.append("csrf_new_matrimonial",this.token);
    return this.http.post(this.baseUrl+"login/check_login_service",formData,{withCredentials:true});
  }
  logout(){  
    let formData = new FormData();  
    formData.append("csrf_new_matrimonial",this.token);
    formData.append("user_agent","NI-AAP");
    return this.http.post(this.baseUrl+"login/logout",formData,{withCredentials:true});
  }
}
