const { Router } = require("express");

const { getCatByEstado, putUpdateCatbyId, deleteCat, createCat } = require('../controllers/categoria-controller')
const { getProductos, getProductosById, postCreateProducto,putUpdateProducto, deleteProducto, getProductosByName} = require("../controllers/productos-controller");
const router= Router()

router.get('/productos',getProductos)
router.get('/productos/id/:pro_id',getProductosById)
router.get('/productos/nombre/:pro_nombre',getProductosByName)
router.post('/productos/',postCreateProducto)
router.put("/productos/",putUpdateProducto)
router.put('/productos/delete/',deleteProducto)

router.get('/getCat', getCatByEstado)
router.put('/updateCat', putUpdateCatbyId)
router.put('/deleteCat', deleteCat)
router.post('/createCat', createCat)

module.exports = router