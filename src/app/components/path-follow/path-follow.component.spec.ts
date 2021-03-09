import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathFollowComponent } from './path-follow.component';

describe('PathFollowComponent', () => {
  let component: PathFollowComponent;
  let fixture: ComponentFixture<PathFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathFollowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PathFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
