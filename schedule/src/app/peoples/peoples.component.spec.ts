import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PeoplesComponent } from './peoples.component';

describe('PeoplesComponent', () => {
  let component: PeoplesComponent;
  let fixture: ComponentFixture<PeoplesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PeoplesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeoplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
