const express = require('express')
const app= express()
//para reconocer html
const bodeParser = require('body-parser')
//Para conexion con front 
const cors = require('cors')

//midlewears
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Autentificacion cors
app.use(cors({ origin: true, credentials: true  }));

app.use(require('../routes/index'))
//execution server web
app.listen(4000)
console.log("Server running in http://localhost:4000")
app.get('/',(req,res)=>{res.send('Bienvenidos al servicio Rest-Api-Inventario')})