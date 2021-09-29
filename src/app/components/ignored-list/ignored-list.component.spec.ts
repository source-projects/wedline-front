import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoredListComponent } from './ignored-list.component';

describe('IgnoredListComponent', () => {
  let component: IgnoredListComponent;
  let fixture: ComponentFixture<IgnoredListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgnoredListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoredListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
