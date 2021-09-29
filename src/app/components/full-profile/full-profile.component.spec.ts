import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullProfileComponent } from './full-profile.component';

describe('FullProfileComponent', () => {
  let component: FullProfileComponent;
  let fixture: ComponentFixture<FullProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
