import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav-link',
  standalone: false,
  templateUrl: './sidenav-link.component.html',
  styleUrl: './sidenav-link.component.css'
})
export class SidenavLinkComponent {

  @Input()
  routerLink?: string;

  @Input()
  routerLinkActiveOptions: { exact: boolean } = { exact: true };
}
