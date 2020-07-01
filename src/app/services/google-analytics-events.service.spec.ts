import { TestBed } from '@angular/core/testing';

import { GoogleAnalyticsEventsService } from './google-analytics-events.service';

describe('GoogleAnalyticsEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoogleAnalyticsEventsService = TestBed.get(GoogleAnalyticsEventsService);
    expect(service).toBeTruthy();
  });
});
