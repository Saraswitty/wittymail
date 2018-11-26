import { Injectable } from '@angular/core';
import { LoggerService } from './util/logger.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

export interface VersionInfo {
  version: string;
}

export interface ColumnHeadersWithRowContent {
  headers: string[];
  contents: any[];
}

export interface ColumnMappings {
  to_column: string;
  cc_column: string;
  attachment_column: string;
}

@Injectable({
  providedIn: 'root'
})
export class WittymailService {

  urls = {
    version: 'api/version',  // GET
    fodder: 'api/fodder',    // POST
    attachment: 'api/attachment'  // POST
  }

  constructor(private log: LoggerService, private http: HttpClient) {
    this.log.info("Created: ", this);
  }

  /**
   * Common handler for all REST API call failures
   * 
   * @param error HTTP error from REST API response
   */
  private handleApiResponseError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.log("Client-side failure for REST API call: " + error.error.message);
    } else {
      // The server returned an error HTTP status code
      console.log("REST API failed, response: " + error);
    }

    return new ErrorObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.log.error(error); // log to console instead
      this.log.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getVersion(): Observable<VersionInfo> {
    let version: VersionInfo = { version: '' }
    return this.http.get<VersionInfo>(this.urls.version)
      .pipe(
        catchError(this.handleError('getVersion', version))
      );
  }

  getFodderUploadUrl(): string {
    return this.urls.fodder;
  }

  getAttachmentUploadUrl(): string {
    return this.urls.attachment;
  }

  getColumnHeadersWithSampleRows(): ColumnHeadersWithRowContent {
    let res: ColumnHeadersWithRowContent = {
      headers: [
        'Name of Child', 'Class', 'Sponsor', 'Reference', 'Mail ID', 'Reference mail ID'
      ],
      contents: [
        {
          'Name of Child': 'Aradhya Karche',
          'Class': 'Jr. KG- shanti nagar',
          'Sponsor': 'Jaya Singh',
          'Reference': 'Akshay Kokne',
          'Mail ID': 'jaya.singh753@gmail.com',
          'Reference mail ID': 'amboreravi@gmail.com'
        },
        {
          'Name of Child': 'Aradhya Karche',
          'Class': 'Jr. KG- shanti nagar',
          'Sponsor': 'Jaya Singh',
          'Reference': 'Akshay Kokne',
          'Mail ID': 'jaya.singh753@gmail.com',
          'Reference mail ID': 'amboreravi@gmail.com'
        }
      ]
    };

    return res;
  }

}
