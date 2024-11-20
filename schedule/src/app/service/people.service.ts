import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { catchError, throwError } from 'rxjs';

const BASE_URL = 'https://demometaway.vps-kinghost.net:8485/api/pessoa';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  private getAuthorizationHeaders(): HttpHeaders {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const accessToken = userSessionData.accessToken;

    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/buscar/${id}`, {
      headers: this.getAuthorizationHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar pessoa por ID:', error);
        return throwError(error);
      })
    );
  }

  searchPeople(nome: string): Observable<any[]> {
    const busca = { nome };
    return this.http.post<any[]>(`${BASE_URL}/pesquisar`, busca, {
      headers: this.getAuthorizationHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar pessoas:', error);
        return throwError(error);
      })
    );
  }

  savePerson(person: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/salvar`, person, {
      headers: this.getAuthorizationHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erro ao salvar pessoa:', error);
        return throwError(error);
      })
    );
  }

  updatePerson(person: any): Observable<any> {
    return this.http.put(`${BASE_URL}/pessoa/atualizar`, person, {
      headers: this.getAuthorizationHeaders()
    });
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}/remover/${id}`, {
      headers: this.getAuthorizationHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Erro ao remover pessoa:', error);
        return throwError(error);
      })
    );
  }

  savePeople(contact: any): Observable<any> {
    return this.uploadPhoto(contact.foto).pipe(
      switchMap((resp: any) => {
        contact.foto = {
          id: resp.object.id,
          nome: resp.object.name,
          type: resp.object.type
        };

        return this.http.post<any>(`${BASE_URL}pessoa/salvar`, contact, {
          headers: this.getAuthorizationHeaders()
        });
      })
    );
  }

  uploadPhoto(photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', photo);

    return this.http.post(`${BASE_URL}foto/upload`, formData, {
      headers: this.getAuthorizationHeaders()
    });
  }

  downloadPhoto(photoId: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}foto/download/${photoId}`, {
      headers: this.getAuthorizationHeaders(),
      responseType: 'blob'
    });
  }
}
