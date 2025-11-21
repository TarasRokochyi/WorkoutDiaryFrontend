import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  kpis = [
    { title: 'Total Workouts', value: 18, icon: 'fitness_center' },
    { title: 'Total Volume Lifted', value: '12,450 kg', icon: 'bar_chart' },
    { title: 'Best Lift', value: '130 kg (Squat)', icon: 'military_tech' },
    { title: 'Avg Duration', value: '47 min', icon: 'timer' },
    { title: 'Most Frequent Exercise', value: 'Push-Ups', icon: 'repeat' }
  ];

  ngOnInit(): void {}
}

