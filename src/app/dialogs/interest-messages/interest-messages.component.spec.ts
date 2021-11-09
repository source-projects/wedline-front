import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestMessagesComponent } from './interest-messages.component';

describe('InterestMessagesComponent', () => {
  let component: InterestMessagesComponent;
  let fixture: ComponentFixture<InterestMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
