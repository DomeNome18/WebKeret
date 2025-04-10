import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: true
})

export class DateFormatterPipe implements PipeTransform {
  transform(value: Date | string | null): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return '';
    }

    const yyyy = date.getFullYear();
    const mm = this.padZeroes(date.getMonth());
    const dd = this.padZeroes(date.getDate());

    return `${yyyy}-${mm}-${dd}`;
  }

  private padZeroes(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
