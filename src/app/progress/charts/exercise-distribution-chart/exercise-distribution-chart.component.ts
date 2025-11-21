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
    { name: 'Push-Ups', count: 15 },
    { name: 'Pull-Ups', count: 8 },
    { name: 'Squats', count: 10 },
    { name: 'Bench Press', count: 6 },
    { name: 'Running', count: 5 }
  ];

  // Pie chart data
  chartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.exerciseData.map(e => e.name),
    datasets: [
      {
        data: this.exerciseData.map(e => e.count),
        backgroundColor: [
          '#3f51b5',  // blue
          '#ff4081',  // pink
          '#4caf50',  // green
          '#ff9800',  // orange
          '#9c27b0'   // purple
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 8
      }
    ]
  };

  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: { size: 14 }
        }
      },
      title: {
        display: true,
        text: 'Exercise Distribution (Last 30 Days)',
        font: { size: 18 },
        color: '#333'
      }
    }
  };

  ngOnInit(): void {}
}

