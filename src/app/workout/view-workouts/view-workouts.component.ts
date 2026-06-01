import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../../shared/services/workout.service';
import { WorkoutShort } from '../../_interfaces/workout.model';

interface WorkoutWithNumber extends WorkoutShort {
  number: number;
}

export interface WeekGroup {
  label: string;
  workouts: WorkoutWithNumber[];
  isEmpty: boolean;
}

@Component({
  selector: 'app-view-workouts',
  standalone: false,
  templateUrl: './view-workouts.component.html',
  styleUrl: './view-workouts.component.css'
})
export class ViewWorkoutsComponent implements OnInit {
  workouts: WorkoutShort[] = [];
  weekGroups: WeekGroup[] = [];
  loading = true;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit(): void {
    this.workoutService.getWorkouts().subscribe({
      next: (data) => {
        this.workouts = data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.weekGroups = this.buildWeekGroups(this.workouts);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching workouts', err);
        this.loading = false;
      }
    });
  }

  private buildWeekGroups(workouts: WorkoutShort[]): WeekGroup[] {
    if (workouts.length === 0) return [];

    const total = workouts.length;

    // Map week key -> numbered workouts
    const map = new Map<string, WorkoutWithNumber[]>();
    workouts.forEach((w, i) => {
      const monday = this.getMonday(new Date(w.date));
      const key = monday.toISOString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ ...w, number: total - i });
    });

    const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    const newestMonday = new Date(sortedKeys[0]);
    const oldestMonday = new Date(sortedKeys[sortedKeys.length - 1]);

    const groups: WeekGroup[] = [];
    const cursor = new Date(newestMonday);

    // Walk week by week, inserting empty groups where there are no workouts
    while (cursor >= oldestMonday) {
      const key = cursor.toISOString();
      const sunday = new Date(cursor);
      sunday.setDate(cursor.getDate() + 6);
      const label = `${this.fmt(cursor)} – ${this.fmt(sunday)}`;

      groups.push({
        label,
        workouts: map.get(key) ?? [],
        isEmpty: !map.has(key),
      });

      cursor.setDate(cursor.getDate() - 7);
    }

    return groups;
  }

  private getMonday(d: Date): Date {
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private fmt(d: Date): string {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
