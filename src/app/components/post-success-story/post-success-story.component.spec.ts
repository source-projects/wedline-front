import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSuccessStoryComponent } from './post-success-story.component';

describe('PostSuccessStoryComponent', () => {
  let component: PostSuccessStoryComponent;
  let fixture: ComponentFixture<PostSuccessStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSuccessStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostSuccessStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
