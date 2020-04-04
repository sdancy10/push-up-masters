import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsDetailTableComponent } from './stats-detail-table.component';

describe('StatsTableComponent', () => {
  let component: StatsDetailTableComponent;
  let fixture: ComponentFixture<StatsDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsDetailTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
