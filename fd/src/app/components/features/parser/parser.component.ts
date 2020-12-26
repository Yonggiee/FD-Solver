import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FDCalculatorService } from 'src/app/services/fdcalculator.service';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements OnInit {
  fdArray: any;
  errMsg: string = "";

  parseForm = new FormGroup({
    fdInput: new FormControl('', Validators.required),
    attributes: new FormControl('', 
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$')
      ])
  });
  
  constructor(public fdCalculator: FDCalculatorService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    try {
      let attributes = this.parseForm.get('attributes').value.toUpperCase();
      let input = this.parseForm.get('fdInput').value.toUpperCase();
      this.fdArray = this.fdCalculator.parse(attributes, input);
      this.errMsg = '';
    } catch(err) {
      this.fdArray = [];
      this.errMsg = err.message;
    }
  }
}
