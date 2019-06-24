import { Component, OnInit } from '@angular/core';
import { StatusService } from './StatusService.service';
import { Status } from './status.model';
import { LazyLoadEvent, TreeModule } from 'primeng/primeng';
import { StaticInjector } from '@angular/core/src/di/injector';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  cols: any;
  status: Status[];
  totalRecords: number;
  loading: boolean;
  pageSize: number = 5;
  page: number = 0;
  tableEvent: LazyLoadEvent;
  searchName: String = "";
  display: Boolean = true;

  constructor(private statusService: StatusService) { }

  ngOnInit() {

    this.statusService.getStatus(this.pageSize, this.page+1, this.searchName).then(status => {
      this.status = <Status[]> status.data;
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
    // console.log("Lazy Load Status Event");
    this.loading = true;
    this.page += 1;
    // console.log("event.rows : "+event.rows);
    // console.log("first : "+event.first);
    // console.log("first/rows + 1 : "+(event.first/event.rows)+1);
    this.statusService.getStatus(event.rows,(event.first/event.rows)+1,this.searchName).then(status =>{
      this.status = status.data;
      this.totalRecords = status.totalRecords;
      this.loading = false;
      // console.log(status);
      // console.log("Name in lazy : "+this.searchName);
      this.display = false;
    });
  }

  loadFileterdStatus(name: String){
    this.searchName = name;
    this.loadStatusLazy(this.tableEvent);
  }

}
