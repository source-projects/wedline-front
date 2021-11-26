import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  memberDetails:any = "";
  token:string = "";
  homeRegisterData:any = "";
  baseUrl:string = "http://localhost/matrimony-demo/";
  public hasLoggedIn = new BehaviorSubject<boolean>(false);
  public generatedToken = new BehaviorSubject<boolean>(false);
  public reloadMemberData = new BehaviorSubject<boolean>(false);
  public profileStatus = new BehaviorSubject<string>("Subscribed");
  public messageReceptionStatus = new Subject<boolean>();
  public notificationReceptionStatus = new Subject<boolean>();
  constructor(private http:HttpClient) {
    if(localStorage.getItem("matri")){
      this.hasLoggedIn.next(true);
    }
    if(localStorage.getItem("profileStatus")){
      this.profileStatus.next(String(localStorage.getItem("profileStatus")));
    }
   }
  getLoginSetStatus():Observable<boolean>{
    return this.hasLoggedIn.asObservable();
  }
  getProfileStatus():Observable<string>{
    return this.profileStatus.asObservable();
  }
  getGeneratedTokenStatus():Observable<boolean>{
    return this.generatedToken.asObservable();
  }
  getreloadMemberDataStatus():Observable<boolean>{
    return this.reloadMemberData.asObservable();
  }
  getMessageReceptionStatus():Observable<boolean>{
    return this.messageReceptionStatus.asObservable();
  }
  getNotificationReceptionStatus():Observable<boolean>{
    return this.notificationReceptionStatus.asObservable();
  }
  getMobileCountryCode(){
    return this.http.get(this.baseUrl+"api/get_mobile_code",{withCredentials:true});
  }
  getCsrfToken(){
    return this.http.get(this.baseUrl+"api/get_tocken",{withCredentials:true});
  }
  getDropdownList(list:string,currentValue:string,isMultiple:boolean){
    let formData = new FormData();
    formData.append("csrf_new_matrimonial",this.token);
    formData.append("get_list",list);
    formData.append("currnet_val",currentValue);
    if(isMultiple){
      formData.append("multivar","multi");
    }
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

  uploadGalleryPhoto(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);
    return this.http.post(this.baseUrl+"api/upload_photo_new",formData,{
      withCredentials:true,
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadIdProof(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);
    return this.http.post(this.baseUrl+"api/upload_id_proof_photo",formData,{
      withCredentials:true,
      reportProgress: true,
      observe: 'events'
    });
  }
  postSuccessStory(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);
    return this.http.post(this.baseUrl+"success-story/save-story",formData,{
      withCredentials:true,
      reportProgress: true,
      observe: 'events'
    });
  }

  saveProfile(formData:FormData,step:string){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"my_profile/save_profile/"+step,formData,{
      withCredentials:true
    });
  }
  setAsProfilePic(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"api/set_profile_pic",formData,{
      withCredentials:true
    });
  }
  deletePhoto(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"api/delete_photo",formData,{
      withCredentials:true
    });
  }  
  changePrivacySetting(formData:FormData,privacyType:string){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"privacy_setting/"+privacyType,formData,{
      withCredentials:true
    });
  }  
  deleteIdProof(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"api/delete-id-proof-photo",formData,{
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

  search(formData:FormData,page:number){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"api/refine_search/"+page,formData,{
      withCredentials:true
    });
  }
  checkIfMemberExistsById(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"success-story/check_bride_groom",formData,{
      withCredentials:true
    });
  }
  getMessages(formData:FormData,page:number,size:number){  
    formData.get("csrf_new_matrimonial")?formData.set("csrf_new_matrimonial",this.token):formData.append("csrf_new_matrimonial",this.token);  
    formData.get("user_agent")?formData.set("user_agent","NI-AAPP"):formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"message/get_message_list/"+page+"/"+size,formData,{
      withCredentials:true
    });
  }
  getNotifications(formData:FormData,page:number,size:number){  
    formData.get("csrf_new_matrimonial")?formData.set("csrf_new_matrimonial",this.token):formData.append("csrf_new_matrimonial",this.token);  
    formData.get("user_agent")?formData.set("user_agent","NI-AAPP"):formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"api/get_notifications/"+page+"/"+size,formData,{
      withCredentials:true
    });
  }
  getSuccessStories(formData:FormData,page:number,size:number){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"api/get_success_stories/"+page+"/"+size,formData,{
      withCredentials:true
    });
  }
  getSuccessStoryByBaseEncodedId(formData:FormData,id:string){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"api/get_success_story/"+id,formData,{
      withCredentials:true
    });
  }
  getShortlistedMembers(formData:FormData,page:number){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"my_profile/short_list_app/"+page,formData,{
      withCredentials:true
    });
  }
  getBlockedMembers(formData:FormData,page:number){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"my_profile/block_list/"+page,formData,{
      withCredentials:true
    });
  }
  getLikedMembers(formData:FormData,page:number){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"my_profile/like_unlike_profile_app/"+page,formData,{
      withCredentials:true
    });
  }
  getInterestMembers(formData:FormData,page:number){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"express_interest/all_sent_receive/"+page,formData,{
      withCredentials:true
    });
  }
  toggleShortlist(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"search/add_remove_shortlist_app",formData,{
      withCredentials:true
    });
  }
  toggleBlocked(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"search/blocklist",formData,{
      withCredentials:true
    });
  }
  viewProfileDetails(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"search/view_profile_app",formData,{
      withCredentials:true
    });
  }
  toggleLike(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"search/member_like",formData,{
      withCredentials:true
    });
  }
  composeMessage(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    return this.http.post(this.baseUrl+"message/send_message",formData,{
      withCredentials:true
    });
  }
  updateMessageStatus(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"message/update_status",formData,{
      withCredentials:true
    });
  }
  updateNotificationStatus(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"api/update_notification_action",formData,{
      withCredentials:true
    });
  }
  expressInterestAction(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"express_interest/action_update_status",formData,{
      withCredentials:true
    });
  }
  expressInterest(formData:FormData){    
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"search/express_interest_sent",formData,{
      withCredentials:true
    });
  }
  getJoinedMembers(){   
    let formData = new FormData(); 
    formData.append("csrf_new_matrimonial",this.token);   
    formData.append("user_agent","NI-AAPP");
    return this.http.post(this.baseUrl+"my_dashboard/recent_profile",formData,{
      withCredentials:true
    });
  }
  getLoggedMembers(){ 
    let formData = new FormData();    
    formData.append("csrf_new_matrimonial",this.token);  
    formData.append("user_agent","NI-AAPP"); 
    return this.http.post(this.baseUrl+"my_dashboard/recent_profile",formData,{
      withCredentials:true
    });
  }
  getMatchs(){   
    // let formData = new FormData();  
    // formData.append("csrf_new_matrimonial",this.token);   
    // return this.http.post(this.baseUrl+"api/refine_search/"+page,formData,{
    //   withCredentials:true
    // });
  }
}
