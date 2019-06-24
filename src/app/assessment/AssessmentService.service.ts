import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assessment } from './assessments.model';

@Injectable()
export class AssessmentService {

  constructor(private http: HttpClient) {}

  getAssessments() {
    console.log('Getting assessments');
    return this.http.get<any>('/cockpit/services/assessment/fetchAssessments')
    .toPromise()
    .then(res => <Assessment[]> res.data)
    .then(data => data); 
    
  }
  setAssessments(type_count_value: String){
    console.log('Setting assessment');
    return this.http.post('/cockpit/services/assessment/addAssessment', {
      type_count: type_count_value
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

  updateAssessment(type: String, count: Number){
    console.log('Updating assessment');
    return this.http.put('/cockpit/services/assessment/updateAssessment', {
      legacyType: type,
      legacyCount: count
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

}
