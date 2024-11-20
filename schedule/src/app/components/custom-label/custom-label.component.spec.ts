import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomLabelComponent } from './custom-label.component';

describe('CustomLabelComponent', () => {
  let component: CustomLabelComponent;
  let fixture: ComponentFixture<CustomLabelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
