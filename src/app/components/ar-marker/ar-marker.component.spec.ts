import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArMarkerComponent } from './ar-marker.component';

describe('ArLocationComponent', () => {
  let component: ArMarkerComponent;
  let fixture: ComponentFixture<ArMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArMarkerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
