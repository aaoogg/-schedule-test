import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersAccordionComponent } from './users-accordion.component';

describe('UsersAccordionComponent', () => {
  let component: UsersAccordionComponent;
  let fixture: ComponentFixture<UsersAccordionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UsersAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
