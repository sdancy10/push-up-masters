import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSignInComponent } from './dialog-sign-in.component';

describe('DialogSignInComponent', () => {
  let component: DialogSignInComponent;
  let fixture: ComponentFixture<DialogSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
