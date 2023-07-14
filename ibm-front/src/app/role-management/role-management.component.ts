import { Component, OnInit } from '@angular/core';
import { ButtonModule, CheckboxModule } from 'carbon-components-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface Emp {
  ID: number,
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  DEPARTMENT_NAME: string;
  ROLE_NAME: string;
};

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})

export class RoleManagementComponent implements OnInit {
  searchText = "";
  filter = "";
  user: any;

  columns = ["Emploee ID",
    "First Name",
    "Last Name",
    "Email",
    "Department",
    "Role"
  ];

  roles = [{
    content: "Administrator",
    selected: false
  }, {
    content: "Focal",
    selected: false
  }, {
    content: "Security",
    selected: false
  }, {
    content: "Employee",
    selected: false
  }];

  employees: Emp[] = [];

  constructor(private router: Router, private formBuilder: FormBuilder,) { }

  deviceTypeFilters = [];

  deviceType = [
    { value: "Administrator", checked: false },
    { value: "Focal", checked: false },
    { value: "Security", checked: false },
    { value: "Employee", checked: false }
  ];

  updateRole(changes: Object, index: number) {
    // @ts-ignore
    var newRole = changes.item.content;
    this.employees[index].ROLE_NAME = newRole;
    var empID = this.employees[index].ID;

    var api = environment.ibm_users + "/Admin/updateRole/?";
    var querry = `role=${newRole}&id=${empID}`;
    api += querry;
    // TODO: Actualizar con la API
    axios.get(api, {withCredentials: true}).then(res => {

      console.log(res);
      
    }).catch(err => console.error(err));
  }

  searchNow() {
    var rout = this.router;
    var esto = this;

    var api = environment.ibm_users + "/Admin/searchUsers/";
    var querry = "";

    if (esto.searchText != "") {
      querry = "?user=" + esto.searchText;
      if (esto.filter != "") querry = querry + "&role=" + esto.filter;
    }
    else if (esto.filter != "") querry = "?role=" + esto.filter;
    api += querry;

    axios.get(api, { withCredentials: true }).then(res => {

      esto.employees = res.data;

    }).catch(err => console.error(err));

    //*/
  }

  checkPin($event: KeyboardEvent) {
    var rout = this.router;
    var esto = this;
    if (event) {
      esto.searchText = (<HTMLInputElement>event.target).value.trim();
      // @ts-ignore
      if (event.keyCode == 13) {
        esto.searchNow();
      }
    }
  }

  onRoleFilter(i: number) {
    var rout = this.router;
    var esto = this;
    esto.filter = "";
    esto.deviceType[i].checked = !esto.deviceType[i].checked;
    esto.deviceType.forEach(field => {
      if (field.checked) {
        if (esto.filter != "") esto.filter = esto.filter + "," + field.value;
        else esto.filter = field.value;
      }
    });
    esto.searchNow();
  }

  resetFilters() {
    this.resetRoleList();
    this.searchText = "";
    this.searchNow();
  }

  resetRoleList() {
    this.deviceTypeFilters = [];
    this.deviceType = this.deviceType.map(obj => ({ value: obj.value, checked: false }));
    this.applyFilters();
  }

  applyFilters() {
  }

  ngOnInit() {
    var api = environment.ibm_users + "/isLogged";
    var rout = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then((response) => {
      esto.user = response.data;
      if (response.data.ROLE_NAME != "Administrator") rout.navigate(['./']);
      api = environment.ibm_users + "/Admin/getAllUsers";
      axios.get(api, { withCredentials: true }).then(function (response) {

        esto.employees = response.data;

      });
    }).catch(err => {
      console.error(err);
      rout.navigate(['./']);
    });
  }
  ngOnDestroy() {
  }

}

