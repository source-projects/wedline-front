import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characterLimiter'
})
export class CharacterLimiterPipe implements PipeTransform {

  transform(value: string, ...args: any[]): unknown {
    if(value){
      if(value.length>args[0]){
        return value.substring(0,args[0]) +" ...";
      }
    }   
    return value;
  }

}
