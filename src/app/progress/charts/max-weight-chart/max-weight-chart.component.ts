import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import { Exercise } from '../../../_interfaces/exercise.model';
import { WorkoutExerciseMaxWeight, WorkoutExerciseVolume } from '../../../_interfaces/workout-exercise.model';
import { ChartService } from '../../../shared/services/chart.service';
import { ExerciseService } from '../../../shared/services/exercise.service';
import { WorkoutTemplateService } from '../../../shared/services/workout-template.service';

@Component({
  selector: 'app-max-weight-chart',
  standalone: false,
  templateUrl: './max-weight-chart.component.html',
  styleUrls: ['./max-weight-chart.component.css']
})
export class MaxWeightChartComponent implements OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;

  allExercises: string[] = [];
  selectedExercise: string = ''; // allow multiple exercises
  exercisesMaxWeight: WorkoutExerciseMaxWeight[] = [];

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Max Weight Progress per Exercise' }
    },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { beginAtZero: true, title: { display: true, text: 'Weight (kg)' } }
    }
  };

  constructor(
    private exerciseService: ExerciseService,
    private chartService: ChartService,
    private workoutTemplateService: WorkoutTemplateService,
    private router: Router,
    private snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    firstValueFrom(this.chartService.getExercisesMaxWeight()).then(data => {
      this.exercisesMaxWeight = data;

      this.allExercises = Array.from(
        new Map(this.exercisesMaxWeight.map(x => [x.name, x.name])).values()
      );
    })

  }

  /** Called when user clicks Apply */
  filterWorkouts(): void {
    let filtered = this.exercisesMaxWeight;

    if (this.selectedExercise)
      filtered = filtered.filter(e => this.selectedExercise.includes(e.name));

    if (this.startDate && this.endDate)
      filtered = filtered.filter(
        e => new Date(e.date) >= this.startDate! && new Date(e.date) <= this.endDate!
      );

    this.updateChart(filtered);
  }

  /** Updates the line chart with max weight per date per exercise */
  updateChart(data: WorkoutExerciseMaxWeight[]): void {
    if (!data.length) return;

    // group by exercise
    const grouped = new Map<string, WorkoutExerciseMaxWeight[]>();
    data.forEach(entry => {
      if (!grouped.has(entry.name)) grouped.set(entry.name, []);
      grouped.get(entry.name)!.push(entry);
    });

    // prepare labels (sorted unique dates)
    const allDates = Array.from(new Set(data.map(e => new Date(e.date).toLocaleDateString()))).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // color palette for multiple exercises
    const colors = ['#E74C3C', '#2ECC71', '#3498DB', '#F39C12', '#9B59B6', '#1ABC9C'];

    const datasets = Array.from(grouped.entries()).map(([name, entries], idx) => {
      // find max weight per date
      const dateToMaxWeight = new Map<string, number>();

      entries.forEach(e => {
        const date = new Date(e.date).toLocaleDateString();
        const currentMax = dateToMaxWeight.get(date) || 0;
        // assume e.volume can represent total weight lifted or weight per rep
        // you might replace this with e.weight if available
        dateToMaxWeight.set(date, Math.max(currentMax, e.maxWeight));
      });

      const dataPoints = allDates.map(d => dateToMaxWeight.get(d) ?? null);

      return {
        label: name,
        data: dataPoints,
        borderColor: colors[idx % colors.length],
        backgroundColor: colors[idx % colors.length] + '33', // semi-transparent
        fill: false,
        tension: 0.3,
        pointRadius: 5
      };
    });

    this.chartData = { labels: allDates, datasets };
  }
}