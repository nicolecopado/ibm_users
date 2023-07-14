import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyLoansComponent } from "../my-loans/my-loans.component";
import { ProfileComponent } from "../profile/profile.component";
import axios from 'axios';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})

export class MenuBarComponent implements OnInit {

  numLoan: number = 0;

  Profile = {
    "1": [{
      "name": "Erick Calderon",
      "department" : "Device Loans",
      "role" : "Administrator"
    }],
  };

  @Input() user: any;
  
  constructor(private router: Router, private loansNum: MyLoansComponent, public profileComponent: ProfileComponent) {
    this.numLoan = this.loansNum.getNumLoans();
  }
  
  logout() {
    var api = environment.ibm_users+"/logout";
    var rout = this.router;
    axios.get(api, { withCredentials: true }).then(function (response) {
      console.error(response);
      if (response.status == 200) {
        rout.navigate(['./']);
      }
    }).catch((error) => {
      console.error("Not able to Log Out")
    });
  }

  ngOnInit(): void {
  }

}
