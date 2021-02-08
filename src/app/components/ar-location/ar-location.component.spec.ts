import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArLocationComponent } from './ar-location.component';

describe('ArLocationComponent', () => {
  let component: ArLocationComponent;
  let fixture: ComponentFixture<ArLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
