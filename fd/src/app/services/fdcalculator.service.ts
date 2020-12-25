import { Injectable } from '@angular/core';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class FDCalculatorService {
  fdArray: any = [];
  attributeClosure = {};
  attributes = {};

  constructor() { }

  haveDuplicateAttributes(input){
    this.attributes = {};
    for (let i = 0; i < input.length; i++) {
      if (this.attributes[input[i]]) {
        this.attributes = {};
        throw new Error("There are duplicate (" + input[i] + ")");
      } else {
        this.attributes[input[i]] = true;
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
    this.attributeClosure = combi.sort(function(a, b) {
      return a.length - b.length || a.localeCompare(b)
    });
  }

  checkFDInAttributes(fdInput){
    for (let i = 0; i < fdInput.length; i++) {
      let temp = fdInput[i].split('');
      for (let j = 0; j < temp.length; j++) {
        if (this.attributes[temp[j]]) {
          continue;
        } else {
          throw new Error("'" + temp[j] + "' don't exist in the attributes");
        }
      }
    }
  }

  parse(attributes:string, fdInput: string) {
    this.getCombis(attributes);
    this.fdArray = fdInput.split(',');
    
    for (let i = 0; i < this.fdArray.length; i++) {
      let temp = this.fdArray[i];
      if (!(/^[A-Za-z]+->[A-Za-z]+$/.test(temp))) {
        this.fdArray = [];
        throw new Error("'" + temp + "' is not valid!");
      } else {
        let furtherSplit = this.fdArray[i].split('->');
        this.checkFDInAttributes(furtherSplit);
      }
    }
    return this.fdArray;
  }
}
