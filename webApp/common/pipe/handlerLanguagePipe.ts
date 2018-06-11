import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'handlerLanguage'})
export class HandlerLanguagePipe implements PipeTransform {
  transform(language: string) {
    let newLanguage = language.slice(0,3);
    return newLanguage;
  }
}