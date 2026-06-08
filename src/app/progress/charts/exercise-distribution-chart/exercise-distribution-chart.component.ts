import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-exercise-distribution-chart',
  standalone: false,
  templateUrl: './exercise-distribution-chart.component.html',
  styleUrl: './exercise-distribution-chart.component.css'
})
export class ExerciseDistributionChartComponent implements OnInit {

  exerciseData = [
    { name: 'Push-Ups',     count: 15 },
    { name: 'Pull-Ups',     count: 8  },
    { name: 'Squats',       count: 10 },
    { name: 'Bench Press',  count: 6  },
    { name: 'Running',      count: 5  }
  ];

  colors = ['#3f51b5', '#7986cb', '#ff4081', '#4caf50', '#ff9800'];

  get total(): number {
    return this.exerciseData.reduce((sum, e) => sum + e.count, 0);
  }

  get max(): number {
    return Math.max(...this.exerciseData.map(e => e.count));
  }

  getPercent(count: number): number {
    return Math.round((count / this.total) * 100);
  }

  getBarWidth(count: number): number {
    return Math.round((count / this.max) * 100);
  }

  chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.exerciseData.map(e => e.name),
    datasets: [{
      data: this.exerciseData.map(e => e.count),
      backgroundColor: this.colors,
      borderWidth: 3,
      borderColor: '#f5f7fa',
      hoverOffset: 6
    }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      title:  { display: false }
    }
  };

  ngOnInit(): void {}
}
