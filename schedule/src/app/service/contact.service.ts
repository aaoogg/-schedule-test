import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

const BASE_URL = 'https://demometaway.vps-kinghost.net:8485/api/';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  private getAuthorizationHeaders(): HttpHeaders {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const accessToken = userSessionData.accessToken;

    if (!accessToken) {
      throw new Error('Token de acesso não encontrado');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  getContactsByPersonId(personId: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}contato/listar/${personId}`, {
      headers: this.getAuthorizationHeaders()
    });
  }

  searchContacts(searchTerm: string): Observable<any[]> {
    const searchParams = { termo: searchTerm };
    return this.http.post<any[]>(`${BASE_URL}contato/pesquisar`, searchParams, {
      headers: this.getAuthorizationHeaders()
    });
  }

  deleteContact(contactId: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}contato/remover/${contactId}`, {
      headers: this.getAuthorizationHeaders()
    });
  }

  saveContact(contact: any): Observable<any> {
    return this.uploadPhoto(contact.foto).pipe(
      switchMap((resp: any) => {
        contact.foto = {
          id: resp.object.id,
          nome: resp.object.name,
          type: resp.object.type
        };

        return this.http.post<any>(`${BASE_URL}contato/salvar`, contact, {
          headers: this.getAuthorizationHeaders()
        });
      })
    );
  }

  updateContact(user: any): Observable<any> {
    return this.http.put(`${BASE_URL}/contato/atualizar`, user, {
      headers: this.getAuthorizationHeaders()
    });
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

  toggleFavorite(contact: any): Observable<any> {
    const updatedContact = { ...contact, privado: !contact.privado };
    return this.http.post<any[]>(`${BASE_URL}/favorito/salvar`, updatedContact, {
      headers: this.getAuthorizationHeaders()
    });
  }

}
