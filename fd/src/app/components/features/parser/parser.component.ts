import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FDCalculatorService } from 'src/app/services/fdcalculator.service';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.css']
})
export class ParserComponent implements OnInit {
  fdArray: any;

  parseForm = new FormGroup({
    input: new FormControl(''),
  });
  
  constructor(public fdCalculator: FDCalculatorService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    try {
      this.fdArray = this.fdCalculator.parse(this.parseForm.get('input').value);
    } catch(err) {
      this.fdArray = [];
      console.log(err.message);
    }
  }
}
