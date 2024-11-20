import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private baseUrl = 'https://demometaway.vps-kinghost.net:8485/api/foto';

  constructor(private http: HttpClient) { }

  uploadPhoto(id: number, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', photo, photo.name);

    const url = `${this.baseUrl}/upload/${id}`;

    return this.http.post(url, formData);
  }

  downloadPhoto(id: number): Observable<Blob> {
    const url = `${this.baseUrl}/download/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
