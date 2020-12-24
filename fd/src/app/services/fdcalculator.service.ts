import { Injectable } from '@angular/core';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class FDCalculatorService {
  fdArray: any = [];
  attributeClosure = {};

  constructor() { }

  haveDuplicateAttributes(input){
    let map = {}
    for (let i = 0; i < input.length; i++) {
      if (map[input[i]]) {
        throw new Error("There are duplicate (" + input[i] + ")");
      } else {
        map[input[i]] = true;
      }
    }
  }

  getCombis(input){
    var array1 = [];
    for (var x = 0, y=1; x < input.length; x++,y++) {
      array1[x] = input.substring(x, y);
    }
    var combi = [];
    var temp= "";
    var slent = Math.pow(2, array1.length);

    for (var i = 0; i < slent ; i++) {
      temp= "";
      for (var j=0;j<array1.length;j++) {
          if ((i & Math.pow(2,j))){ 
              temp += array1[j];
          }
      } if (temp !== "") {
        combi.push(temp);
      }
    }
    this.attributeClosure = combi;
  }

  parse(attributes:string, fdInput: string) {
    this.getCombis(attributes);
    console.log(this.attributeClosure);
    this.fdArray = fdInput.toUpperCase().split(',');
    
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
