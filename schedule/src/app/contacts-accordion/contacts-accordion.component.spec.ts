import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactsAccordionComponent } from './contacts-accordion.component';

describe('ContactsAccordionComponent', () => {
  let component: ContactsAccordionComponent;
  let fixture: ComponentFixture<ContactsAccordionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ContactsAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
