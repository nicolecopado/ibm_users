import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeripheralRegistrationComponent } from './peripheral-registration.component';

describe('PeripheralRegistrationComponent', () => {
  let component: PeripheralRegistrationComponent;
  let fixture: ComponentFixture<PeripheralRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeripheralRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeripheralRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
