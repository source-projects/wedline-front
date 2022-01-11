import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpireDialogComponent } from './session-expire-dialog.component';

describe('SessionExpireDialogComponent', () => {
  let component: SessionExpireDialogComponent;
  let fixture: ComponentFixture<SessionExpireDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpireDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpireDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
