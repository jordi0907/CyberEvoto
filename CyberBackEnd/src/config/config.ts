//configuraciones para no hardcodear

export default {
  /* jwtSecret: process.env.JWT_SECRET || 'somesecrettoken', */
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost/cyberseguridad',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
      }
}