import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { UIShellModule } from 'carbon-components-angular/ui-shell/ui-shell.module';
import { ButtonModule, InputModule, IconModule } from "carbon-components-angular";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [UIShellModule,
        ButtonModule,
        IconModule,
        InputModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
