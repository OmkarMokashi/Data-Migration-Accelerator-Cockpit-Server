import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Objectstatus} from './objectstatus.model';

@Injectable()
export class ObjectstatusService {

  constructor(private http: HttpClient) {}

  getObjectStatus(pageSize: Number, page: Number, name: String) {
    console.log('Getting status');
    console.log("Page Size :: "+ pageSize);
    console.log("Page :: " + page);
    return this.http.get<any>('/cockpit/services/objectstatus/fetchObjectStatus?pageSize='+pageSize+'&page='+page+'&name='+name)
    .toPromise()
    .then(res => res)
    .then(data => data); 
      
  }

}