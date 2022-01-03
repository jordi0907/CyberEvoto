import { Request, Response } from "express";
import Persona, { IPersona } from "../models/persona";
import Voto, {IVoto} from "../models/voto"
import jwt from "jsonwebtoken";
import config from "../config/config";

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

function createToken(user: IPersona) {
  return jwt.sign({ id: user.id, nombre: user.nombre, DNI: user.DNI }, config.jwtSecret, {
      expiresIn: 86400
  });
}

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
  console.log("req", req.body);
  try {
    const mensajecifrado: bigint = await keyPair.privateKey.sign(bigintConversion.hexToBigint(mensaje))
    const censadoAct = await Persona.findByIdAndUpdate(req.body._id, {$set: {"censado": "true"}},{new:true});; 
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



export async function signIn(req: Request, res: Response) {
  try {
    if (!req.body.nombre || !req.body.password) {
      return res
          .status(400)
          .json({ msg: "Please. Envia tu nombre y password" });
  }

  const user = await Persona.findOne({ nombre: req.body.nombre, password: req.body.password, DNI: req.body.DNI });
  if (!user) {
      return res.status(400).json({ msg: "El email o el password son incorrectos" });
  }

  return res.status(200).json({ token: createToken(user) });
 //return res.status(200).json({ mensaje:"logoneado" });

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}



export async function registrar(req: Request, res: Response) {
  try {
    if (!req.body.nombre || !req.body.password) {
      return res
          .status(400)
          .json({ msg: "Please. Envia tu nombre y password" });
  }

  const user = await Persona.findOne({ nombre: req.body.nombre, password: req.body.password, DNI: req.body.DNI });
  if (user) {
      return res.status(400).json({ msg: "Ya estas registrado" });
  }

 // return res.status(200).json({ token: createToken(user) });
 const savedResultado = await Persona.create({"nombre": req.body.nombre, "DNI": req.body.DNI, "password": req.body.password });
 return res.status(200).json({ mensaje:"logoneado" });

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}


export async function recuento(req: Request, res: Response) {
  try {

  const userJordi = await Voto.find({voto: "Jordi"});
  if (!userJordi) {
      return res.status(400).json({ msg: "No hay ningun voto" });
  }
  console.log("usuarios", userJordi);

  const userMarc = await Voto.find({voto: "Marc"});
  if (!userJordi) {
      return res.status(400).json({ msg: "No hay ningun voto" });
  }
  console.log("usuarios", userJordi);

  const userCarlos = await Voto.find({voto: "Carlos"});
  if (!userJordi) {
      return res.status(400).json({ msg: "No hay ningun voto" });
  }
  console.log("usuarios", userJordi);



 
 return res.status(200).json({ numeroJordi: userJordi.length, numeroMarc: userMarc.length, numeroCarlos: userCarlos.length});

  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
}