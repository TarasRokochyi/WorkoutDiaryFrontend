import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Exercise } from '../../../_interfaces/exercise.model';
import { Workout } from '../../../_interfaces/workout.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ExerciseService } from '../../../shared/services/exercise.service';
import { WorkoutTemplateService } from '../../../shared/services/workout-template.service';
import { WorkoutExerciseVolume } from '../../../_interfaces/workout-exercise.model';
import { ChartService } from '../../../shared/services/chart.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-total-volume-chart',
  standalone: false,
  templateUrl: './total-volume-chart.component.html',
  styleUrls: ['./total-volume-chart.component.css']
})
export class TotalVolumeChartComponent implements OnInit{
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedExercise: string = '';

  // allExercises: Exercise[];
  allExercises: string[] = [];

  exerciseVolume: WorkoutExerciseVolume[];

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Total Volume (kg)',
        data: [],
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Volume (kg)' },
      },
      x: {
        title: { display: true, text: 'Workout Date' },
      },
    },
  };

  constructor(private exerciseService: ExerciseService, 
              private chartService: ChartService,
              private workoutTemplateService: WorkoutTemplateService, 
              private router: Router, 
              private snackBar: MatSnackBar,
              public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    firstValueFrom(this.chartService.getExercisesVolume()).then(data => {
      this.exerciseVolume = data;

      // this.allExercises = Array.from(
      //   new Map(this.exerciseVolume.map(x => [x.exercise.exerciseId, x.exercise])).values()
      // );

      this.allExercises = Array.from(
        new Map(this.exerciseVolume.map(x => [x.name, x.name])).values()
      );

      if (this.allExercises.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.allExercises.length);
        this.selectedExercise = this.allExercises[randomIndex];
        this.startDate = new Date()
        this.endDate = new Date()

        this.startDate.setMonth(this.startDate.getMonth() - 1)
        this.filterWorkouts()
      }
    })


  }

  /** Called when user clicks Apply */
  filterWorkouts(): void {
    let filtered = this.exerciseVolume;

    if (this.selectedExercise)
      filtered = filtered.filter(e => e.name === this.selectedExercise);

    if (this.startDate && this.endDate)
      filtered = filtered.filter(e => new Date(e.date) >= this.startDate! && new Date(e.date) <= this.endDate!);

    this.updateChart(filtered);
  }

  /** Updates chart labels and data */
  updateChart(data: WorkoutExerciseVolume[]): void {
    const labels = data.map(e => new Date(e.date).toLocaleDateString());
    const volumes = data.map(e => e.volume);

    this.chartData = {
      labels,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: volumes,
          label: this.selectedExercise
            ? `${this.selectedExercise} Volume (kg)`
            : 'Total Volume (kg)',
        },
      ],
    };
  }
}
