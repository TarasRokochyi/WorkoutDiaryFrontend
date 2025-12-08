import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseRecommendationComponent } from './exercise-recommendation.component';

describe('ExerciseRecommendationComponent', () => {
  let component: ExerciseRecommendationComponent;
  let fixture: ComponentFixture<ExerciseRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciseRecommendationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
