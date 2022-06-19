const { Router } = require("express");

const { getCategorias, getCategoriaById, getCategoriaByName, putUpdateCat, deleteCat, postCreateCat } = require('../controllers/categoria-controller')
const { getProductos, getProductosById, postCreateProducto,putUpdateProducto, deleteProducto, getProductosByName} = require("../controllers/productos-controller");
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

module.exports = router