import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsModule } from "carbon-components-angular";
import { MyLoansComponent } from './my-loans.component';

describe('MyLoansComponent', () => {
  let component: MyLoansComponent;
  let fixture: ComponentFixture<MyLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyLoansComponent ],
      imports: [TabsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
