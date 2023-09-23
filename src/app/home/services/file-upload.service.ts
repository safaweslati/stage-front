import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private excelData: any[][] = [];

  constructor(private http: HttpClient) {}
  private link = 'https://localhost:7100/api/FileUpload';
  private file! : File;


  getFile(){
    return this.file;
  }

  setHeaders(headers: string[]) {
    localStorage.setItem('headers', JSON.stringify(headers));
  }

  getHeaders(): string[] {
    const storedHeaders = localStorage.getItem('headers');
    return storedHeaders ? JSON.parse(storedHeaders) : [];
  }

  setFile(file: File){
    this.file = file;
  }

  setData(excelData: any) {
       this.excelData=excelData;
  }

  uploadFile(file: File, fileInfo: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileInfos', JSON.stringify(fileInfo));


    return this.http.post(this.link, formData,{ responseType: 'text' });
  }

  getTables() {
    return this.http.get(this.link+'/tables');
  }

  getUploadedFiles() {
    return this.http.get(this.link+'/files');
  }

  getDestinationColumns(selectedTable: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.link}/destination-columns?table=${selectedTable}`);
  }


  mapAndUpload(mappingForm: any,destinationTable: string): Observable<any> {
    const formData = new FormData();
    formData.append('excelData', JSON.stringify(this.excelData));
    formData.append('mappingForm', JSON.stringify(mappingForm));
    formData.append('destinationTable', destinationTable);

    console.log(mappingForm);
    console.log(this.excelData);
    return this.http.post<any>(`${this.link}/map-and-upload`, formData);
  }


}
