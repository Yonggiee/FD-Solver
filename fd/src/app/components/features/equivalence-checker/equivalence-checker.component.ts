import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FDCalculatorService } from 'src/app/services/fdcalculator.service';

@Component({
  selector: 'app-equivalence-checker',
  templateUrl: './equivalence-checker.component.html',
  styleUrls: ['./equivalence-checker.component.css']
})
export class EquivalenceCheckerComponent implements OnInit {

  errMsg: string = "";
  result: string = "";

  equiForm = new FormGroup({
    fdInput: new FormControl('', Validators.required)
  });

  constructor(public fdCalculator: FDCalculatorService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.result = "";
    this.errMsg = "";
    try {
      this.result = this.fdCalculator.checkEquivalence(this.equiForm.get('fdInput').value.toUpperCase());
    } catch (err) {
      this.errMsg = err.message;
    }
  }

}
