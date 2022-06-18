const { Router } = require("express");

const { getProductos, getProductosById, postCreateProducto,putUpdateProducto, deleteProducto, getProductosByName} = require("../controllers/productos-controller");
const router= Router()

router.get('/productos',getProductos)
router.get('/productos/pro_id/:pro_id',getProductosById)
router.get('/productos/pro_nombre/:pro_nombre',getProductosByName)
router.post('/productos/',postCreateProducto)
router.put("/productos",putUpdateProducto)
router.put('/deleteProducto',deleteProducto)

module.exports=router