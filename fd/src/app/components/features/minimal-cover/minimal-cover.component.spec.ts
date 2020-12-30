import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalCoverComponent } from './minimal-cover.component';

describe('MinimalCoverComponent', () => {
  let component: MinimalCoverComponent;
  let fixture: ComponentFixture<MinimalCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimalCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimalCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
