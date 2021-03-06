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
        this.fdArray = this.parseFDInAttributes(this.fdArray, temp);
      }
    }
    this.attributes = attributes;
    this.fdHashmap = this.createFDHashmap(this.fdArray);
    this.attributeClosure = this.createAttributesClosureArray(this.fdHashmap);
    this.calculateAttributeClosure();
    this.attributeClosure = this.removeUnnecessaryAttributeClosure(this.attributeClosure);
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
    let sortedKeys = Object.keys(hashmap).sort(function(a, b) {
      return a.length - b.length || a.localeCompare(b)
    });
    for (let i = 0; i < sortedKeys.length; i++) {
      let array = hashmap[sortedKeys[i]];
      let attributesInKey = sortedKeys[i].split('');
      for (let j = 0; j < array.length; j++) {
        if (!(attributesInKey.includes(array[j]))) {
          if (!(sortedKeys[i] in attributeClosureTemp)) {
            attributeClosureTemp[sortedKeys[i]] = [];
          }
        }
      }
    }
    return attributeClosureTemp;
  }

  // parse FDs to remove unnecessary attributes
  parseFDInAttributes(fdArray, fd) {
    let splitFDAtArrow = fd.split('->');
    let fromAttributes = Array.from(new Set(splitFDAtArrow[0].split('').sort()));
    let afterAttributes = Array.from(new Set(splitFDAtArrow[1].split('').sort()));
    afterAttributes = afterAttributes.filter( function( ele ) {
      return fromAttributes.indexOf( ele ) < 0;
    });
    if (afterAttributes.length > 0) {
      let newFD = fromAttributes.join('') + '->' + afterAttributes.join('');
      if (fdArray.indexOf(newFD) < 0) {
        fdArray.push(newFD);
      }
    }
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

  // Remove unnecessary attribute combis in attribute combinations
  removeUnnecessaryAttributeClosure(attributeClosure) {
    const keys = Object.keys(attributeClosure);
    let deletedKeys = {};
    console.log(attributeClosure);
    for (let i = 0; i < keys.length - 1; i++) {
      let elementsOfKey1 = keys[i].split('');
      let obj = {};
      console.log(keys[i]);
      if (deletedKeys[keys[i]]) {
        continue;
      }
      for (let j = i + 1; j < keys.length; j++) {
        if (deletedKeys[keys[j]]) {
          continue;
        }
        let elementsOfKey2 = keys[j].split('');
        elementsOfKey2.forEach((ele, index) => {
          obj[ele] = index;
        });
        let checkKey1InKey2 = elementsOfKey1.every((el) => {
          return obj[el] !== undefined;
        });
        if (checkKey1InKey2) {
          if (attributeClosure[keys[i]] == attributeClosure[keys[j]]) {
            deletedKeys[keys[j]] = true;
            delete attributeClosure[keys[j]];
          } else {
            let arrayInKey2NotInKey1 = elementsOfKey2.filter( function( ele ) {
              return elementsOfKey1.indexOf( ele ) < 0;
            });
            let arrayInAttribute2NotInAttribute1 = attributeClosure[keys[j]].split('').filter( function( ele ) {
              return attributeClosure[keys[i]].split('').indexOf( ele ) < 0;
            });
            if (arrayInKey2NotInKey1.join('') == arrayInAttribute2NotInAttribute1.join('')){
              deletedKeys[keys[j]] = true;
              delete attributeClosure[keys[j]];
            }
          }
        }
      }
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
    let splitFDArray = [];

    for (let key in this.attributeClosure) {
      let keyAttributes = key.split('');
      let tempArray = this.attributeClosure[key].split('');
      for (let i = 0; i < tempArray.length; i++) {
        if (keyAttributes.indexOf(tempArray[i]) < 0) {
          let newFD = key + '->' + tempArray[i];
          splitFDArray.push(newFD);
        }
      }
    }
    return splitFDArray;
  }

  // remove unnecessary FDs
  removeUnnecessaryFDs(fdArray) {
    let newFDDict = {};
    newFDDict['removeFDs'] = [];
    newFDDict['keepFDs'] = [];
    
    let itr = 0;
    while(itr < fdArray.length) {
      let cloneArray = fdArray.slice();
      cloneArray.splice(itr, 1);
      cloneArray = cloneArray.filter(function( ele ) {
        return newFDDict['removeFDs'].indexOf( ele ) < 0;
      });
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

  // equivalence checker
  checkEquivalence(fdInput) {
    let tempArray = fdInput.split(',');
    let fdArray = [];
    for (let i = 0; i < tempArray.length; i++) {
      let temp = tempArray[i];
      if (!(/^[A-Za-z]+->[A-Za-z]+$/.test(temp))) {
        tempArray = [];
        throw new Error("'" + temp + "' is not valid!");
      } else {
        let furtherSplit = tempArray[i].split('->');
        this.checkFDInAttributes(furtherSplit);
        fdArray = this.parseFDInAttributes(fdArray, temp);
      }
    }
    let fdHashMap = this.createFDHashmap(fdArray);
    let attributeClosure = this.createAttributesClosureArray(fdHashMap);
    attributeClosure = this.populateAttributeClosure(fdHashMap, attributeClosure);
    attributeClosure = this.removeUnnecessaryAttributeClosure(attributeClosure);
    return this.isHashMapEqual(attributeClosure, this.attributeClosure) ? "True" : "False";
  }
}
