import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { ButtonModule, CheckboxModule } from 'carbon-components-angular';
import { environment } from '../../environments/environment';

interface LOAN{
  PERIPHERAL_SERIAL: number;
  BRAND: string;
  TYPE: string;
  MODEL: string;
  DESCRIPTION: string;
  CREATION: string;
  CONCLUDED: string;

  LOAN_ID: number;
  LOAN_STATUS: string;
  EMPLOYEE_NAME: string;
  CONDITION_ACCEPTED: boolean;
  SECURITY_AUTH: boolean;
}

@Component({
  selector: 'app-focal-loans',
  templateUrl: './focal-loans.component.html',
  styleUrls: ['./focal-loans.component.scss']
})
export class FocalLoansComponent implements OnInit {

  isOpen: boolean = false
  showCloseButton: boolean = true;
  user: any;
  specific: LOAN = {
    PERIPHERAL_SERIAL: 0,
    BRAND: '',
    TYPE: '',
    MODEL: '',
    DESCRIPTION: '',
    CREATION: '',
    CONCLUDED: '',
    LOAN_ID: 0,
    LOAN_STATUS: '',
    EMPLOYEE_NAME: '',
    CONDITION_ACCEPTED: false,
    SECURITY_AUTH: false
  };

  columns = [
    "Employee Name",
    "Device Brand",
    "Device Type",
    "Date",
    "Accepted Conditions",
    "Security Authorization",
    "Status",
  ];

  areaLoans: LOAN[] = [ ];

  constructor(private router: Router) { }

  openModal(index: number) {
    this.isOpen = true;
    this.specific = this.areaLoans[index];
  }
  closeModal() {
    this.isOpen = false;
  }
  cancel() {
    this.isOpen = false;
    var api = environment.ibm_peripherals + "/AdminFocal/cancelLoan"
    var esto = this;
    var body = {
      loan_id: esto.specific.LOAN_ID
    }
    axios.post(api, body, {withCredentials: true}).then(res => {

      console.log(res);

    }).catch(err => console.error(err));
  }
  returnDevice() {
    this.isOpen = false;
    var api = environment.ibm_peripherals + "/AdminFocal/setToConcluded"
    var esto = this;
    var body = {
      loan_id: esto.specific.LOAN_ID
    }
    axios.post(api, body, {withCredentials: true}).then(res => {

      console.log(res);
      
    }).catch(err => console.error(err));
  }


  typeFilter: string = "";
  brandFilter: string = "";
  statusFilter: string = "";
  searchFilter: string = "";

  deviceTypeFilters: number = 0;
  deviceBrandFilters: number = 0;

  deviceStatus: { value: any; checked: boolean }[] = [
    { value: "In Process", checked: false },
    { value: "Borrowed", checked: false },
    { value: "Concluded", checked: false }
  ];
  deviceType: { value: any; checked: boolean }[] = [];
  deviceBrands: { value: any; checked: boolean }[] = [];

  checkPin($event: KeyboardEvent) {
    var rout = this.router;
    var esto = this;
    if (event) {
      esto.searchFilter = (<HTMLInputElement>event.target).value.trim();
      // @ts-ignore
      if (event.keyCode == 13) {
        esto.applyFilters();
      }
    }
  }

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

  onStatusChange(index: number) {

    var esto = this;
    this.statusFilter = this.deviceStatus[index].value;
    this.deviceStatus = this.deviceStatus.map(obj => ({ value: obj.value, checked: false }));
    this.deviceStatus[index].checked = true;

    this.applyFilters();
  }

  resetFilters() {
    this.resetType();
    this.resetBrand();
    this.resetStatus();
  }

  resetBrand() {
    this.deviceBrandFilters = 0;
    this.brandFilter = "";
    this.deviceBrands = this.deviceBrands.map(obj => ({ value: obj.value, checked: false }));
    this.applyFilters();
  }

  resetType() {
    this.deviceTypeFilters = 0;
    this.typeFilter = "";
    this.deviceType = this.deviceType.map(obj => ({ value: obj.value, checked: false }));
    this.applyFilters();
  }

  resetStatus() {
    this.statusFilter = "";
    this.deviceStatus = this.deviceStatus.map(obj => ({ value: obj.value, checked: false }));
    this.applyFilters();
  }

  applyFilters() {

    var api = environment.ibm_peripherals + "/AdminFocal/searchLoan/";

    var filterNow = [];
    if (this.searchFilter != "")
      filterNow.push("search=" + this.searchFilter);
    if (this.statusFilter != "")
      filterNow.push("status=" + this.statusFilter);
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
      esto.areaLoans = res.data;

    }).catch(err => console.error(err));

  }

  ngOnInit() {
    var api = environment.ibm_users + "/isLogged";
    var rout = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then(function (response) {
      esto.user = response.data;

      api = environment.ibm_peripherals + "/AdminFocal/getLoans";
      axios.get(api, { withCredentials: true }).then(res => {
        esto.areaLoans = res.data;
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
      console.error(err);
      rout.navigate(['./']);
    });
  }
  ngOnDestroy() {
  }

}