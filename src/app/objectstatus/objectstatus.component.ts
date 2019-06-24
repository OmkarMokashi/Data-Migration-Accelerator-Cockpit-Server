import { Component, OnInit } from '@angular/core';
import { Objectstatus } from './objectstatus.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { ObjectstatusService } from './ObjectstatusService.service';

@Component({
  selector: 'app-objectstatus',
  templateUrl: './objectstatus.component.html',
  styleUrls: ['./objectstatus.component.css']
})
export class ObjectstatusComponent implements OnInit {

  cols: any;
  status: Objectstatus[];
  totalRecords: number;
  loading: boolean;
  pageSize: number = 5;
  page: number = 0;
  tableEvent: LazyLoadEvent;
  searchName: String = "";
  display: Boolean = true;

  constructor(private objectstatusService: ObjectstatusService) { }

  ngOnInit() {

    this.objectstatusService.getObjectStatus(this.pageSize, this.page+1, this.searchName).then(status => {
      this.status = <Objectstatus[]> status.data;
      this.totalRecords = status.totalRecords;
      this.loading = false;
      this.display = false;
    });

    this.cols = [
      { field: 'name', header: 'File/Object Name' },
      { field: 'enlisted', header: 'Enlisted' },
      { field: 'extracted', header: 'Exctracted' },
      { field: 'inCleaning', header: 'In Cleaning' },
      { field: 'cleaned', header: 'Cleaned' },
      { field: 'verified', header: 'Verified' },
      { field: 'mapped', header: 'Mapped' },
      { field: 'inLoadtest', header: 'In Loadtest' },
      { field: 'transferred', header: 'Transferred' },
      { field: 'validated', header: 'Validated' },
      { field: 'inProd', header: 'In Prod' }
    ]

    this.loading = true;

  }

  loadStatusLazy(event: LazyLoadEvent){
    this.tableEvent = event;
    // console.log("Lazy Load Object Status Event");
    this.loading = true;
    this.page += 1;
    // console.log("event.rows : "+event.rows);
    // console.log("first : "+event.first);
    // console.log("first/rows + 1 : "+(event.first/event.rows)+1);
    this.objectstatusService.getObjectStatus(event.rows,(event.first/event.rows)+1,this.searchName).then(status =>{
      this.status = status.data;
      this.totalRecords = status.totalRecords;
      this.loading = false;
      // console.log(status);
      // console.log("Name in lazy : "+this.searchName);
      // console.log("this.status : "+this.status.length);
      this.display = false;
    });
  }

  loadFileterdStatus(name: String){
    this.searchName = name;
    this.loadStatusLazy(this.tableEvent);
  }

}
