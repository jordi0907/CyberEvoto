import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Token } from '../model/token';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  authForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.authForm  =  this.formBuilder.group({
      nombre: ['', [Validators.required]],
      password: ['', Validators.required],
      DNI: ['', Validators.required]
  });
  }

  get formControls() { return this.authForm.controls; }

  signIn(){
    if (this.authForm.invalid){
      return;
    }
     this.authService.signIn(this.authForm.value)
    .subscribe((token: Token) => {
      console.log(this.authForm.value);
      localStorage.setItem('ACCESS_TOKEN', token.token);
      this.router.navigateByUrl('/principal');
    },
  (err) => {
    console.log('error');
    Swal.fire('Password o Usuario incorrectos', '', 'error');
  }
    );

  }

}
