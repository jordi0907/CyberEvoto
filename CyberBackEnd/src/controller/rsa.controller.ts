import { Request, Response } from "express";
import Persona, { IPersona } from "../models/persona";
import Voto, {IVoto} from "../models/voto"

import * as bigintConversion from "bigint-conversion";
import * as rsa from "../models/rsa";

//let keyRSA: rsa.rsaKeyPair;
const bigint1 = 1234567890123456789012345678901234567890n;
let mensaje = "hola que tal, como estas";
let keyPair: rsa.rsaKeyPair;
const bc = require("bigint-conversion");

/* // coger clave publica
export const getPublica = async (req: Request, res: Response) => {
  try {
    console.log("dentro")
    console.log(keyRSA, "keyrsa")
    if (keyRSA === undefined) {
      console.log("dentro undefined")
      //keyRSA = await rsa.generateKeys(2048);
  
      //console.log(keyRSA, "keyRSA")
     return res.json({
      eHex: bigintConversion.bigintToHex((await rsa.generateKeys(2048)).publicKey.e),
      nHex: bigintConversion.bigintToHex((await rsa.generateKeys(2048)).publicKey.n)
    })
      }
    }
   catch (err) {
    res.status(400).json({
      ok: false,
      error: err,
    });
  }
}; */



export async function rsaInit(){ 
  console.log("Generando claves RSA")
 
  keyPair = await rsa.generateKeys(2048);
 
  console.log("Publica: ", keyPair.publicKey);

}


// coger clave publica
export async function getPublicKeyRSA(req: Request, res: Response) {
  //keyPair = await rsa.generateKeys(2048);
  console.log("keyRSA", keyPair.publicKey)
  try {
     let data = {
      e: await bc.bigintToHex(keyPair.publicKey.e),
      n: await bc.bigintToHex(keyPair.publicKey.n),
    }; 
    // let data2 = await bc.bigintToHex(keyPair.publicKey)
    // console.log("data2", data2)
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}

//Descifrar

export async function descifrarRSA(req: Request, res: Response) {
  let mensaje = req.body.msg;
  console.log("mensaje para descifrar", mensaje)
  try {
    const mensajeDescifrado: bigint = await keyPair.privateKey.decrypt(bigintConversion.hexToBigint(mensaje));
    const mensajeFinal: string = bigintConversion.bigintToText(mensajeDescifrado)
    console.log("mensaje descifrado", mensajeFinal)
    let data = {msg: mensajeFinal }
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}

export async function cifrarRSA(req: Request, res: Response) {
  let mensaje = req.body.msg;
  console.log("keyRSA", keyPair.publicKey)
  try {
    const mensajecifrado: bigint = await keyPair.publicKey.encrypt(bigintConversion.textToBigint(mensaje))
    res.status(200).send(bigintConversion.bigintToHex(mensajecifrado));
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}




export async function signRSA(req: Request, res: Response) {
  let mensaje = req.body.msg;
  try {
    const mensajecifrado: bigint = await keyPair.privateKey.sign(bigintConversion.hexToBigint(mensaje))
    res.status(200).json({msg : bigintConversion.bigintToHex(mensajecifrado)});
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}


export async function votarRSA(req: Request, res: Response) {
  let votoCifrado = req.body.voto;
  let firma = req.body.firma;
  try {
    const firmaVerif: bigint = await keyPair.publicKey.verify(bigintConversion.hexToBigint(firma))
    const votoCifradoBigInt: bigint = await (bigintConversion.hexToBigint(votoCifrado))
    if(firmaVerif===votoCifradoBigInt){
      console.log("Verificado el voto")
      let votoDescifrado: bigint = await keyPair.privateKey.decrypt((votoCifradoBigInt))
      let votoDescifradoText = await (bigintConversion.bigintToText(votoDescifrado))
      console.log("el voto ha sido," , votoDescifradoText)
      res.status(200).json({msg : "voto añadido"});
      const savedResultado = await Voto.create({"voto": votoDescifradoText});
    }else{
      res.status(200).json({msg : "error en el voto añadido"});
    }
   
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}