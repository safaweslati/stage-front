import {Component} from '@angular/core';
import {FileUploadService} from "../home/services/file-upload.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import jwt_decode from 'jwt-decode';
import {Router} from "@angular/router";


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
  successMessage : string | null = null;
  errorMessage: string | null = null;


    constructor(private fileUploadService: FileUploadService,private formBuilder: FormBuilder,private router: Router) {
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
      this.mappingForm.addControl(`filterValue${header}`, new FormControl(''));
      this.mappingForm.addControl(`filterOperator${header}`, new FormControl(''));
      this.mappingForm.addControl(`sortOrder${header}`, new FormControl(''));
      this.mappingForm.addControl(`AggregateOperation${header}`, new FormControl(''));


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

  MapAndUpload() {
    let uploadUser = '';
    const fileName = this.file.name;
    const fileSize = `${(this.file.size / 1024).toFixed(2)} KB`;
    const currentDate = new Date();
    const options = { timeZone: 'Africa/Tunis', hour12: false };
    const uploadDate = currentDate.toLocaleString('en-US', options);
    const token = localStorage.getItem('token');

    if (token !== null) {
      try {
        const decodedToken: any = jwt_decode(token);
        uploadUser = decodedToken.unique_name;
        console.log(uploadUser);
      } catch (error) {
        console.log(error);
      }
    }

    const fileInfo = {
      fileName: fileName,
      fileSize: fileSize,
      destinationTable: this.selectedDestinationTable,
      uploadDate: uploadDate,
      uploadUser: uploadUser,
    };

    const mappingData: any = {};

    for (const header of this.headers) {
      const selectedValue = this.mappingForm.get(header)?.value;
      const action = this.mappingForm.get(`action${header}`)?.value;

      if (action === 'Filter') {
        mappingData[`filterValue${header}`] = this.mappingForm.get(`filterValue${header}`)?.value;
        mappingData[`filterOperator${header}`] = this.mappingForm.get(`filterOperator${header}`)?.value;
      }
      if (action === 'Sort') {
        mappingData[`sortOrder${header}`] = this.mappingForm.get(`sortOrder${header}`)?.value;
      }
      if (action === 'Aggregate') {
        mappingData[`AggregateOperation${header}`] = this.mappingForm.get(`AggregateOperation${header}`)?.value;
      }
      mappingData[header] = selectedValue;
      mappingData[`action${header}`] = action;
    }

    this.fileUploadService.saveAndMapUpload(this.file, fileInfo, mappingData, this.selectedDestinationTable).subscribe(
      (response) => {
        this.successMessage = response.message;
        this.fileUploadService.setInsertedData(response.insertedData)
        console.log(response);
        setTimeout(() => {
          this.router.navigate(['DisplayData']);
        }, 3000);
      },
      (error) => {
        this.errorMessage = error;
        console.error(error);

        // Handle save and map error
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      }
    );
  }


  isFilterAction(header: string) : boolean {
    const action = this.mappingForm.get(`action${header}`)?.value;
    return action === 'Filter';
  }

  isSortAction(header: string) : boolean {
    const action = this.mappingForm.get(`action${header}`)?.value;
    return action === 'Sort';
  }

  isAggregateAction(header: string): boolean {
    const action = this.mappingForm.get(`action${header}`)?.value;
    return action === 'Aggregate';
  }
}
