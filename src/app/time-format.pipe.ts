import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Assuming value is in "HH:mm:ss" format
    const parts = value.split(':');
    if (parts.length < 2) return value; // return original if format is unexpected
    
    return `${parts[0]}:${parts[1]}`; // return HH:mm
  }
}

