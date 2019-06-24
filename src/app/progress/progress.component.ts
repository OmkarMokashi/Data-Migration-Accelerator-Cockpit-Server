import { Component, OnInit } from '@angular/core';
import { ProgressService } from './ProgressService.service';
import { Progress } from './progress.model';
import { LazyLoadEvent } from '../../../node_modules/primeng/components/common/lazyloadevent.d';
import { FilterMetadata } from '../../../node_modules/primeng/components/common/filtermetadata.d';
import { ChartModule } from 'primeng/chart';
import { MessageService } from '../../../node_modules/primeng/components/common/messageservice';
import { template } from '@angular/core/src/render3';
import { TemplateBinding } from '@angular/compiler';
import { and } from '@angular/router/src/utils/collection';
import { Job } from '../jobs/jobs.model';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  
  progress: Progress[];
  selectedProgress: Progress;
  cols: any[];
  totalRecords: number;
  loading: boolean;
  pageSize: number = 5;
  page: number = 0;
  rangeDates: Date[] = [new Date(), new Date()];
  startDate: Date;
  endDate: Date;
  data: any;
  rowClickEvent: any;
  jobTypeProgress: String;
  display: Boolean = true;
  job: Progress[];
  assessmentValues: any[];
  
  constructor(private progressService: ProgressService) {
  //   this.data = {
  //     labels: [1, 2, 3, 4, 5, 6, 7],
  //     datasets: [
  //       {
  //           label: 'First Dataset',
  //           data: [],
  //           fill: false,
  //           borderColor: '#4bc0c0'
  //       },
  //       {
  //           label: 'Second Dataset',
  //           data: [],
  //           fill: false,
  //           borderColor: '#565656'
  //       },
  //       {
  //         label: 'Second Dataset',
  //         data: [],
  //         fill: false,
  //         borderColor: '#565656'
  //     },
  //     {
  //       label: 'Second Dataset',
  //       data: [],
  //       fill: false,
  //       borderColor: '#565656'
  //   },
  //   {
  //     label: 'Second Dataset',
  //     data: [],
  //     fill: false,
  //     borderColor: '#565656'
  // },
  //     ]
  //   }
   }

  ngOnInit() {
    
    // this.progressService.getProgress().then(progress => {
    //   this.progress = <Progress[]> progress.data;
    //   // console.log(progress);
    //   // this.totalRecords = progress.maxRecords;
    //   // this.loading = false;
    // });

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

    this.progressService.getProgress(this.rangeDates[0].getFullYear(),
      this.rangeDates[0].getMonth()+1,
      this.rangeDates[0].getDate(),
      this.rangeDates[1].getFullYear(),
      this.rangeDates[1].getMonth()+1,
      this.rangeDates[1].getDate()).then(progress => {this.progress = <Progress[]> progress.data;
      this.display = false;
    });

    this.progressService.getJobs(this.rangeDates[0].getFullYear(),
      this.rangeDates[0].getMonth()+1,
      this.rangeDates[0].getDate(),
      this.rangeDates[1].getFullYear(),
      this.rangeDates[1].getMonth()+1,
      this.rangeDates[1].getDate()).then(job => {this.job = <Progress[]> job.data;
      this.display = false;
    });
    // console.log("In ngOnInit");
    
    this.progressService.getAssessments().then(assessments => {
      this.assessmentValues = assessments;
      for(var p in this.progress){
        for(var a in this.assessmentValues){
          if(this.progress[p].name.localeCompare(this.assessmentValues[a].legacyType) == 0){
            var totalDataset = 0;
            for(var i = 0;i <= Number(p); i++){
              if(this.progress[i].name.localeCompare(this.progress[p].name) == 0){
                totalDataset += this.progress[i].datasetSize;
              }
            }
            this.progress[p].progressPercent = (totalDataset/this.assessmentValues[a].legacyCount) * 100;
          }
        }
      }
    });

    this.cols = [
      // { field: '_id', header: 'Job Id' },
      { field: 'jobTicket', header: 'Job Ticket' },
      { field: 'jobType', header: 'Type of Job' },
      { field: 'name', header: 'Name of Job' },
      // { field: 'legacyCount', header: 'Legacy Count (in K)', filterMatchMode: 'in' },
      { field: 'datasetSize', header: 'Data Set' },
      // { field: 'processedCount', header: 'Processed Count' },
      // { field: 'totalCount', header: 'Total Count (in K)', filterMatchMode: 'in' },
      // { field: 'executionTime', header: 'Execution Time (minutes)' },
      { field: 'iteration', header: 'Iteration' },
      // { field: 'percentageProcessed', header: '% Processed' },
      { field: 'validationPassed', header: 'Validation (Passed %)' },
      { field: 'validationFailed', header: 'Validation (Failed %)' },
      { field: 'progressPercent', header: 'Progress Percentage' }
      // { field: '__v', header: 'Version'}
    ];
    

    // this.loading = true;

  }

  onClick(){
    this.progressService.getProgress(this.rangeDates[0].getFullYear(),
      this.rangeDates[0].getMonth()+1,
      this.rangeDates[0].getDate(),
      this.rangeDates[1].getFullYear(),
      this.rangeDates[1].getMonth()+1,
      this.rangeDates[1].getDate()).then(progress => {this.progress = <Progress[]> progress.data;
      this.display = false;
    });
    this.progressService.getJobs(this.rangeDates[0].getFullYear(),
      this.rangeDates[0].getMonth()+1,
      this.rangeDates[0].getDate(),
      this.rangeDates[1].getFullYear(),
      this.rangeDates[1].getMonth()+1,
      this.rangeDates[1].getDate()).then(job => {this.job = <Progress[]> job.data;
      this.display = false;
    });

    this.progressService.getAssessments().then(assessments => {
      this.assessmentValues = assessments;
      for(var p in this.progress){
        for(var a in this.assessmentValues){
          if(this.progress[p].name.localeCompare(this.assessmentValues[a].legacyType) == 0){
            var totalDataset = 0;
            for(var i = 0;i <= Number(p); i++){
              if(this.progress[i].name.localeCompare(this.progress[p].name) == 0){
                totalDataset += this.progress[i].datasetSize;
              }
            } 
            this.progress[p].progressPercent = (totalDataset/this.assessmentValues[a].legacyCount) * 100;
          }
        }
      }
    });
    // console.log("In onClick()");                          
  }

  rowClick(rowClickEvent){
    // console.log("The row is clicked : "+rowClickEvent.jobType);
    this.jobTypeProgress = rowClickEvent.jobType;
    // console.log("this.job : "+this.job);
    // console.log("this.progress : "+this.progress.length);
    var prog: any;
    var itr: number = 0;
    for(prog in this.job){
      if((this.job[prog].jobType == rowClickEvent.jobType) && (this.job[prog].iteration > itr)){
        itr = this.job[prog].iteration;
      }
    }
    itr = rowClickEvent.iteration;
    var j: number;
    var percetageProgress: number;
    var tData: number[];
    var count: number;
    tData = [];
    for(j = 1; j <= itr; j++){
      // percetageProgress = 0;
      // count = 0;
      // for(prog in this.job){
      //   if((this.job[prog].name == rowClickEvent.name) && (this.job[prog].iteration == j)){
      //     percetageProgress += this.job[prog].validationPassed;
      //     count += 1;
      //   }
      // }
      // if(count != 0 && percetageProgress != 0){
      //   // console.log(percetageProgress);
      //   // console.log(count);
      //   tData.push(percetageProgress/count);
      //   // console.log(tData);
      // }else{
      //   // tData.push(0);
      // }
      tData.push(0);
    }
    for(j = 0; j < itr; j++){
      for(prog in this.job){
        if((this.job[prog].name == rowClickEvent.name) && (this.job[prog].iteration == j+1)){
          tData[j] = this.job[prog].validationPassed;
        }
      }
    }
    // console.log("itr : "+itr);
    var i:number;
    var tempLabel: String[];
    tempLabel = [];
    for(i=1;i<=itr;i++){
      tempLabel.push(i+"");
    }

    this.data = {
      labels: tempLabel,
      datasets: [
        {
            label: rowClickEvent.name,
            data: tData,
            fill: false,
            borderColor: '#4bc0c0'
        }
      ]
    }
    

  }

  // selectData(event) {
  //   this.progressService.add({severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index]});
  // }

  // loadProgressLazy(event: LazyLoadEvent) { 
  //   console.log('========logProgressLazy======');
  //   console.log(event);
  //   this.loading = true;
  //   this.page += 1;
  //   //event.first = this.page;
  //   event.sortOrder = 1;
  //   // event.sortField = "legacyType";
   
    
  //   this.progressService.getProgress(event.rows,(event.first/event.rows)+1).then(progress => {
  //     this.progress = progress.data;
  //     console.log(progress);
  //     this.totalRecords = progress.maxRecords;
  //     this.loading = false;
  //   });

  // }

}