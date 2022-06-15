const { Router } = require("express");

const{ postCreateAjuste, postCreateAjustecompleto, postCreateAjusteDetalle, getAjusteId }=require('../controllers/ajustes-controller')
const router= Router()

router.get("/ajustes/id",getAjusteId)
router.post("/ajustes/",postCreateAjuste)
router.post("/ajustes/detalle",postCreateAjusteDetalle)
router.post("/ajustes/completo/",postCreateAjustecompleto)

module.exports=router