import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsAggregateTableComponent } from './stats-aggregate-table.component';

describe('StatsAggregateTableComponent', () => {
  let component: StatsAggregateTableComponent;
  let fixture: ComponentFixture<StatsAggregateTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsAggregateTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsAggregateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
