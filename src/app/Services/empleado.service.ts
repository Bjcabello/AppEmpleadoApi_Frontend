import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../../Settings/appsettings';
import { Empleado } from '../Models/Empleado';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private apiUrl: string = appsettings.apiurl + 'Empleado';

  lista(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al listar empleados:', error);
        return throwError(() => error);
      })
    );
  }

  obtener(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  crear(objeto: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, objeto);
  }

  editar(objeto: Empleado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${objeto.idEmpleado}`, objeto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
