import { TestBed } from '@angular/core/testing';

import { FDCalculatorService } from './fdcalculator.service';

describe('FDCalculatorService', () => {
  let service: FDCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FDCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
