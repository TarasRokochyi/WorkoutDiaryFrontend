import { Component, HostBinding, OnInit } from '@angular/core';
import { SidenavService } from './sidenav.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../_interfaces/user.model';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  user?: User;

  constructor(public sidenavService: SidenavService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => this.user = user);
  }

  @HostBinding('class.is-expanded')
  get isExpanded() {
    return this.sidenavService.isExpanded;
  }
}
