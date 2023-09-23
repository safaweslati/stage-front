import { Component } from '@angular/core';
import {FileUploadService} from "./services/file-upload.service";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {addMinutes, format, isValid} from 'date-fns';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  excelData: any[][] = [];
  excelDataHeaders: string[] = [];
  errorMessage: string | null = null;
  allowedFileTypes: string[] = ['.xls', '.xlsx','.csv'];
  showTable: boolean = false;
  uploadedFiles: any;
  fileSelected: boolean=false;


  constructor(private fileUploadService: FileUploadService,private datePipe: DatePipe, private router: Router) {
    this.fileUploadService.getUploadedFiles().subscribe(
      (response) =>{
        this.uploadedFiles = response;
            console.log(response);
      }
    )

    ;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileSelected = true;
      // Check if the selected file has an allowed extension
      const fileExtension = file.name.toLowerCase().split('.').pop();
      if (fileExtension && this.allowedFileTypes.includes(`.${fileExtension}`)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const binaryString: string = e.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const worksheetName = workbook.SheetNames[0]; // Get the name of the first sheet
          const worksheet = workbook.Sheets[worksheetName];
          this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          this.fileUploadService.setData(data);
          this.excelDataHeaders = this.excelData[0]
          this.fileUploadService.setHeaders(this.excelDataHeaders);
          this.excelData.splice(0, 1); // Remove headers from data
          // Convert numeric date values to date format
          this.excelData.forEach((row: any[]) => {
            row.forEach((cell: any, index: number) => {
              if (typeof cell === 'number' && isValid(new Date(1900, 0, cell))) {
                const column = this.excelDataHeaders[index]; // Get the header of the current column
                if (column.toLowerCase().includes('date')) {// Check if the column represents a date
                  const date = addMinutes(new Date(1900, 0, cell), new Date().getTimezoneOffset());
                  row[index] = format(date, 'dd/MM/yyyy');
                }
              }
            });
          });
          this.errorMessage = null; // Clear any previous error
        };
        reader.readAsBinaryString(file);
      } else {
        this.errorMessage = 'Please upload an Excel file (XLS or XLSX).';
        this.excelData = [];
        this.excelDataHeaders = [];
      }
    }
  }



  uploadFile() {
    const fileInput: HTMLInputElement | null = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const fileToUpload = fileInput.files[0];
      this.fileUploadService.setFile(fileToUpload);
      this.showTable = true;
    }
  }

  uploadNewFile() {
    this.showTable = false;
    this.excelData = [];
    this.excelDataHeaders = [];
    this.errorMessage = null;
  }

  addToDatabase() {
    this.router.navigate(['FileConfig']);
  }

}
