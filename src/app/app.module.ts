import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckboxModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DataTableModule } from 'primeng/datatable'
import { JobsComponent } from './jobs/jobs.component';
import { JobService } from './jobs/JobService.service';
import { ProgressService } from './progress/ProgressService.service';
import { HttpClientModule } from '@angular/common/http';
import { ProgressComponent } from './progress/progress.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { AssessmentComponent } from './assessment/assessment.component';
import { AssessmentService } from './assessment/AssessmentService.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/components/chart/chart';
import { StatusComponent } from './status/status.component';
import { StatusService } from './status/StatusService.service';
import { ObjectstatusComponent } from './objectstatus/objectstatus.component';
import { ObjectstatusService } from './objectstatus/ObjectstatusService.service';
import { TreeTableModule } from 'primeng/treetable';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    AppComponent,
    JobsComponent,
    ProgressComponent,
    AssessmentComponent,
    StatusComponent,
    ObjectstatusComponent,
    ProgressSpinner
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CheckboxModule,
    TableModule,
    DataTableModule,
    HttpClientModule,
    MultiSelectModule,
    CalendarModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    DropdownModule,
    TreeTableModule,
    ChartModule,
    ToastModule,
    DialogModule,
	FileUploadModule
  ],
  providers: [JobService, ProgressService, AssessmentService, StatusService, ObjectstatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
