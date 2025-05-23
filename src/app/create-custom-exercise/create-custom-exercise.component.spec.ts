import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomExerciseComponent } from './create-custom-exercise.component';

describe('CreateCustomExerciseComponent', () => {
  let component: CreateCustomExerciseComponent;
  let fixture: ComponentFixture<CreateCustomExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCustomExerciseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCustomExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
