const { Router } = require("express");

const{ getAjusteProducto }=require('../controllers/inventario-controller')
const router= Router()

router.get("/detalleAjuste",getAjusteProducto)

module.exports=router