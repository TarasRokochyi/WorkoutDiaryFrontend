import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalVolumeChartComponent } from './total-volume-chart.component';

describe('TotalVolumeChartComponent', () => {
  let component: TotalVolumeChartComponent;
  let fixture: ComponentFixture<TotalVolumeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalVolumeChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalVolumeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
