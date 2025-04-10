import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kWhAppender'
})
export class KWhAppenderPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return '';
    }

    return `${value} kWh`;
  }
}
