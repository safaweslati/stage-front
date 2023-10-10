import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploadService} from "../home/services/file-upload.service";

@Component({
  selector: 'app-display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.css']
})
export class DisplayDataComponent {

  public initialExcelData!: any[][];
  public insertedData!: any[][];
  constructor(private fileUploadService: FileUploadService, private router: Router){
    this.initialExcelData = this.fileUploadService.getData();
    this.insertedData = this.fileUploadService.getInsertedData();
    console.log(this.insertedData);
    console.log(this.initialExcelData);
    }


  getRowId(row: any[]): string {
    // Create a unique identifier for the row by concatenating cell values
    return row.map(value => String(value).trim()).join('_');
  }

  getRowClass(row: any[]): string {
    const rowId = this.getRowId(row);
    const insertedIds = this.insertedData.map(insertedRow => this.getRowId(insertedRow));

    console.log('Row ID:', rowId);
    console.log('Inserted IDs:', insertedIds);

    return insertedIds.includes(rowId) ? 'table-success' : 'table-danger';
  }

  uploadNewFile() {
    this.router.navigate(['home']);
  }
}
