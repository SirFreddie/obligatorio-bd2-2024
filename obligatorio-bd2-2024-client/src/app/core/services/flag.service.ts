import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlagService {
  private apiUrl = 'https://flagsapi.com';

  constructor() { }

  getFlagUrl(countryCode: string, style: string = 'flat', size: number = 64): string {
    return `${this.apiUrl}/${countryCode}/${style}/${size}.png`;
  }
}
