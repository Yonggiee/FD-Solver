import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalenceCheckerComponent } from './equivalence-checker.component';

describe('EquivalenceCheckerComponent', () => {
  let component: EquivalenceCheckerComponent;
  let fixture: ComponentFixture<EquivalenceCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalenceCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalenceCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
