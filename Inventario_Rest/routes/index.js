const { Router } = require("express");

const { getCategorias, getCategoriaById, getCategoriaByName, putUpdateCat, deleteCat, postCreateCat } = require('../controllers/categoria-controller')
const { getProductos, getProductosById, postCreateProducto,putUpdateProducto, deleteProducto, getProductosByName} = require("../controllers/productos-controller");
const{ getAjustes, putUpdateAjuste, getAjustesByProd, postCreateAjuste, postCreateAjustecompleto, postCreateAjusteDetalle, getAjusteNumero, getAjustesByProdId, getAjusteByNum }=require('../controllers/ajustes-controller')
const router= Router()

router.get('/productos',getProductos)
router.get('/productos/id/:pro_id',getProductosById)
router.get('/productos/nombre/:pro_nombre',getProductosByName)
router.post('/productos/',postCreateProducto)
router.put("/productos/",putUpdateProducto)
router.put('/productos/delete/',deleteProducto)

router.get('/categorias', getCategorias)
router.get('/categorias/id/:cat_id', getCategoriaById)
router.get('/categorias/nombre/:cat_nombre', getCategoriaByName)
router.post('/categorias/', postCreateCat)
router.put('/categorias/', putUpdateCat)
router.put('/categorias/delete/', deleteCat)

router.get("/ajustes",getAjustes)
router.get("/ajustes/numero/",getAjusteNumero)
router.get("/ajustes/numero/:aju_numero",getAjusteByNum)
router.get("/ajustes/productos",getAjustesByProd)
router.get("/ajustes/productos/id/:pro_id",getAjustesByProdId)
router.post("/ajustes/",postCreateAjuste)
router.post("/ajustes/detalle",postCreateAjusteDetalle)
router.post("/ajustes/completo/",postCreateAjustecompleto)
router.put("/ajustes/",putUpdateAjuste)

module.exports = router