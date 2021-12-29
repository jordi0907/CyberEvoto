import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajeServidor, Mensaje, CifradoRSA } from '../model/modelo';
import { generateKeys, rsaKeyPair, RsaPublicKey, RsaPrivateKey, Cegador } from '../model/rsa';

//import * as cryptojs from 'crypto';
import * as sha from 'object-sha'

import { persona } from '../model/persona';
import { CifrarService } from '../services/cifrar.service';
import { PersonaService } from '../services/persona.service';
import * as bigintConversion from 'bigint-conversion';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  mensaje: string;
  mensajeVerif: string;
  mensajes: Mensaje[] = [];
  errorMensaje: Boolean = false;
  personas: persona[];
  keyPair: RsaPublicKey;
  keyPair2;
  keyPair2Priv;
  claveRSApubServ: RsaPublicKey;
  cegador: Cegador;
  hash;
  voto;
  claveRSACliente: rsaKeyPair;

  constructor(
    private personaService: PersonaService,
    private router: Router,
    private cifrarClave: CifrarService,
    private cifrarRSA: CifrarService
  ) {}

  ngOnInit(): void {
    this.cifrarRSA.getClave2().subscribe(
      async (res) => {
        console.log(res);

        this.claveRSApubServ = new RsaPublicKey( //clave publica servidor
          bigintConversion.hexToBigint(res.e),
          bigintConversion.hexToBigint(res.n)
        );
        console.log('clave publica servidor',   this.claveRSApubServ);
        this.cegador = new Cegador(this.claveRSApubServ)
        console.log('cegador',  this.cegador);
      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la clave publica', '', 'error');
      }
    )

   /*  generateKeys(2048).then(data=>{
        this.claveRSACliente = data
        console.log("las clave del cliente privada ", this.claveRSACliente.privateKey , " y publica", this.claveRSACliente.publicKey)
    }); */

  }

  modificar(personaId) {
    this.router.navigate(['/' + personaId]);
  }

  async enviar(): Promise<void> {
    if (this.mensaje === undefined || this.mensaje === '') {
      this.errorMensaje = true;

      return;
    }

    this.errorMensaje = false;
    let clave: RsaPublicKey;

    /* this.cifrarRSA.getClave().subscribe( async res =>{
      console.log(res);
      this.keyPair = bigintConversion.hexToBigint(res);
      const mensajecifrado: bigint =  await this.keyPair.publicKey.encrypt(bigintConversion.textToBigint(this.mensaje));
      console.log("mensaje cifrado", mensajecifrado)
    },err =>{
      console.log("error");
      Swal.fire('Error en la conexion', '', 'error');
    }) */

    this.cifrarRSA.getClave2().subscribe(
      async (res) => {
        console.log(res);

        this.keyPair2 = new RsaPublicKey(
          bigintConversion.hexToBigint(res.e),
          bigintConversion.hexToBigint(res.n)
        );
        console.log('keypair2', this.keyPair2);
        const mensajecifrado2: bigint = await this.keyPair2.encrypt(
          bigintConversion.textToBigint(this.mensaje)
        );
        console.log('mensaje cifrado', mensajecifrado2);
        const mensajeCifradoHex = bigintConversion.bigintToHex(mensajecifrado2);
        console.log('mensaje mensajeCifradoHex', mensajeCifradoHex);
        let dataEnviar = { msg: mensajeCifradoHex };
        this.cifrarRSA.enviarMensajeRSA(dataEnviar).subscribe(async (res) => {
          console.log('mensaje descifrado es:', res);
        }),
          (err) => {
            console.log('error');
            Swal.fire('Error en la envio del mensaje', '', 'error');
          };
      },
      (err) => {
        console.log('error');
        Swal.fire('Error en la recogida de la clave publica', '', 'error');
      }
    );
  }

  //let enviar: MensajeServidor;

  /*        const cifrado: CifradoRSA = await this.cifrarClave.cifrarRSA(new Uint8Array(bigintConversion.textToBuf(this.mensaje)));
        enviar = {
          //usuario: this.usuario,
          tipo: "RSA",
          cifrado: bigintConversion.bufToHex(cifrado.cifrado.mensaje),
          iv: bigintConversion.bufToHex(cifrado.cifrado.iv),
          clave: cifrado.clave
        } */

        async enviarValidado(): Promise<void> {
          if (this.mensajeVerif === undefined || this.mensajeVerif === '') {
            this.errorMensaje = true;

            return;
          }

          this.errorMensaje = false;
          let clave: RsaPublicKey;
          let clave2: RsaPrivateKey

          this.cifrarRSA.getClave2().subscribe(
            async (res) => {
              console.log(res);

              //Publica
              this.keyPair2 = new RsaPublicKey(
                bigintConversion.hexToBigint(res.e),
                bigintConversion.hexToBigint(res.n)
              );

              //Privada
               this.keyPair2Priv = new RsaPrivateKey(
                bigintConversion.hexToBigint(res.e),
                bigintConversion.hexToBigint(res.n)
              );


                //cifrar publica
              console.log('keypair2', this.keyPair2);
              const mensajecifrado2: bigint = await this.keyPair2.encrypt(
                bigintConversion.textToBigint(this.mensaje)
              );


                //Hash del mensaje
                const hash: string = await sha.digest(this.mensajeVerif)



                //cifrar privada
                console.log('keypair2priv', this.keyPair2Priv);
                const mensajecifrado2Priv: bigint = await this.keyPair2Priv.sign(
                  bigintConversion.textToBigint(this.hash)
                );



              console.log('mensaje cifrado', mensajecifrado2);

              console.log('hash cifrado con la priv', hash);


              const mensajeCifradoHex = bigintConversion.bigintToHex(mensajecifrado2);

              const mensajeCifradoHexPriv = bigintConversion.bigintToHex(mensajecifrado2Priv);


              console.log('mensaje mensajeCifradoHex', mensajeCifradoHex);

              console.log('mensaje mensajeCifradoHexPriv', mensajecifrado2Priv);


              //let dataEnviar = { msg: mensajeCifradoHex };


              let dataEnviar = { msg: mensajecifrado2Priv };

              this.cifrarRSA.enviarMensajeRSA(dataEnviar).subscribe(async (res) => {
                console.log('mensaje descifrado es:', res);
              }),
                (err) => {
                  console.log('error');
                  Swal.fire('Error en la envio del mensaje', '', 'error');
                };
            },
            (err) => {
              console.log('error');
              Swal.fire('Error en la recogida de la clave publica', '', 'error');
            }
          );
        }






        async firmaCiega(): Promise<void> {
          if (this.voto === undefined || this.voto === '') {
            this.errorMensaje = true;

            return;
          }

          this.errorMensaje = false;

          this.cifrarRSA.getClave2().subscribe(
            async (res) => {

              const votoCifrado: bigint = await this.claveRSApubServ.encrypt(
                bigintConversion.textToBigint(this.voto)
              );

              console.log('votoCifrado', votoCifrado);

              const votoCifradoCegado: bigint =  await this.cegador.cegar((votoCifrado));

              const votoCifradoCegadoHex = bigintConversion.bigintToHex(votoCifradoCegado);
              let dataEnviar = { msg: votoCifradoCegadoHex };

              this.cifrarRSA.firmarRSAServ(dataEnviar).subscribe(async (res) => {
                console.log('mensaje firmado por el servidor es:', res);

                const mensajeDescegadoFirma: bigint = await this.cegador.descegar(bigintConversion.hexToBigint(res['msg']));

                let votoCifradoVerificado = this.claveRSApubServ.verify(mensajeDescegadoFirma)
                console.log("publicServ", this.claveRSApubServ)
                console.log("voto verificado", votoCifradoVerificado)
                console.log("votocifrado", votoCifrado)

                if(votoCifrado === votoCifradoVerificado){
                    console.log("si, verificado")

                    const votoCifradoHex = bigintConversion.bigintToHex(votoCifrado);
                    const mensajeDescegadoFirmaHex = bigintConversion.bigintToHex(mensajeDescegadoFirma);

                    let dataEnviarVoto = { voto: votoCifradoHex, firma: mensajeDescegadoFirmaHex };


                    this.cifrarRSA.votarRSA(dataEnviarVoto).subscribe(async (res) => {
                        console.log(res)

                    }),
                      (err) => {
                        console.log('error');
                        Swal.fire('Error en la envio del mensaje', '', 'error');
                      };


                }else{
                  console.log("no, no verificado")
                }
              }),
                (err) => {
                  console.log('error');
                  Swal.fire('Error en la envio del mensaje', '', 'error');
                };
            },
            (err) => {
              console.log('error');
              Swal.fire('Error en la recogida de la clave publica', '', 'error');
            }
          );
        }
















}

