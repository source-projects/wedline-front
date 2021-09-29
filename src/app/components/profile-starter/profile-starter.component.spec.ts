import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileStarterComponent } from './profile-starter.component';

describe('ProfileStarterComponent', () => {
  let component: ProfileStarterComponent;
  let fixture: ComponentFixture<ProfileStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileStarterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
