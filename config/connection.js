const pgPromise = require('pg-promise')

//Conexion Local
//  const config={
//      host:'localhost',
//      port:'5432',
//      database:'inventario',
//      user:'postgres',
//      password:'postgres'
//  }

//Conexion Remota
const config={
   host:'biwqu8bbkmehia5eajvb-postgresql.services.clever-cloud.com',
   port:'5432',
   database:'biwqu8bbkmehia5eajvb',
   user:'utgzrd54khepinzamr0q',
   password:'tYbf9NiiyekWwYMaAsH9'
}

const pgp = pgPromise({})
const db = pgp(config)
exports.db=db
