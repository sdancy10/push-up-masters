import {Component, HostBinding} from '@angular/core';
declare let ga: Function;
import { Router, NavigationEnd } from "@angular/router";

import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import {OverlayContainer} from "@angular/cdk/overlay";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'push-up-masters';
  themeList: {id: string, name: string}[];
  public fullImagePath: string;

  constructor(public router: Router,
              public overlayContainer: OverlayContainer,
              public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
    this.fullImagePath = 'assets/images/push-up-master-logo.png';
    this.themeList = [
      {id: 'app-theme', name: 'Light'},
      {id: 'dark-theme', name: 'Dark'},
      //{id: 'dark-mint-theme', name: 'Dark Mint'},
      //{id: 'light-mint-theme', name: 'Light Mint'},
      //{id: 'dark-grey-blue-theme', name: 'Dark Blue'},
      //{id: 'light-dark-grey-blue', name: 'Light Blue'},
    ]
  }
  @HostBinding('class') componentCssClass;

  ngOnInit(): void {
  }

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  submitGoogleAnalyticsEvent(category: string, action: string, label: string, value: number) {
    this.googleAnalyticsEventsService.emitEvent(category, action, label, value);
  }
}
