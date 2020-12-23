import { Injectable } from '@angular/core';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class FDCalculatorService {
  fdArray: any = [];

  constructor() { }

  parse(input: string) {
    this.fdArray = input.toUpperCase().split(',');
    
    for (let i = 0; i < this.fdArray.length; i++) {
      if (!(/^[A-Za-z]+->[A-Za-z]+$/.test(this.fdArray[i]))) {
        let temp = this.fdArray[i]
        this.fdArray = [];
        throw new Error("'" + temp + "' is not valid!");
      }
    }
    return this.fdArray;
  }
}
