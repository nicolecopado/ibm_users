import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface Device {
  PERIOHERAL_SERIAL: number,
  TYPE: string,
  BRAND: string,
  MODEL: string,
  DESCRIPTION: string,

  CREATION: string;
  CONCLUDED: string;
  CONDITION_ACCEPTED: boolean;
  SECURITY_AUTH: boolean;
};

interface MyDevices {
  "borrowed": Device[];
  "in_process": Device[];
  "concluded": Device[];
}
type OnlyKeys = keyof MyDevices;

@Component({
  selector: 'app-my-loans',
  templateUrl: './my-loans.component.html',
  styleUrls: ['./my-loans.component.scss']
})

@Injectable()
export class MyLoansComponent implements OnInit {
  open: boolean = false
  showCloseButton: boolean = true;
  title = 'My Loans'
  user: string = "";

  numLoans: number = 0;

  notificationMesage = {
    type: 'info',
    title: 'You have no devices here',
    subtitle: '',
    caption: 'Try contacting a focal point to request a device which can then be displayed here',
    lowContrast: false,
    showClose: false
  };

  headers: { title: string; val: string }[] = [
    { title: "Borrowed", val: "borrowed" },
    { title: "In Process", val: "in_process" },
    { title: "Concluded", val: "concluded" }];
  myLoans: MyDevices = {
    borrowed: [],
    in_process: [],
    concluded: []
  };

  getNumLoans() {
    return Object.keys(this.myLoans.borrowed).length;
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    var api = environment.ibm_users+"/isLogged";
    var rout = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then(response => {
      esto.user = response.data;
      api = environment.ibm_peripherals+"/getOwnLoans";
      axios.get(api, { withCredentials: true }).then(res => {
        
        esto.myLoans = res.data;

      }).catch(err => console.error(err));

    }).catch(err => {
      console.error(err);
      rout.navigate(['./']);
    });
  }

}

/*
//Para getOwnLoans y getLoans/id:=
    var DEVICE = {
      PERIPHERAL_SERIAL: "",
      TYPE: "",
      BRAND: "",
      MODEL: "",
      DESCRIPTION: "",

      CREATION: "",
      CONCLUDED: "",
      CONDITION_ACCEPTED: "",
      SECURITY_AUTH: "",
    };
*/