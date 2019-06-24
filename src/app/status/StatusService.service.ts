import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Status} from './status.model';

@Injectable()
export class StatusService {

  constructor(private http: HttpClient) {}

  getStatus(pageSize: Number, page: Number, name: String) {
    // console.log('Getting status');
    // console.log("Page Size :: "+ pageSize);
    // console.log("Page :: " + page);
    return this.http.get<any>('/cockpit/services/filestatus/fetchFileStatus?pageSize='+pageSize+'&page='+page+'&name='+name)
    .toPromise()
    .then(res => res)
    .then(data => data); 
      
  }

}