import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceOrBackupNotForProductionComponent } from './reference-or-backup-not-for-production.component';

describe('ReferenceOrBackupNotForProductionComponent', () => {
  let component: ReferenceOrBackupNotForProductionComponent;
  let fixture: ComponentFixture<ReferenceOrBackupNotForProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceOrBackupNotForProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceOrBackupNotForProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
