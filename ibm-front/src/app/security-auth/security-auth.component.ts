import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface DEVICES {
  PERIPHERAL_SERIAL: string,
  TYPE: string,
  BRAND: string,
  MODEL: string,
  DESCRIPTION: string,

  CREATION: string,
  CONCLUDED: string,
  CONDITION_ACCEPTED: string,
  SECURITY_AUTH: string,
};

@Component({
  selector: 'app-security-auth',
  templateUrl: './security-auth.component.html',
  styleUrls: ['./security-auth.component.scss']
})
export class SecurityAuthComponent implements OnInit {

  isOpen: boolean = false;
  charged: boolean = false;
  user: any;

  notificationConfig = {
    type: 'info',
    title: 'Please Wait',
    subtitle: '',
    caption: 'Updating loan status',
    lowContrast: false,
    showClose: false
  };

  Device: DEVICES =
    {
      PERIPHERAL_SERIAL: "",
      TYPE: "Keyboard",
      BRAND: "",
      MODEL: "",
      DESCRIPTION: "",

      CREATION: "",
      CONCLUDED: "",
      CONDITION_ACCEPTED: "",
      SECURITY_AUTH: "",
    };


  constructor(private router: Router, private paramGetter: ActivatedRoute) { }

  cancel() {
    this.charged = true;
    var api = environment.ibm_peripherals + "/AdminFocal/cancelLoan"
    var esto = this;
    var loanID = this.paramGetter.snapshot.paramMap.get('id');
    var body = { loan_id: loanID };
    axios.post(api, body, { withCredentials: true }).then(res => {
      
      esto.notificationConfig = {
        type: 'success',
        title: 'Loan was canceld',
        subtitle: '',
        caption: 'To withdraw the device please restart the process again',
        lowContrast: false,
        showClose: false
      };

    }).catch(err => console.error(err));
  }

  authDevice() {
    this.charged = true;
    var esto = this;
    var loanID = this.paramGetter.snapshot.paramMap.get('id');
    var api = environment.ibm_peripherals + "/Security/confirmSecurityAuth";
    var body = { loan_id: loanID };
    axios.post(api, body, { withCredentials: true }).then(res => {
      esto.notificationConfig = {
        type: 'success',
        title: 'Update was succsesfull',
        subtitle: '',
        caption: 'The employee can now withdraw the device from campus installations',
        lowContrast: false,
        showClose: false
      };
    }).catch(e => {
      esto.notificationConfig = {
        type: 'error',
        title: 'Error while updating',
        subtitle: '',
        caption: 'Something went wrong, please try agian later',
        lowContrast: false,
        showClose: false
      };
    });
  }

  ngOnInit(): void {
    var api = environment.ibm_users + "/isLogged";
    var rout = this.router;
    var esto = this;
    var loanID = this.paramGetter.snapshot.paramMap.get('id');
    axios.get(api, { withCredentials: true }).then(response => {

      esto.user = response.data;
      if (response.data.ROLE_NAME == "Security") {
        var api = environment.ibm_peripherals + "/getPeripheralByLoanId/";
        var body = { loan_id: loanID };
        axios.post(api, body, { withCredentials: true }).then(res => {
          esto.Device = res.data[0];
        }).catch(e => console.error(e));
      }
      else {
        rout.navigate(['./']);
      }

    }).catch(err => {
      console.error(err);
      rout.navigate(['./']);
    });
  }
}
