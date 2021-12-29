import * as bcu from 'bigint-crypto-utils';

export class RsaPrivateKey {
    d: bigint
    n: bigint

    constructor (d: bigint, n: bigint) {
        this.d = d
        this.n = n
    }

    decrypt (c: bigint): bigint {
        return bcu.modPow(c, this.d, this.n)
    }

    sign (m: bigint): bigint {
        return bcu.modPow(m, this.d, this.n)
    }
}

export class RsaPublicKey {
    e: bigint
    n: bigint

    constructor (e: bigint, n: bigint) {
        this.e = e
        this.n = n
    }

    encrypt (m: bigint): bigint {
        return bcu.modPow(m, this.e, this.n)
    }

    verify (s: bigint): bigint {
        return bcu.modPow(s, this.e, this.n)
    }
}


export interface rsaKeyPair {
    publicKey: RsaPublicKey
    privateKey: RsaPrivateKey
}

export const generateKeys = async function (bitLength: number): Promise<rsaKeyPair> {
    const e = 65537n
    let p: bigint, q: bigint, n: bigint, phi: bigint
    do {
        p = await bcu.prime(bitLength / 2 + 1)
        q = await bcu.prime(bitLength / 2)
        n = p * q
        phi = (p - 1n) * (q - 1n)
    } while (bcu.bitLength(n) !== bitLength || (phi % e === 0n))

    const publicKey = new RsaPublicKey(e, n)

    const d = bcu.modInv(e, phi)

    const privKey = new RsaPrivateKey(d, n)

    return {
        publicKey,
        privateKey: privKey
    }

}

export  class Cegador {
  r: bigint;
  pubKey: RsaPublicKey;


  constructor(pubKey: RsaPublicKey) {
      this.pubKey = pubKey;
      this.r = bcu.randBetween(this.pubKey.n);
  }

  cegar (msg: bigint): bigint {
      const bm: bigint = ( msg * (this.pubKey.encrypt(this.r) as bigint) ) % this.pubKey.n;
      return bm;
  }

  descegar (blindedSignature: bigint): bigint {
      //return (blindedSignature * bcu.modInv(this.r, this.pubKey.n));
      return (blindedSignature * bcu.modInv(this.r, this.pubKey.n) % this.pubKey.n);
  }
}