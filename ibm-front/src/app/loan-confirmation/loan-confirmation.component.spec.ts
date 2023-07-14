import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsModule } from "carbon-components-angular";
import { LoanConfirmationComponent } from './loan-confirmation.component';

describe('LoanConfirmationComponent', () => {
  let component: LoanConfirmationComponent;
  let fixture: ComponentFixture<LoanConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanConfirmationComponent ],
      imports: [TabsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
