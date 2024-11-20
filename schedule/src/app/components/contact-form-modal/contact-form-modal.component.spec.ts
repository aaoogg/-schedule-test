import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactFormModalComponent } from './contact-form-modal.component';

describe('ContactFormModalComponent', () => {
  let component: ContactFormModalComponent;
  let fixture: ComponentFixture<ContactFormModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ContactFormModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
