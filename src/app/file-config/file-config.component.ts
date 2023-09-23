import {Component} from '@angular/core';
import {FileUploadService} from "../home/services/file-upload.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-file-config',
  templateUrl: './file-config.component.html',
  styleUrls: ['./file-config.component.css']
})
export class FileConfigComponent {
  tables: any;
  file : File;
  selectedDestinationTable: string= 'Choose Destination Table';
  showConfig: boolean=false;
  headers: string[] = [];
  columns: string[] = [];
  mappingForm: FormGroup;


    constructor(private fileUploadService: FileUploadService,private formBuilder: FormBuilder) {
      this.fileUploadService.getTables().subscribe(
        (response) => {
          console.log(response);
          this.tables = response;
        });
      this.file = this.fileUploadService.getFile();
      this.mappingForm = this.formBuilder.group({});
    }

  onTableSelection() {
    this.showConfig = true;
    this.headers = this.fileUploadService.getHeaders();
    this.fileUploadService.getDestinationColumns(this.selectedDestinationTable).subscribe(
      (response) => {
        console.log(response);
        console.log(this.headers);
        this.columns = response;
      }
    );
    for (const header of this.headers) {
      this.mappingForm.addControl(header, new FormControl('Select a DB field'));
      this.mappingForm.addControl(`action${header}`, new FormControl('Convert'));
      this.mappingForm.addControl(`cropValue${header}`, new FormControl(''));
      this.mappingForm.addControl(`filterValue${header}`, new FormControl(''));
      this.mappingForm.addControl(`filterOperator${header}`, new FormControl('Filter Operator'));

    }

  }

  resetOtherSelections(currentHeader: string): void {
    const currentControl= this.mappingForm.get(currentHeader);
    const currentValue = currentControl?.value;
    this.headers
      .filter((h) => typeof h === 'string' && h !== currentHeader)
      .forEach((h) => {
        const control = this.mappingForm.get(h);
        if (control && control.value === currentValue) {
          control.setValue(null);
        }
      });
  }

  isAllHeadersMapped(): boolean {
    return this.headers.every((header) => {
      const control = this.mappingForm.get(header);
      return control && control.value !== null && control.value !== "Select a DB field";
    });
  }

  saveFile(){
      let uploadUser = '';
    const fileName = this.file.name;
    const fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
    const uploadDate = new Date();
    const token = localStorage.getItem('token') ;
     if(token !== null){
    try {
      const decodedToken: any = jwt_decode(token);
      uploadUser = decodedToken.unique_name;
      console.log(uploadUser);
    } catch(Error) {
      console.log(Error);
    }}

    const fileInfo = {
      fileName: fileName,
      fileSize: fileSize,
      destinationTable: this.selectedDestinationTable,
      uploadDate: uploadDate,
      uploadUser: uploadUser,
    };
    this.fileUploadService.uploadFile(this.file, fileInfo).subscribe(
      (response) => {
        try {
          const jsonResponse = JSON.parse(response);
          console.log(jsonResponse);
        }
     catch (error) {
      console.error('Error parsing JSON response:', error);
    }
  })
    }


  MapAndUpload() {
      this.saveFile();
    console.log(this.mappingForm);
    const mappingData : any = {};

    for (const header of this.headers) {
      const selectedValue = this.mappingForm.get(header)?.value;
      const action = this.mappingForm.get(`action${header}`)?.value;
      if (action === 'Crop') {
        mappingData[`cropValue${header}`] = this.mappingForm.get(`cropValue${header}`)?.value;
      }
      if (action === 'Filter') {
        mappingData[`filterValue${header}`] = this.mappingForm.get(`filterValue${header}`)?.value;
        mappingData[`filterOperator${header}`] = this.mappingForm.get(`filterOperator${header}`)?.value;
      }
      mappingData[header] = selectedValue;
      mappingData[`action${header}`] = action;
    }
    this.fileUploadService.mapAndUpload(mappingData, this.selectedDestinationTable).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      })
  }


  isCropAction(header: string): boolean {
    const action = this.mappingForm.get(`action${header}`)?.value;
    return action === 'Crop';
  }


  isFilterAction(header: string) : boolean {
    const action = this.mappingForm.get(`action${header}`)?.value;
    return action === 'Filter';
  }
}
