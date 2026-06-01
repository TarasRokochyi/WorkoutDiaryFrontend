import { Component, OnInit } from '@angular/core';
import { IHeatmapDay, ICalendarHeatmapOptions, HeatMapCalendarType, HeatmapLevelsDirection, IHeatmapColor} from '@ngeenx/nx-calendar-heatmap-utils';
import { DateTime,  } from 'luxon';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  public startDate: DateTime = DateTime.now().startOf("year");
  public heatmapData: IHeatmapDay[] = [];
  public options: ICalendarHeatmapOptions;


  selectedPeriod = '30d';

  onPeriodChange(): void {
  }


kpis = [
  { title: 'Workouts Completed', value: 18, icon: 'fitness_center' },
  { title: 'Training Time', value: '14.2 hrs', icon: 'timer' },
  { title: 'Top Exercise', value: 'Bench Press', icon: 'emoji_events' }
];

  ngOnInit(): void {
    this.options = this.getOptions();
    this.heatmapData = this.generateHeatmapData(this.startDate);
  }

  private getOptions(): ICalendarHeatmapOptions {
    return {
      type: HeatMapCalendarType.YEARLY,
      startDate: this.startDate,
      cellSize: 15,
      hideEmptyDays: false,
      locale: 'en',
      colors: this.heatmapColors,
      heatmapLegend: {
        display: true,
        direction: HeatmapLevelsDirection.RIGHT,
      },
    };
  }

  // random data generator for yearly view
  private generateHeatmapData(startDate: DateTime): IHeatmapDay[] {
    // get end of the year
    const endDate = startDate.endOf("year");
    // get days between start and end date
    const daysBetween = Math.floor(endDate.diff(startDate, "days").days);
    const heatmap: IHeatmapDay[] = [];

    let currentDate = startDate;

    // generate random data for each day
    for (let i = 0; i <= daysBetween; i++) {
      const value = Math.floor(Math.random() * 101);

      const day: IHeatmapDay = {
        date: currentDate,
        count: value,
        data: {
          index: i,
          value,
        },
      };

      heatmap.push(day);

      // text day
      currentDate = currentDate.plus({ days: 1 });
    }

    // then return the generated data to bind to the heatmap component
    return heatmap;
  }

  heatmapColors: IHeatmapColor[] = [
      {
        min: Number.NEGATIVE_INFINITY,
        max: 0,
        isDefault: true,
        className: 'custom-variant2-level-0',
      },
      {
        min: 1,
        max: 10,
        isDefault: false,
        className: 'custom-variant2-level-1',
      },
      {
        min: 10,
        max: 30,
        isDefault: false,
        className: 'custom-variant2-level-2',
      },
      {
        min: 30,
        max: 40,
        isDefault: false,
        className: 'custom-variant2-level-3',
      },
      {
        min: 40,
        max: 50,
        isDefault: false,
        className: 'custom-variant2-level-4',
      },
      {
        min: 50,
        max: Number.POSITIVE_INFINITY,
        isDefault: false,
        className: 'custom-variant2-level-5',
      },
  ];
}

