import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';

interface StatusInfo {
  LOAN_STATUS: string,
  NUM_LOANS: number,
}
interface DeviceInfo {
  group: string,
  value: number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard'
  user: any = undefined;

  StatusInfoList: StatusInfo[] = [];

  deviceData: DeviceInfo[] = [];

  deviceDataOptions = {
    title: "Total Device Loan",
    axes: {
      left: {
        mapsTo: "group",
        scaleType: "labels"
      },
      bottom: {
        mapsTo: "value"
      }
    },
    legend: {
      alignment: "center"
    },
    height: "400px"
  };

  deviceAvailability: DeviceInfo[] = [];

  deviceAvailabilityOptions = {
    title: "Device Availability",
    resizable: true,
    legen: {
      alignment: "center"
    },
    donut: {
      center: {
        label: "Devices"
      },
      alignment: "center"
    },
    height: "400px"
  };

  loansByArea: DeviceInfo[] = [];

  loansByAreaOptions = {
    title: "Loans Per Area",
    resizable: true,
    legend: {
      alignment: "center"
    },
    pie: {
      alignment: "center"
    },
    height: "400px"
  };

  async downloadCSV() {
    var api = environment.ibm_peripherals + "/AdminFocal/downloadReport";
    var esto = this;
    var csv = axios.get(api, { responseType: 'blob', withCredentials: true }).then(res => {
      console.log(res);
      const blob = new Blob(
        [res.data],
        { type: 'application/xls' }
      );
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = "report.xls";
      link.click();

    }).catch(e => console.log(e));
    console.log(csv);
    return csv;
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    var api = environment.ibm_users + "/isLogged";
    var rout = this.router;
    var esto = this;
    axios.get(api, { withCredentials: true }).then(response => {

      esto.user = response.data;
      api = environment.ibm_peripherals + "/AdminFocal/getLoansInfo";
      axios.get(api, { withCredentials: true }).then(res => {
        esto.StatusInfoList = res.data;
      }).catch(e => console.log(e));
      
      api = environment.ibm_peripherals + "/AdminFocal/getTotalPeripherals";
      axios.get(api, { withCredentials: true }).then(res => {
        esto.StatusInfoList.push({LOAN_STATUS: "Total Device", NUM_LOANS:res.data[0].TOTAL});
      }).catch(e => console.log(e));

      api = environment.ibm_peripherals + "/AdminFocal/getPeripheralsByType";
      axios.get(api, { withCredentials: true }).then(res => {
        esto.deviceData = res.data.map((obj: { PERIPHERAL_TYPE: any; NUM_PERIPHERALS: any; }) => ({ group: obj.PERIPHERAL_TYPE, value: obj.NUM_PERIPHERALS }));
      }).catch(e => console.log(e));

      api = environment.ibm_peripherals + "/AdminFocal/getPeripheralAvailability";
      axios.get(api, { withCredentials: true }).then(res => {
        esto.deviceAvailability = res.data.map((obj: { PERIPHERAL_STATUS: any; NUM_PERIPHERALS: any; }) => ({ group: obj.PERIPHERAL_STATUS, value: obj.NUM_PERIPHERALS }));
      }).catch(e => console.log(e));

      api = environment.ibm_peripherals + "/AdminFocal/getLoansByDepartment";
      axios.get(api, { withCredentials: true }).then(res => {
        esto.loansByArea = res.data.map((obj: { DEPARTMENT_NAME: any; NUM_LOANS: any; }) => ({ group: obj.DEPARTMENT_NAME, value: obj.NUM_LOANS }));
      }).catch(e => console.log(e));

    }).catch(err => {
      console.error(err);
      rout.navigate(['./']);
    });
  }

}
