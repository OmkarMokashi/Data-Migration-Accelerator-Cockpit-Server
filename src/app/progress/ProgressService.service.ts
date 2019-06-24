import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Progress} from './progress.model';

@Injectable()
export class ProgressService {

  constructor(private http: HttpClient) {}

  getProgress(fromYear: number, fromMonth: number, fromDay: number, toYear: number, toMonth: number, toDay: number) {
    // console.log('Getting progress');
    return this.http.get<any>('/cockpit/services/progress/fetchProgress?fromYear='+fromYear+'&fromMonth='+fromMonth+'&fromDay='+fromDay+'&toYear='+toYear+'&toMonth='+toMonth+'&toDay='+toDay)
    .toPromise()
    .then(res => res)
    .then(data => data); 
      
  }

  getJobs(fromYear: number, fromMonth: number, fromDay: number, toYear: number, toMonth: number, toDay: number) {
    // console.log('Getting jobs');
    // console.log(""+fromMonth+"/"+fromDay+"/"+fromYear);
    // console.log(""+toMonth+"/"+toDay+"/"+toYear);
    return this.http.get<any>('/cockpit/services/jobs/fetchJobs?fromYear='+fromYear+'&fromMonth='+fromMonth+'&fromDay='+fromDay+'&toYear='+toYear+'&toMonth='+toMonth+'&toDay='+toDay)
    .toPromise()
    .then(res => res)
    .then(data => data);
    
  }

  getAssessments() {
    // console.log('Getting assessments');
    return this.http.get<any>('/cockpit/services/assessment/fetchAssessments')
    .toPromise()
    .then(res => res.data)
    .then(data => data); 
    
  }

}
