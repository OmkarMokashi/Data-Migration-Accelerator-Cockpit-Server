import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectstatusComponent } from './objectstatus.component';

describe('ObjectstatusComponent', () => {
  let component: ObjectstatusComponent;
  let fixture: ComponentFixture<ObjectstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
