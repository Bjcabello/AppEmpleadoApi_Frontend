import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmpleadoService } from '../../Services/empleado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Empleado } from '../../Models/Empleado';

@Component({
  selector: 'app-empleado',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  standalone: true,
})
export class EmpleadoComponent implements OnInit {
  private empleadoServicio = inject(EmpleadoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  public formEmpleado: FormGroup = this.fb.group({
    nombreCompleto: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    sueldo: [0, Validators.required],
    fechaContrato: ['', Validators.required],
  });

  public idEmpleado: number = 0;

  ngOnInit(): void {
    // ✅ tomar parámetro id de la ruta
    this.route.params.subscribe((params) => {
      this.idEmpleado = Number(params['id']) || 0;

      if (this.idEmpleado !== 0) {
        this.empleadoServicio.obtener(this.idEmpleado).subscribe({
          next: (data: Empleado) => {
            this.formEmpleado.patchValue(data);
          },
          error: (err) => {
            console.error('Error al obtener empleado:', err);
          },
        });
      }
    });
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
          alert('Empleado creado correctamente');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al crear empleado:', err);
          alert('Hubo un problema al crear el empleado');
        },
      });
    } else {
      // Actualizar existente
      this.empleadoServicio.editar(objeto).subscribe({
        next: () => {
          alert('Empleado actualizado correctamente');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al actualizar empleado:', err);
          alert('Hubo un problema al actualizar el empleado');
        },
      });
    }
  }

  volver() {
    this.router.navigate(['/']);
  }
}
