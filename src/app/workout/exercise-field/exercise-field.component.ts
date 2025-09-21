import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Exercise } from '../../_interfaces/exercise.model';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-exercise-field',
  standalone: false,
  templateUrl: './exercise-field.component.html',
  styleUrl: './exercise-field.component.css'
})
export class ExerciseFieldComponent implements OnInit, ControlValueAccessor{

  @Output() selected = new EventEmitter<number>();

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  @Input() index: number;

  @Input() allExercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];

  constructor(){}
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredExercises = this.allExercises.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  onExerciseChange(): void {
    this.selected.emit(this.index);
  }
}
