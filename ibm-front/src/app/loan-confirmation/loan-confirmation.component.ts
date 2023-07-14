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
  selector: 'app-loan-confirmation',
  templateUrl: './loan-confirmation.component.html',
  styleUrls: ['./loan-confirmation.component.scss']
})
export class LoanConfirmationComponent implements OnInit {
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

  ngOnInit(): void {
    var api = environment.ibm_users + "/isLogged";
    var rout = this.router;
    var esto = this;
    var loanID = this.paramGetter.snapshot.paramMap.get('id');
    axios.get(api, { withCredentials: true }).then(response => {

      esto.user = response.data;
      var api = environment.ibm_peripherals + "/acceptTermsConditions";
      var body = {
        loan_id: loanID
      }
      axios.post(api, body, { withCredentials: true }).then(res => {

        //esto.Device = res.data;
        console.log("pito -> ", res);
        esto.notificationConfig = {
          type: 'success',
          title: 'Update was succsesfull',
          subtitle: '',
          caption: 'An e-mail was sent with instructions on how to withdrae the device',
          lowContrast: false,
          showClose: false
        };

      }).catch(e => {

        console.error(e);
        esto.notificationConfig = {
          type: 'error',
          title: 'Error while updating',
          subtitle: '',
          caption: 'Something went wrong, please try agian later',
          lowContrast: false,
          showClose: false
        };

      });

      var api = environment.ibm_peripherals + "/getPeripheralByLoanId/";
      var body = { loan_id: loanID };
      axios.post(api, body, { withCredentials: true }).then(res => {
        esto.Device = res.data[0];
      }).catch(e => console.error(e));

    }).catch(err => {
      console.error(err);
      rout.navigate(['./']);
    });
  }

}
