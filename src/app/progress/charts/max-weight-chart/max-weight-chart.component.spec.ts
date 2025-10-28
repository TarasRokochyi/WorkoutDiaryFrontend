import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxWeightChartComponent } from './max-weight-chart.component';

describe('MaxWeightChartComponent', () => {
  let component: MaxWeightChartComponent;
  let fixture: ComponentFixture<MaxWeightChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaxWeightChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaxWeightChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
