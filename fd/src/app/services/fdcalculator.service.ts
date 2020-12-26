import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FDCalculatorService {
  fdArray: any = [];
  attributeClosure = {};
  fdHashmap = {};
  attributes: string;

  constructor() { }

  // create the hashmap for the attributeClosure
  // check if there are any duplicate attributes
  // check if the attributes in FD exists in the attributes specified
  parse(attributes:string, fdInput: string) {
    this.createAttributesClosureArray(attributes);
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
    this.attributes = attributes;
    return this.fdArray;
  }

  createAttributesClosureArray(input) {
    this.attributeClosure = {};
    for (let i = 0; i < input.length; i++) {
      if (input[i] in this.attributeClosure) {
        throw new Error("There are duplicate '" + input[i] + "'");
      } else {
        this.attributeClosure[input[i]] = [];
      }
    }
  }

  checkFDInAttributes(fdInput) {
    for (let i = 0; i < fdInput.length; i++) {
      let temp = fdInput[i].split('');
      for (let j = 0; j < temp.length; j++) {
        if (temp[j] in this.attributeClosure) {
          continue;
        } else {
          throw new Error("'" + temp[j] + "' don't exist in the attributes");
        }
      }
    }
  }

  calculateAttributeClosure() {
    this.createFDHashmap(this.attributes);
    this.populateAttributeClosure();
  }

  // create a hashmap which represents the FDs
  createFDHashmap(attributes: string) {
    this.fdHashmap = {};
    for (let i = 0; i < this.fdArray.length; i++) {
      let temp = this.fdArray[i];
      let furtherSplit = this.fdArray[i].split('->');
      if (!(furtherSplit[0] in this.fdHashmap)) {
        this.fdHashmap[furtherSplit[0]] = furtherSplit[0].split('');
      }
      this.fdHashmap[furtherSplit[0]] = 
        Array.from(new Set(this.fdHashmap[furtherSplit[0]].concat(furtherSplit[1].split('')))); 
    }
  }

  // fill the attributes of the attribute closure
  populateAttributeClosure() {
    for (let key in this.attributeClosure) {
      let checkedCombi = {};
      this.attributeClosure[key] = key;
      let prevLength = key.length;
      while(true) {
        let combis = this.getCombis(this.attributeClosure[key]);
        for (let i = 0; i < combis.length; i++) {
          if (checkedCombi[combis[i]]) {
            continue;
          }
          let temp = 
            Array.from(new Set(this.attributeClosure[key].split('').concat(this.fdHashmap[combis[i]])));
          this.attributeClosure[key] = temp.join('');
          checkedCombi[combis[i]] = true;
        }
        let newLength = this.attributeClosure[key].length;
        if (newLength == prevLength) {
          break;
        }
        prevLength = newLength;
      }
    }
    for (let key in this.attributeClosure) {
      this.attributeClosure[key] = this.attributeClosure[key].split('').sort().join('');
    }
    console.log(this.attributeClosure);
  }

  // get substring combinations of string
  getCombis(input) {
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
    return combi.sort(function(a, b) {
      return a.length - b.length || a.localeCompare(b)
    });
  }
}
