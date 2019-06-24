import { Component, OnInit } from '@angular/core';
import {AssessmentService} from './AssessmentService.service';
import {Assessment} from './assessments.model';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  assessments: Assessment[];
  cols: any[];
  totalRecords: number;
  display: Boolean = true;
  csvRecords: any;
  typeCountArray: any[] = [];
  localAssessment: Assessment[];

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit() {

    this.assessmentService.getAssessments().then(assessments => {
      this.assessments = assessments;
      this.display = false;
    });

    this.cols = [
      // { field: '_id', header: 'Job Id' },
      { field: 'legacyType', header: 'Legacy Type'},
      { field: 'legacyCount', header: 'Legacy Count' }
      // { field: '__v', header: 'Version'}
    ];
	
	document.getElementById("addButton").style.display = "none";

  }
  
  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
 }

 getHeaderArray(csvRecordsArr: any) 
{      
   let headers = csvRecordsArr[0].split(',');      
   let headerArray = [];            
     
   for (let j = 0; j < headers.length; j++) {        
               headerArray.push(headers[j]);      
   }        
  return headerArray; 
} 

getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) 
{     
          var dataArr = [];
          for (let i = 1; i < csvRecordsArray.length; i++) {
              console.log("data :: "+csvRecordsArray[i]);         
               let data = csvRecordsArray[i].split(',');
                    var csvRecord: Assessment = <Assessment>{
                      legacyType: "qwe",
                      legacyCount: 123
                    };                                      
                    csvRecord.legacyType = data[0].trim();  
                    csvRecord.legacyCount = data[1].trim();                          
                    dataArr.push(csvRecord);
           }
          this.typeCountArray = dataArr;    
    return dataArr; 
} 

fileChangeListener($event: any): void {     
  var text = [];     
  var files = $event.srcElement.files;          
  this.assessmentService.getAssessments().then(assessments => {
    this.localAssessment = assessments;
  });
  if (this.isCSVFile(files[0])) {         
     var input = $event.target;         
     var reader = new FileReader();          
     reader.readAsText(input.files[0]);         

     reader.onload = (data) => {            
          let csvData = reader.result;            
          let csvRecordsArray = (<String>csvData).split(/\r\n|\n/);    
          let headersRow = this.getHeaderArray(csvRecordsArray);
          this.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray,headersRow.length);
          this.assessments = <Assessment[]>this.csvRecords      
        }               
             reader.onerror = function() {            
                 alert('Unable to read ' + input.files[0]);          
             };  
             this.assessments = <Assessment[]>this.csvRecords 
    } else {          
           alert("Please import valid .csv file.");          
          //  this.fileReset();      
    }
    document.getElementById("addButton").style.display = "block"; 
}

sendData(event){
  var typeCountString = "";
  var flag = 0;
  for(let i = 0; i < this.typeCountArray.length; i++){
    var assessmentItr: any;
    flag = 0;
    for(assessmentItr in this.localAssessment){
      if(this.localAssessment[assessmentItr].legacyType.localeCompare(this.typeCountArray[i].legacyType) == 0){
        flag = 1;
        this.assessmentService.updateAssessment(this.typeCountArray[i].legacyType,this.typeCountArray[i].legacyCount);
      }
    }
    if(flag == 0){
      typeCountString += this.typeCountArray[i].legacyType+"_"+this.typeCountArray[i].legacyCount+"|";
    }
  }
  if(typeCountString == "" && flag == 0){
    alert("Please add data in the csv file!");
  }else if(typeCountString == "" && flag == 1){
    alert("Data Updated Successfully!");
  }else{
    typeCountString = typeCountString.substring(0,typeCountString.length-1);
    this.assessmentService.setAssessments(typeCountString);
    alert("Data Added/Updated Successfully! "+typeCountString);
  }
}

}
