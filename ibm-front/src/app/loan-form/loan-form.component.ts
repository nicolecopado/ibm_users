import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CheckboxModule, ModalModule } from 'carbon-components-angular';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent implements OnInit {

  isOpen: boolean = false
  openConfirmation: boolean = false;
  showCloseButton: boolean = true;
  user: any;
  confModal = {
    title: "",
    body: ""
  }

  fields = { "name": "employeeEmail", "type": "email" };
  device = {
    SERIAL: 0,
    BRAND: "",
    PTYPE: "",
    MODEL: "",
    DESCRIPTION: "",
    PERIPHERAL_STATUS: "",

    DEPARTMENT_NAME: "",
    FOCAL_NAME: ""
  };
  userMail = "";

  loanForm = this.formBuilder.group({
    employeeMail: ''
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  openModal(index: number) {
    this.isOpen = true;
    this.device = this.peripheralList[index];
  }
  closeModal() {
    this.isOpen = false;
  }
  CloseAll() {
    this.isOpen = false;
    this.openConfirmation = false;
  }
  sendForm() {
    var esto = this;
    var mail = esto.loanForm.value.employeeMail.trim().toLowerCase();
    if (mail == "") mail = esto.userMail;
    var body = {
      employee_email: mail,
      peripheral_serial: esto.device.SERIAL
    };

    var api = environment.ibm_peripherals + "/AdminFocal/createLoan";
    axios.post(api, body, { withCredentials: true }).then(res => {

      esto.confModal.title = "Success";
      esto.confModal.body = "The loan was successfully processed.";
      esto.openConfirmation = true;

    }).catch(err => {
      esto.confModal.title = "Failed";
      esto.confModal.body = "The loan was not able to process correctly, please check that the employee's email is correct or try again later.";
      esto.openConfirmation = true;
    });

  }
  peripheralList = [{
    SERIAL: 0,
    BRAND: "",
    PTYPE: "keyboard",
    MODEL: "",
    DESCRIPTION: "",
    PERIPHERAL_STATUS: "",

    DEPARTMENT_NAME: "",
    FOCAL_NAME: ""
  }];

  typeFilter: string = "";
  brandFilter: string = "";

  deviceTypeFilters: number = 0;
  deviceBrandFilters: number = 0;

  deviceType: { value: any; checked: boolean }[] = [];
  deviceBrands: { value: any; checked: boolean }[] = [];

  onTypeChange(index: number) {

    var rout = this.router;
    this.typeFilter = "";
    this.deviceType[index].checked = !this.deviceType[index].checked;
    if (this.deviceType[index].checked) this.deviceTypeFilters++;
    else this.deviceTypeFilters--;

    var esto = this;
    this.deviceType.forEach(field => {
      if (field.checked) {
        if (esto.typeFilter != "") esto.typeFilter = esto.typeFilter + "," + field.value;
        else esto.typeFilter = field.value;
      }
    });

    this.applyFilters();
  }

  onBrandChange(index: number) {

    var esto = this;
    esto.typeFilter = "";
    esto.deviceBrands[index].checked = !esto.deviceBrands[index].checked;
    if (esto.deviceBrands[index].checked) esto.deviceBrandFilters++;
    else esto.deviceBrandFilters--;
    esto.deviceBrands.forEach(field => {
      if (field.checked) {
        if (esto.brandFilter != "") esto.brandFilter = esto.brandFilter + "," + field.value;
        else esto.brandFilter = field.value;
      }
    });

    this.applyFilters();
  }


  resetFilters() {
    this.resetTypes();
    this.resetBrands();
  }

  resetTypes() {
    this.typeFilter = "";
    this.deviceTypeFilters = 0;
    this.deviceType = this.deviceType.map(obj => ({ value: obj.value, checked: false }));
    this.applyFilters();
  }
  resetBrands() {
    this.brandFilter = "";
    this.deviceBrandFilters = 0;
    this.deviceBrands = this.deviceBrands.map(obj => ({ value: obj.value, checked: false }));
    this.applyFilters();
  }

  applyFilters() {
    var api = environment.ibm_peripherals + "/AdminFocal/searchAvailablePeripheral/";

    var filterNow = [];
    if (this.typeFilter != "")
      filterNow.push("type=" + this.typeFilter);
    if (this.brandFilter != "")
      filterNow.push("brand=" + this.brandFilter);

    var querry = "";
    filterNow.forEach(target => {
      if (querry == "") querry = "?"
      else querry += "&";
      querry += target;
    });

    api += querry;

    console.log(querry);
    console.log(api);

    var esto = this;
    axios.get(api, { withCredentials: true }).then(res => {

      console.log(res.data);
      esto.peripheralList = res.data;

    }).catch(err => console.error(err));
  }

  ngOnInit() {
    var api = environment.ibm_users + "/isLogged";

    var rout = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then(function (response) {
      esto.user = response.data;
      var me = response.data;
      esto.userMail = me.EMAIL;

      var api2 = environment.ibm_peripherals + "/AdminFocal/searchAvailablePeripheral/";
      axios.get(api2, { withCredentials: true }).then(res => {
        esto.peripheralList = res.data;
      }).catch(err => console.error(err));

      var api3 = environment.ibm_peripherals + "/AdminFocal/getPeripheralFields";
      axios.get(api3, { withCredentials: true }).then(res => {

        res.data.ptype.forEach((element: { NAME: any; }) => {
          esto.deviceType.push({
            value: element.NAME,
            checked: false
          });
        });
        res.data.brand.forEach((element: { NAME: any; }) => {
          esto.deviceBrands.push({
            value: element.NAME,
            checked: false
          });
        });

      }).catch(err => console.log(err));

    }).catch(err => {
      console.log(err);
      rout.navigate(['./']);
    });
  }
  ngOnDestroy() {
  }
}
