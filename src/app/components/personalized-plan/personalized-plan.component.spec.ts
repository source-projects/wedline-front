import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizedPlanComponent } from './personalized-plan.component';

describe('PersonalizedPlanComponent', () => {
  let component: PersonalizedPlanComponent;
  let fixture: ComponentFixture<PersonalizedPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizedPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizedPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
