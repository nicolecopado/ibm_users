import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { 
  UIShellModule,
  ButtonModule,
  InputModule,
  StructuredListModule,
  TabsModule,
  CheckboxModule,
  TagModule,
  RadioModule,
  TableModule,
  GridModule,
  DropdownModule } from 'carbon-components-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TableModule,
        UIShellModule,
        ButtonModule,
        InputModule,
        ReactiveFormsModule,
        StructuredListModule,
        TabsModule,
        CheckboxModule,
        RadioModule,
        GridModule,
        TagModule,
        DropdownModule 
      ],
      declarations: [
        AppComponent,
        LoginComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Front'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Front');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('Front app is running!');
  });
});
