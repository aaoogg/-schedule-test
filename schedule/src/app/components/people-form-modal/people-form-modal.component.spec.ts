import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeopleFormModalComponent } from './people-form-modal.component';

describe('PeopleFormModalComponent', () => {
  let component: PeopleFormModalComponent;
  let fixture: ComponentFixture<PeopleFormModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PeopleFormModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
