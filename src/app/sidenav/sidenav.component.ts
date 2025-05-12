import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  constructor(public sidenavService: SidenavService) {}

  @HostBinding('class.is-expanded')
  get isExpanded() {
    return this.sidenavService.isExpanded;
  }
}
