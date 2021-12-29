import { model, Schema, Document } from 'mongoose';


export interface IPersona extends Document{
  nombre: string;
  DNI: string;
  password: string;
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
  }
});


export default model<IPersona>('Persona', personaSchema);