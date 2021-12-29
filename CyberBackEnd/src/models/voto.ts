import { model, Schema, Document } from 'mongoose';


export interface IVoto extends Document{
  voto: string;
  
}

const votoSchema = new Schema({
  voto: {
      type: String
  }
});


export default model<IVoto>('Voto', votoSchema);