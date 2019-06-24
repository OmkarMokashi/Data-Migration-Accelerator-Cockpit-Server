import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Job} from './jobs.model';

@Injectable()
export class JobService {
display: Boolean = false;
  constructor(private http: HttpClient) {}

  // getJobs(pageSize: number, page: number) {
  //   console.log('Getting jobs');
  //   return this.http.get<any>('/fetchJobs?pagesize='+pageSize+'&page='+page)
  //   .toPromise()
  //   .then(res => res)
  //   .then(data => data); 
    
  // }

  getJobs(fromYear: number, fromMonth: number, fromDay: number, toYear: number, toMonth: number, toDay: number) {
    console.log('Getting jobs');
    console.log(""+fromMonth+"/"+fromDay+"/"+fromYear);
      console.log(""+toMonth+"/"+toDay+"/"+toYear);
    return this.http.get<any>('/cockpit/services/jobs/fetchJobs?fromYear='+fromYear+'&fromMonth='+fromMonth+'&fromDay='+fromDay+'&toYear='+toYear+'&toMonth='+toMonth+'&toDay='+toDay)
    .toPromise()
    .then(res => <Job[]> res.data)
    .then(data => data);
    
  }

}
