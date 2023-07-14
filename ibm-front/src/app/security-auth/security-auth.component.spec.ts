import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAuthComponent } from './security-auth.component';

describe('SecurityAuthComponent', () => {
  let component: SecurityAuthComponent;
  let fixture: ComponentFixture<SecurityAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
