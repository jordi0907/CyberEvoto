import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { PersonaService } from '../services/persona.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  nuevoPersonaForm2: FormGroup;
  constructor(private formBuilder2: FormBuilder, private personaService: PersonaService, private router: Router) { }

  ngOnInit(): void {
    this.nuevoPersonaForm2 = this.formBuilder2.group({
      nombre: ['', [Validators.required, Validators.nullValidator]],
      apellidos: ['', [Validators.required, Validators.nullValidator]],
      fechanacimiento: ['', [Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]],
      fechavacunado: ['', [Validators.pattern(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/)]],
      profesion: [''],
      vacuna: ['']
    });
  }

  get formControls(){
    return this.nuevoPersonaForm2.controls;
  }

  addresultado(): void{
    if(this.nuevoPersonaForm2.invalid){
      return;
    }
    const nombre = this.nuevoPersonaForm2.value.nombre;
    const apellidos = this.nuevoPersonaForm2.value.apellidos;
    const fechanacimiento = this.nuevoPersonaForm2.value.fechanacimiento;
    const fechavacunado = this.nuevoPersonaForm2.value.fechavacunado;
    const profesion = this.nuevoPersonaForm2.value.profesion;
    const vacuna = this.nuevoPersonaForm2.value.vacuna;


    const personaAdd = {'_id': '', 'nombre': nombre, 'apellidos': apellidos, 'fechanacimiento': fechanacimiento, 'fechavacunado': fechavacunado, 'profesion': profesion, 'vacuna': vacuna};

    this.personaService.addPersona(personaAdd).subscribe( async data =>{
      console.log(data)
      await Swal.fire('Persona Añadida con exito', '', 'success');
      this.router.navigateByUrl('/principal');
    }, err =>{
      console.log("error");
      if (err.status == 400) { console.log("404")}
      Swal.fire('Error al insertar un registro', '', 'error');
    })
  }

  atras(){
    this.router.navigateByUrl('/principal');
  }
















}
