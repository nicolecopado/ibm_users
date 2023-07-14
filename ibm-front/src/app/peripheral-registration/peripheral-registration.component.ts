import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-peripheral-registration',
  templateUrl: './peripheral-registration.component.html',
  styleUrls: ['./peripheral-registration.component.scss']
})
export class PeripheralRegistrationComponent implements OnInit {

  openConfirmation: boolean = false;
  confModal = {
    title: "",
    body: ""
  }

  diviceTypes: any[] = [];
  diviceBrands: any[] = [];
  me: any = {};
  user: string = "";

  deviceForm = this.formBuilder.group({
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    deviceDesc: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  updateType(changes: Object) {
  }
  updateBrand(changes: Object) {
  }

  CloseAll() {
    this.openConfirmation = false;
  }
  sendForm() {
    var api = environment.ibm_peripherals+"/AdminFocal/createPeripheral";
    var rout = this.router;
    var esto = this;
    var form = esto.deviceForm.value;

    var body = {
      ptype: form.deviceType.content,
      description: form.deviceDesc,
      brand: form.deviceBrand.content,
      model: form.deviceModel
    };
    axios.post(api, body, { withCredentials: true }).then(response => {

      esto.confModal.title = "Success";
      esto.confModal.body = "The device was successfully processed.";
      esto.openConfirmation = true;

    }).catch(err => {
      esto.confModal.title = "Failed";
    esto.confModal.body = "The device was not able to process correctly, please check that the information is correct or try again later.";
    esto.openConfirmation = true;
    });
  }

  ngOnInit(): void {
    var api = environment.ibm_users+"/isLogged";
    var rout = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then(function (response) {
      esto.user = response.data;
      esto.me = response.data;
      var api3 = environment.ibm_peripherals+"/AdminFocal/getPeripheralFields";
      axios.get(api3, { withCredentials: true }).then(res => {

        esto.diviceTypes = res.data.ptype.map((element: any) => Object({content: element.NAME, selected: false}));
        esto.diviceBrands = res.data.brand.map((element: any) => Object({content: element.NAME, selected: false}));

      }).catch(err => console.error(err));

    }).catch(err => {
      console.error(err);
      rout.navigate(['./']);
    });
  }

}
