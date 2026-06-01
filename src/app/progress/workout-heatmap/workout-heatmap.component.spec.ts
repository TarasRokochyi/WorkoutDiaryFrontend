import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutHeatmapComponent } from './workout-heatmap.component';

describe('WorkoutHeatmapComponent', () => {
  let component: WorkoutHeatmapComponent;
  let fixture: ComponentFixture<WorkoutHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutHeatmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
