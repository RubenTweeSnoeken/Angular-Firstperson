import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterfountainComponent } from './waterfountain.component';

describe('WaterfountainComponent', () => {
  let component: WaterfountainComponent;
  let fixture: ComponentFixture<WaterfountainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaterfountainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterfountainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
