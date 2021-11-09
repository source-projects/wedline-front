import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment';
const moment = _moment;
@Pipe({
  name: 'dateBeautifier'
})
export class DateBeautifierPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let date = moment(value,"YYYY-MM-DD HH:mm:ss");
    if(date.isSame(moment(),'day')){
      return "Today " + date.format('h:mm a');
    }
    if(date.isSame(moment().subtract(1,"days"),'day')){      
      return "Yesterday " + date.format('h:mm a');
    }
    return date.format('Do MMM YYYY h:mm a');
  }
}
