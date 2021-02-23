import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplineEditorComponent } from './spline-editor.component';

describe('SplineEditorComponent', () => {
  let component: SplineEditorComponent;
  let fixture: ComponentFixture<SplineEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplineEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
