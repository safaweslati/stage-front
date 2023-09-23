import { Component } from '@angular/core';
import {FileUploadService} from "../home/services/file-upload.service";

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.css']
})
export class UploadedFilesComponent {
  uploadedFiles: any;

  constructor(private fileUploadService: FileUploadService) {
    this.fileUploadService.getUploadedFiles().subscribe(
      (response) =>{
        this.uploadedFiles = response;
        console.log(response);
      }
    )
    ;
  }

}
