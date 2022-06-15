const { Router } = require("express");

const{ getAjusteProducto, putUpdateAjuste, getProductoAjuste }=require('../controllers/inventario-controller')
const router= Router()

router.get("/detalleAjuste",getAjusteProducto)
router.put("/ajustes/",putUpdateAjuste)
router.get("/productos/ajustes",getProductoAjuste)

module.exports=router