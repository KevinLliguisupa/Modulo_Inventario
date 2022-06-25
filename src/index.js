// const { db } = require("../config/connection");
// db.any('select * from "producto"').then(res=>{console.table(res)})

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
const PORT = process.env.PORT || 4000
app.listen(PORT)
app.get('/',(req,res)=>{res.send('Bienvenidos al API Modulo Inventario')})