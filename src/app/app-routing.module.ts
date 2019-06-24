import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {JobsComponent} from './jobs/jobs.component';
import {ProgressComponent} from './progress/progress.component';
import {AssessmentComponent} from './assessment/assessment.component';
import {StatusComponent} from './status/status.component';
import {ObjectstatusComponent} from './objectstatus/objectstatus.component';

const routes: Routes = [
  {path: 'jobs', component: JobsComponent},
  {path: 'progress', component: ProgressComponent},
  {path: 'assessments', component: AssessmentComponent},
  {path: 'status', component: StatusComponent},
  {path: 'objectstatus', component: ObjectstatusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
