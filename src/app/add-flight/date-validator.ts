import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateAfterValidator(fromDateControlName: string, toDateControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const fromDate = formGroup.get(fromDateControlName)?.value;
    const toDate = formGroup.get(toDateControlName)?.value;

    if (fromDate && toDate && new Date(toDate) <= new Date(fromDate)) {
      return { dateInvalid: true };
    }
    return null; 
  };
}
