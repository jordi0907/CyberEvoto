import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { persona } from '../model/persona';
import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']
})
export class ModificarComponent implements OnInit {

  modificadoPersonaForm: FormGroup;
  resultado: persona;
  id: String;
  constructor(private formBuilder: FormBuilder,  private personaService: PersonaService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.personaService.getPersona(this.id).subscribe(data =>{
      this.resultado = data;
      this.modificadoPersonaForm = this.formBuilder.group({
      nombre: [this.resultado.nombre, [Validators.required, Validators.nullValidator]],
      apellidos: [this.resultado.apellidos, [Validators.required, Validators.nullValidator]],
      fechanacimiento: [this.resultado.fechanacimiento, [Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]],
      fechavacunado: [this.resultado.fechavacunado, [Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]],
      profesion: [this.resultado.profesion],
      vacuna: [this.resultado.vacuna]
      });
    })
  }

  get formControls(){
    return this.modificadoPersonaForm.controls;
  }

  atras(){
    this.router.navigateByUrl('/principal');
  }

  modificarPersona(){
    if(this.modificadoPersonaForm.invalid){
      return;
    }

    const nombre = this.modificadoPersonaForm.value.nombre;
    const apellidos = this.modificadoPersonaForm.value.apellidos;
    const fechanacimiento = this.modificadoPersonaForm.value.fechanacimiento;
    const fechavacunado = this.modificadoPersonaForm.value.fechavacunado;
    const profesion = this.modificadoPersonaForm.value.profesion;
    const vacuna = this.modificadoPersonaForm.value.vacuna;


    const personaModificado = {'_id': '', 'nombre': nombre, 'apellidos': apellidos, 'fechanacimiento': fechanacimiento, 'fechavacunado': fechavacunado, 'profesion': profesion, 'vacuna': vacuna };
    this.personaService.modificarPersona(personaModificado, this.route.snapshot.paramMap.get('id')).subscribe(async data => {
      await Swal.fire('Persona modificado con éxito', '', 'success');
      this.router.navigateByUrl('/principal');
    },err =>{
      console.log("error");
      Swal.fire('Error en la conexion', '', 'error');
    })
  }























}
