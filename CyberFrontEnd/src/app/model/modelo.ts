export interface Mensaje {
  mensaje: string
}

export interface MensajeServidor {
  tipo: string
  cifrado: string
  iv: string
  clave?: string
}

export interface CifradoRSA {
  cifrado: CifradoAES
  clave: string
}

export interface CifradoAES {
  mensaje: Uint8Array
  iv: Uint8Array
}
