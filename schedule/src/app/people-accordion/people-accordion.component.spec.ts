import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeopleAccordionComponent } from './people-accordion.component';

describe('PeopleAccordionComponent', () => {
  let component: PeopleAccordionComponent;
  let fixture: ComponentFixture<PeopleAccordionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PeopleAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
