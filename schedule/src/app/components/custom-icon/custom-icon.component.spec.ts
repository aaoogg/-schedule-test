import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomIconComponent } from './custom-icon.component';

describe('IconComponent', () => {
  let component: CustomIconComponent;
  let fixture: ComponentFixture<CustomIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CustomIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
