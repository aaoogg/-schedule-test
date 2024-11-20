import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomButtonIconComponent } from './custom-button-icon.component';

describe('CustomButtonIconComponent', () => {
  let component: CustomButtonIconComponent;
  let fixture: ComponentFixture<CustomButtonIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomButtonIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomButtonIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
