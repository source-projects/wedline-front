import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyShortlistComponent } from './my-shortlist.component';

describe('MyShortlistComponent', () => {
  let component: MyShortlistComponent;
  let fixture: ComponentFixture<MyShortlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyShortlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyShortlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
