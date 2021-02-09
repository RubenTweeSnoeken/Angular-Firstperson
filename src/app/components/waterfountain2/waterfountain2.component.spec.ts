import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Waterfountain2Component } from './waterfountain2.component';

describe('Waterfountain2Component', () => {
  let component: Waterfountain2Component;
  let fixture: ComponentFixture<Waterfountain2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Waterfountain2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Waterfountain2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
