import { Component, OnInit } from '@angular/core';
import { FDCalculatorService } from 'src/app/services/fdcalculator.service';

@Component({
  selector: 'app-minimal-cover',
  templateUrl: './minimal-cover.component.html',
  styleUrls: ['./minimal-cover.component.css']
})
export class MinimalCoverComponent implements OnInit {
  splitFDs = [];
  keepFDs = [];
  removeFDs = [];
  constructor(public fdCalculator: FDCalculatorService) { }

  ngOnInit(): void {
  }

  run() {
    this.fdCalculator.calculateAttributeClosure();
    this.splitFDs = this.fdCalculator.splitFD();
    let newFDs = this.fdCalculator.removeUnnecessaryFDs(this.splitFDs);
    this.keepFDs = newFDs['keepFDs'];
    this.removeFDs = newFDs['removeFDs'];
  }

}


// add checker too
