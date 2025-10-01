import { Component, inject, Input, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';  // Corregido: MatButtonModule en lugar de MatButton
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmpleadoService } from '../../Services/empleado.service';
import { Router } from '@angular/router';
import { Empleado } from '../../Models/Empleado';

@Component({
  selector: 'app-empleado',
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule],  // Corregido: MatButtonModule
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  standalone: true  // Agregado explícitamente para claridad (opcional si ya está configurado)
})
export class EmpleadoComponent implements OnInit {
  @Input() idEmpleado: number = 0;  // Inicializado a 0 para evitar undefined

  private empleadoServicio = inject(EmpleadoService);
  private router = inject(Router);  // Movido a inject para consistencia (opcional)
  public formBuild = inject(FormBuilder);

  public formEmpleado: FormGroup = this.formBuild.group({
    nombreCompleto: [''],
    correo: [''],
    sueldo: [0],
    fechaContrato: [''],
  });

  ngOnInit(): void {
    if (this.idEmpleado !== 0) {  // Corregido: !== para comparación estricta
      this.empleadoServicio.obtener(this.idEmpleado).subscribe({
        next: (data: Empleado) => {
          this.formEmpleado.patchValue(data);
        },
        error: (err) => {
          console.error('Error al obtener empleado:', err.message);
        
        },
      });
    }
  }

  guardar() {
    const objeto: Empleado = {
      idEmpleado: this.idEmpleado,
      nombreCompleto: this.formEmpleado.value.nombreCompleto,
      correo: this.formEmpleado.value.correo,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: this.formEmpleado.value.fechaContrato,
    };

    if (this.idEmpleado === 0) {
      // Crear nuevo
      this.empleadoServicio.crear(objeto).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al crear empleado:', err.message);
          alert('Hubo un problema al crear el empleado');
        },
      });
    } else {
      // Actualizar existente
      this.empleadoServicio.editar(objeto).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al actualizar empleado:', err.message);
          alert('Hubo un problema al actualizar el empleado');
        },
      });
    }
  }

  volver() {
    this.router.navigate(['/']);
  }
}
