import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstpersonComponent } from './firstperson.component';

describe('FirstpersonComponent', () => {
  let component: FirstpersonComponent;
  let fixture: ComponentFixture<FirstpersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstpersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstpersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
