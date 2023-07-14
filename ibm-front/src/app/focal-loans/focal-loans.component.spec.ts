import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocalLoansComponent } from './focal-loans.component';
import { StructuredListModule, ButtonModule, CheckboxModule, RadioModule, GridModule, TagModule  } from 'carbon-components-angular';

describe('FocalLoansComponent', () => {
  let component: FocalLoansComponent;
  let fixture: ComponentFixture<FocalLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocalLoansComponent ],
      imports: [StructuredListModule,
        ButtonModule,
        CheckboxModule 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FocalLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
