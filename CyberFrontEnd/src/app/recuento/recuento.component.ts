import { Component, OnInit } from '@angular/core';
import { CifrarService } from '../services/cifrar.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-recuento',
  templateUrl: './recuento.component.html',
  styleUrls: ['./recuento.component.css']
})
export class RecuentoComponent implements OnInit {

  constructor(private recuento: CifrarService,) { }
  recuentoSorted;

  ngOnInit(): void {
    this.recuento.getRecuento().subscribe(
      async (res) => {
        console.log(res);
       // res.sort()
        let entries = Object.entries(res);
        this.recuentoSorted  = entries.sort((a: any, b: any) => -a[1] + b[1]);
        console.log('el recuento es ',   this.recuentoSorted);


      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida del recuento', '', 'error');
      }
    )
  }

}
