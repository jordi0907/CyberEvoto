import { model, Schema, Document } from 'mongoose';


export interface IPersona extends Document{
  nombre: string;
  DNI: string;
  password: string;
  censado: string;
}

const personaSchema = new Schema({
  nombre: {
      type: String
  },
  DNI: {
      type: String
  },
  password: {
    type: String
  },
  censado:{
    type: String,
    default: false

  }
});


export default model<IPersona>('Persona', personaSchema);