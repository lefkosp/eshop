import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

enum HeaderComponents {
  HOME = 'home',
  CATALOG = 'catalog',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public HeaderComponents = HeaderComponents;
  public activeComponent: HeaderComponents = HeaderComponents.HOME;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.activeComponent = event.urlAfterRedirects.split(
          '/'
        )[1] as HeaderComponents;
      });
  }
}
