import { Component } from '@angular/core';
declare let ga: Function;
import { Router, NavigationEnd } from "@angular/router";
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'push-up-masters';
  constructor(public router: Router, public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
  ngOnInit(): void {
  }
  submitGoogleAnalyticsEvent(category: string, action: string, label: string, value: number) {
    this.googleAnalyticsEventsService.emitEvent(category, action, label, value);
  }
}
