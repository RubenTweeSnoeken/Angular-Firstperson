import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindmillComponent } from './windmill.component';

describe('WindmillComponent', () => {
  let component: WindmillComponent;
  let fixture: ComponentFixture<WindmillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindmillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindmillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
