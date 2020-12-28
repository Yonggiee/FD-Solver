import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FDCalculatorService } from 'src/app/services/fdcalculator.service';

@Component({
  selector: 'app-attribute-closure',
  templateUrl: './attribute-closure.component.html',
  styleUrls: ['./attribute-closure.component.css']
})
export class AttributeClosureComponent implements OnInit {
  originalOrder = (a: KeyValue<string,string>, b: KeyValue<string,string>): number => {
    return a.key.length - b.key.length || a.key.localeCompare(b.key);
  }
  attributeClosure;

  constructor(public fdCalculator: FDCalculatorService) { }

  ngOnInit(): void {
  }
  
  run() {
    this.fdCalculator.calculateAttributeClosure();
    this.attributeClosure = this.fdCalculator.attributeClosure;
  }

}
