import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDistributionChartComponent } from './exercise-distribution-chart.component';

describe('ExerciseDistributionChartComponent', () => {
  let component: ExerciseDistributionChartComponent;
  let fixture: ComponentFixture<ExerciseDistributionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciseDistributionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseDistributionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
