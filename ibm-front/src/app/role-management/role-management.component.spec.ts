import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementComponent } from './role-management.component';
import { StructuredListModule, ButtonModule, CheckboxModule, RadioModule, GridModule, TagModule, DropdownModule   } from 'carbon-components-angular';

describe('RoleManagementComponent', () => {
  let component: RoleManagementComponent;
  let fixture: ComponentFixture<RoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
