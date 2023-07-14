import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RecoverComponent implements OnInit {

  emailForm = this.formBuilder.group({
    email: '',
  });

  constructor(
    private formBuilder: FormBuilder
  ) {}

  sendMail(){
    console.log(this.emailForm.value);
  }

  ngOnInit(): void {
  }

}
