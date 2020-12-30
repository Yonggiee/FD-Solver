import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FDCalculatorService {
  fdArray: any = [];
  attributeClosure = {};
  fdHashmap = {};
  attributes: string;
  attributesArray = {};

  constructor() { }

  reset() {
    this.fdArray = [];
    this.attributeClosure = {};
    this.fdHashmap = {};
    this.attributes = '';
    this.attributesArray = {};
  }

  // check if there are any duplicate attributes
  // check if the attributes in FD exists in the attributes specified
  // parse FDs to remove unnecessary attributes
  // create the hashmap for the attributes 
  parse(attributes:string, fdInput: string) {
    this.reset();
    this.createAttributesArray(attributes);
    let tempArray = fdInput.split(',');
    for (let i = 0; i < tempArray.length; i++) {
      let temp = tempArray[i];
      if (!(/^[A-Za-z]+->[A-Za-z]+$/.test(temp))) {
        tempArray = [];
        throw new Error("'" + temp + "' is not valid!");
      } else {
        let furtherSplit = tempArray[i].split('->');
        this.checkFDInAttributes(furtherSplit);
        this.parseFDInAttributes(this.fdArray, temp);
      }
    }
    this.attributes = attributes;
    this.fdHashmap = this.createFDHashmap(this.fdArray);
    this.attributeClosure = this.createAttributesClosureArray(this.fdHashmap);
    return this.fdArray;
  }

  createAttributesArray(input) {
    for (let i = 0; i < input.length; i++) {
      if (input[i] in this.attributesArray) {
        throw new Error("There are duplicate '" + input[i] + "'");
      } else {
        this.attributesArray[input[i]] = true;
      }
    }
  }

  checkFDInAttributes(fdInput) {
    for (let i = 0; i < fdInput.length; i++) {
      let temp = fdInput[i].split('');
      for (let j = 0; j < temp.length; j++) {
        if (temp[j] in this.attributesArray) {
          continue;
        } else {
          throw new Error("'" + temp[j] + "' don't exist in the attributes");
        }
      }
    }
  }

  createAttributesClosureArray(hashmap) {
    let attributeClosureTemp = {};
    for (let key in hashmap) {
      let array = hashmap[key];
      let attributesInKey = key.split('');
      for (let i = 0; i < array.length; i++) {
        if (!(attributesInKey.includes(array[i]))) {
          if (!(key in attributeClosureTemp)) {
            attributeClosureTemp[key] = [];
          }
        }
      }
    }
    return attributeClosureTemp;
  }

  // parse FDs to remove unnecessary attributes
  parseFDInAttributes(fdArray, fd) {
    let splitFDAtArrow = fd.split('->');
    let fromAttributes = Array.from(new Set(splitFDAtArrow[0].split('')));
    let afterAttributes = Array.from(new Set(splitFDAtArrow[1].split('')));
    afterAttributes = afterAttributes.filter( function( ele ) {
      return fromAttributes.indexOf( ele ) < 0;
    });
    let newFD = fromAttributes.join('') + '->' + afterAttributes.join('');
    fdArray.push(newFD);
    return fdArray;
  }

  calculateAttributeClosure() {
    this.attributeClosure = this.populateAttributeClosure(this.fdHashmap, this.attributeClosure);
  }

  // create a hashmap which represents the FDs
  createFDHashmap(fdArray) {
    let fdHashmap = {};
    for (let i = 0; i < fdArray.length; i++) {
      let temp = fdArray[i];
      let furtherSplit = fdArray[i].split('->');
      if (!(furtherSplit[0] in fdHashmap)) {
        fdHashmap[furtherSplit[0]] = furtherSplit[0].split('');
      }
      fdHashmap[furtherSplit[0]] = 
        Array.from(new Set(fdHashmap[furtherSplit[0]].concat(furtherSplit[1].split('')))); 
    }
    return fdHashmap;
  }

  // fill the attributes of the attribute closure
  populateAttributeClosure(fdHashmap, attributeClosure) {
    for (let key in attributeClosure) {
      let checkedCombi = {};
      attributeClosure[key] = key;
      let prevLength = key.length;
      while(true) {
        let combis = this.getCombis(attributeClosure[key]);
        for (let i = 0; i < combis.length; i++) {
          if (checkedCombi[combis[i]]) {
            continue;
          }
          let temp = 
            Array.from(new Set(attributeClosure[key].split('').concat(fdHashmap[combis[i]])));
          attributeClosure[key] = temp.join('');
          checkedCombi[combis[i]] = true;
        }
        let newLength = attributeClosure[key].length;
        if (newLength == prevLength) {
          break;
        }
        prevLength = newLength;
      }
    }
    for (let key in attributeClosure) {
      attributeClosure[key] = attributeClosure[key].split('').sort().join('');
    }
    return attributeClosure;
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

  // split FDs
  splitFD() {
    this.calculateAttributeClosure();
    let splitFDArray = [];
    for (let key in this.fdHashmap) {
      let tempArray = this.fdHashmap[key];
      for (let i = key.length; i < tempArray.length; i++) {
        let newFD = key + '->' + tempArray[i];
        splitFDArray.push(newFD);
      }
    }
    return splitFDArray;
  }

  // remove unnecessary FDs
  removeUnnecessaryFDs(fdArray) {
    let newFDDict = {};
    newFDDict['removeFDs'] = [];
    newFDDict['keepFDs'] = [];
    console.log(this.attributeClosure);
    
    let itr = 0;
    while(itr < fdArray.length) {
      let cloneArray = fdArray.slice();
      cloneArray.splice(itr, 1);
      let hashMapTemp = this.createFDHashmap(cloneArray);
      let attributeClosureTemp = this.createAttributesClosureArray(hashMapTemp);
      attributeClosureTemp = this.populateAttributeClosure(hashMapTemp, attributeClosureTemp);
      if (this.isHashMapEqual(this.attributeClosure, attributeClosureTemp)) {
        newFDDict['removeFDs'].push(fdArray[itr]);
      } else {
        newFDDict['keepFDs'].push(fdArray[itr]);
      }
      itr++;
    }
    return newFDDict;
  }

  isHashMapEqual(map1, map2) {
    const keys1 = Object.keys(map1), keys2 = Object.keys(map2);
    let match = true;
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (map1[key] !== map2[key]) {
        match = false; 
        break; 
      }
    }
    return match;
  }
}
