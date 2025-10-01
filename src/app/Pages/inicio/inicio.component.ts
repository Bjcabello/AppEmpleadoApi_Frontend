import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmpleadoService } from '../../Services/empleado.service';
import { Empleado } from '../../Models/Empleado';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  private empleadoServicio = inject(EmpleadoService);
  public listaEmpleados: Empleado[] = [];
  public displayedColumns: string[] = [
    'nombreCompleto',
    'correo',
    'sueldo',
    'fechaContrato',
    'accion',
  ];

  constructor(private router: Router) {
    this.ObtenerEmpleado();
  }

  ObtenerEmpleado() {
    this.empleadoServicio.lista().subscribe({
      next: (data) => {
        this.listaEmpleados = data;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
      },
    });
  }

  nuevo() {
    this.router.navigate(['/empleado', 0]);
  }

  editar(objeto: Empleado) {
    this.router.navigate(['/empleado', objeto.idEmpleado]);
  }

  eliminar(objeto: Empleado) {
    if (confirm('Desea eliminar el empleado ' + objeto.nombreCompleto + '?')) {
      this.empleadoServicio.eliminar(objeto.idEmpleado).subscribe({
        next: () => {
          this.ObtenerEmpleado(); 
        },
        error: (error) => {
          console.error('Error al eliminar empleado:', error);
        },
      });
    }
  }
}
