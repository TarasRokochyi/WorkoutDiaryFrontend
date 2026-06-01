import { Component, OnInit } from '@angular/core';
import { HeatmapCell } from '../../_interfaces/heatmap.model';

@Component({
  selector: 'app-workout-heatmap',
  standalone: false,
  templateUrl: './workout-heatmap.component.html',
  styleUrl: './workout-heatmap.component.css'
})
export class WorkoutHeatmapComponent implements OnInit {

  ngOnInit(): void {
  this.generateMockData();
}

  heatmap: HeatmapCell[] = [];

  // Add this property to your component
  monthLabels: { name: string; colIndex: number }[] = [];

  generateMockData(): void {
    const cells: HeatmapCell[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      let count = 0;
      const random = Math.random();

      if (random > 0.60) count = 1;
      if (random > 0.75) count = 2;
      if (random > 0.90) count = 3;
      if (random > 0.97) count = 5;

      cells.push({ date, count });
    }

    this.heatmap = cells;
    
    // Build the dynamic month labels after data is generated
    this.generateMonthLabels();
  }

  generateMonthLabels(): void {
    this.monthLabels = [];
    let lastMonth = -1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Loop week by week (every 7 days = 1 column)
    for (let i = 0; i < this.heatmap.length; i += 7) {
      const currentMonth = this.heatmap[i].date.getMonth();
      
      if (currentMonth !== lastMonth) {
        const colIndex = Math.floor(i / 7) + 1; // CSS Grid is 1-indexed

        // Avoid overlapping: Only add label if it's the first one, 
        // or if at least 3 columns have passed since the last label
        const lastLabel = this.monthLabels[this.monthLabels.length - 1];
        if (!lastLabel || (colIndex - lastLabel.colIndex) >= 3) {
          this.monthLabels.push({
            name: monthNames[currentMonth],
            colIndex: colIndex
          });
          lastMonth = currentMonth;
        }
      }
    }
  }

  getLevel(count: number): number {

    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;

    return 4;
  }

}
