import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsAggregateLinechartComponent } from './stats-aggregate-linechart.component';

describe('StatsAggregateLinechartComponent', () => {
  let component: StatsAggregateLinechartComponent;
  let fixture: ComponentFixture<StatsAggregateLinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsAggregateLinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsAggregateLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
