import { Component, OnInit } from '@angular/core';
import {JobService} from './JobService.service';
import {Job} from './jobs.model';
import { splitAtColon } from '@angular/compiler/src/util';
import { SortEvent } from './jobs.sortevent';
import { SelectItem } from '../selectitem';
import { LazyLoadEvent } from '../../../node_modules/primeng/components/common/lazyloadevent.d';
import { range } from 'rxjs';
import { and } from '@angular/router/src/utils/collection';
import { DataScrollerModule } from 'primeng/primeng';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  // styles: [`
  //       .in-progress {
  //           background-color: #1CA979 !important;
  //           color: #ffffff !important;
  //       }

  //       .completed {
  //           background-color: #2CA8B1 !important;
  //           color: #ffffff !important;
  //       }
  //   `
  //   ]
})
export class JobsComponent implements OnInit {

 jobs: Job[];
 cols: any[];
 status: any[];
 jobnames: SelectItem[];
 totalRecords: number;
 loading: boolean;
 pageSize: number = 5;
 page: number = 0;
 prDate: Date = new Date("2019-2-1");
 tDate: Date = new Date(""+this.prDate.getFullYear()+"-"+this.prDate.getMonth()+"-"+this.prDate.getDay());
 rangeDates: Date[] = [new Date(), new Date()];
 startDate: Date;
 endDate: Date;
 display: Boolean = true;

  constructor(private jobService: JobService) {

  }

  ngOnInit() {

    // this.rangeDates[] = [new Date(), new Date()];
    // this.rangeDates.push(new Date());
    this.startDate =  new Date(this.rangeDates[0]);
    this.endDate = new Date(this.rangeDates[1]);

    if( (this.endDate.getMonth()-1) == 0){
      this.rangeDates[0].setMonth(12);
      this.rangeDates[0].setFullYear(this.endDate.getFullYear()-1);
      this.rangeDates[0].setDate(this.rangeDates[1].getDate());
    }
    else{
      this.rangeDates[0].setMonth(this.endDate.getMonth()-1);
      this.rangeDates[0].setDate(this.rangeDates[1].getDate());
    }
    // console.log(this.rangeDates);
    // console.log(this.rangeDates[0].getMonth());
    // console.log(this.rangeDates[1].getMonth());

    this.jobService.getJobs(this.rangeDates[0].getFullYear(),
                            this.rangeDates[0].getMonth()+1,
                            this.rangeDates[0].getDate(),
                            this.rangeDates[1].getFullYear(),
                            this.rangeDates[1].getMonth()+1,
                            this.rangeDates[1].getDate()).then(jobs => {this.jobs = jobs;
                            this.display = false;});
    this.cols = [
      // { field: '_id', header: 'Job Id' },
      { field: 'jobTicket', header: 'Job Ticket'},
      { field: 'name', header: 'Job Name' },
      { field: 'description', header: 'Description of Job' },
      // { field: 'startTime', header: 'Start Time' },
      // { field: 'endTime', header: 'End Time' },
      // { field: 'executionTime', header: 'Execution Time (minutes)' },
      { field: 'jobType', header: 'Type of Job' },
      { field: 'datasetSize', header: 'Dataset Size'},
      // { field: 'objProcessed', header: 'Objects Processed per minute'},
      // { field: 'complexity', header: 'Complexity'},
      // { field: 'status', header: 'Status'},
      { field: 'hostname', header: 'Host'},
      { field: 'environment', header: 'Environment'}
      // { field: '__v', header: 'Version'}
    ];

    this.status = [
      { label: 'All Status', value: null },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Completed', value: 'Completed' },
      { label: 'Abandoned', value: 'Abandoned' },
  ];

    // this.loading = true;

    this.jobnames = [
      { label: 'All Jobs', value: null },
      { label: 'Creating Part', value: 'Creating Part' },
      { label: 'Updating Part', value: 'Updating Part' },
      { label: 'Deleting Part', value: 'Deleting Part' }
    ];

  }


  customSort(event: SortEvent) {
    // console.log('SortEvent=', event);
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;
        if (value1 == null && value2 != null) {
                result = -1;
        } else if (value1 != null && value2 == null) {
                    result = 1;
                } else if (value1 == null && value2 == null) {
                            result = 0;
                        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                                if ((event.field === 'startTime') || (event.field === 'endTime') ) {
                                  var val1 = value1.split(' ');
                                  var val2 = value2.split(' ');
                                  const x = val1[0].split('/');
                                  const y = val2[0].split('/');
                                    // const x = value1.split('/');
                                    // const y = value2.split('/');
                                    value1 = x[2] + x[0] + x[1];
                                    value2 = y[2] + y[0] + y[1];
                                    // console.log('x=', value1, x);
                                    // console.log('y=', value2, y);
                                }
                                result = value1.localeCompare(value2);
                                // console.log(result);
                        }  else { result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0; }
        return (event.order * result);
    });
  }

  onClick(){
    this.jobService.getJobs(this.rangeDates[0].getFullYear(),
                            this.rangeDates[0].getMonth()+1,
                            this.rangeDates[0].getDate(),
                            this.rangeDates[1].getFullYear(),
                            this.rangeDates[1].getMonth()+1,
                            this.rangeDates[1].getDate()).then(jobs => {this.jobs = jobs;
                            this.display = false;});
    this.display = true;
  }

  // loadJobLazy(event: LazyLoadEvent) { 
  //   console.log('========logJobLazy======');
  //   console.log(event);
  //   this.loading = true;
  //   this.page += 1;
  //   //event.first = this.page;
  //   event.sortOrder = 1;
    
  //   this.jobService.getJobs(event.rows,(event.first/event.rows)+1).then(jobs => {
  //     this.jobs = jobs.data;
  //     console.log(jobs);
  //     this.totalRecords = jobs.maxRecords;
  //     this.loading = false;
  //   });
    
  // }

}
