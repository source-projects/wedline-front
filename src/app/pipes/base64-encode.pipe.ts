import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64Encode'
})
export class Base64EncodePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return btoa(value);
  }

}
