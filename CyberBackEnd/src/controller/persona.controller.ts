import {Request, Response} from 'express';
import Persona, { IPersona } from '../models/persona';

// Todas las personas
export const getPersonas = async ( req:Request, res:Response )=>{
  try{
      const resultados = await Persona.find({});
      if (resultados == null){
          console.log("resultados", resultados)
           return res.status(404).json({message: "Resultados not found"});
      }
      else return res.status(200).json(resultados);

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}


export const newPersona= async (req:Request, res:Response) => {
  try{const resultado: IPersona = new Persona({
               "nombre": req.body.nombre,
               "apellidos": req.body.apellidos,
               "fechanacimiento": req.body.fechanacimiento,
               "fechavacunado": req.body.fechavacunado,
               "profesion": req.body.profesion,
               "vacuna": req.body.vacuna
           });
  const savedResultado = await resultado.save();
  res.status(200).json({
      ok: true,
      resultado: savedResultado
  })
  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}



export const updatePersona = async (req:Request, res:Response) => {
  try{
  const nombre: string = req.body.nombre;
  const apellidos: string = req.body.apellidos;
  const fechanacimiento: string = req.body.fechanacimiento;
  const fechavacunado: string = req.body.fechavacunado;
  const profesion: string = req.body.profesion;
  const vacuna: string = req.body.vacuna;

  const copiaUpdate = await Persona.findByIdAndUpdate(req.params.id, {$set: {"nombre": nombre, "apellidos": apellidos, "fechanacimiento": fechanacimiento, "fechavacunado": fechavacunado, "profesion": profesion, "vacuna": vacuna }},{new:true});;
      console .log("data", copiaUpdate)
      res.status(200).json(copiaUpdate);
}catch(err){
  
  res.status(400).json({
      ok: false,
      error: err
  })
}
}


export const getPersona =  async(req:Request, res:Response)=> {
  try{
  const resultadoPersona = await Persona.findById(req.params.id)
      let status: number = 200;
      if(resultadoPersona==null) status = 404;
      console.log(resultadoPersona);
      return res.status(status).json(resultadoPersona);

  }catch(err){
      res.status(400).json({
          ok: false,
          error: err
      })
  }
}



