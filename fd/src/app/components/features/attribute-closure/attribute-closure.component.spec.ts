import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeClosureComponent } from './attribute-closure.component';

describe('AttributeClosureComponent', () => {
  let component: AttributeClosureComponent;
  let fixture: ComponentFixture<AttributeClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
