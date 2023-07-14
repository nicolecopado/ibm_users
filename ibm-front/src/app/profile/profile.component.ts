import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

@Injectable()
export class ProfileComponent implements OnInit {

  user: any;
  open = false;
  profile = {
    ID: 1,
    FIRST_NAME: "FirstName",
    LAST_NAME: "LastName",
    EMAIL: "example@ibm.com",
    DEPARTMENT_NAME: "IBM",
    ROLE_NAME: "ROLE"
  }

  title = 'My Loans'
  showLoans = false;

  myLoans: MyDevices = {
    borrowed: [],
    in_process: [],
    concluded: []
  };

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    var api = environment.ibm_users+"/isLogged";
    var rout = this.route;
    var router = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then((response) => {
      if (response.status == 200) {
        esto.user = response.data;
        var me = response.data;
        var myParam = rout.snapshot.paramMap.get('id');
        if (myParam != me.ID && (me.ROLE_NAME == "Administrator" || me.ROLE_NAME == "Focal")) {

          var api = environment.ibm_users+"/AdminFocal/getUser/id=" + myParam;
          axios.get(api, { withCredentials: true }).then(res => {
            
            esto.profile = res.data;
            esto.showLoans = true;

          }).catch(e=>console.error(e));

          api = environment.ibm_peripherals+"/AdminFocal/getPeripheralsById";
          var body={
            employee_id: myParam
          };
          axios.post(api,body, { withCredentials: true }).then(res => {
            
            esto.myLoans = res.data

          }).catch(e=>console.error(e));

        }
        else {
          esto.profile = me;
          esto.showLoans = false;
        }
      }
    }).catch(err => {
      console.error(err);
      router.navigate(['./']);
    });
  }

}
