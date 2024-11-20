import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'https://demometaway.vps-kinghost.net:8485/api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private getAuthorizationHeaders(): HttpHeaders {
    const userSessionData = JSON.parse(localStorage.getItem('userSession') || '{}');
    const accessToken = userSessionData.accessToken;

    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });
  }

  login(username: string, password: string): Observable<any> {
    const loginPayload = { username, password };
    return this.http.post(`${BASE_URL}/auth/login`, loginPayload);
  }
  changePassword(payload: any): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/usuario/alterarSenha`, payload);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${BASE_URL}/usuario/atualizar`, user, {
      headers: this.getAuthorizationHeaders()
    });
  }

  getUserDetails(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/usuario/buscar/${id}`, {
      headers: this.getAuthorizationHeaders()
    });
  }

  searchUsers(term: string): Observable<any[]> {
    const payload = { termo: term };
    return this.http.post<any[]>(`${BASE_URL}/usuario/pesquisar`, payload, {
      headers: this.getAuthorizationHeaders()
    });
  }

  saveUser(userPayload: any): Observable<any> {
    if (!userPayload || !userPayload.usuario) {
      throw new Error('User payload is incomplete');
    }

    return this.http.post(`${BASE_URL}/usuario/salvar`, userPayload, {
      headers: this.getAuthorizationHeaders()
    });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/usuario/deletar/${userId}`, {
      headers: this.getAuthorizationHeaders()
    });
  }
}
