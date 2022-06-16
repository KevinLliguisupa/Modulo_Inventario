const req = require('express/lib/request')
const { db } = require('../config/connection')

const getProductos = async (req,res)=>{
    const response = await db.any(`select pro_id,pro_nombre,pro_descripcion, 
    pro_iva,pro_costo,pro_pvp,pro_stock,pro_imagen,pro_estado from producto;`)
    res.json(response)
}

const getProductosById=async(req,res)=>{
    const pro_id=req.params.pro_id
    const response = await db.any(`select pro_id,pro_nombre,pro_descripcion, 
    pro_iva,pro_costo,pro_pvp,pro_stock,pro_imagen,pro_estado from producto where pro_id=$1::int;`,[pro_id])
    res.json(response)
}


const getProductosByName=async(req,res)=>{
    const pro_nombre=req.params.pro_nombre
    const response = await db.any(`select pro_id,pro_nombre,pro_descripcion, 
    pro_iva,pro_costo,pro_pvp,pro_stock,pro_imagen,pro_estado from producto where pro_nombre=$1`,[pro_nombre])
    res.json(response)
}

const postCreateProducto = async(req, res) =>{
    const {pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado} = req.query
    const response = await db.any(`INSERT INTO public.producto(pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,[pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado])
    res.json(
        {
            message: "Producto creado con éxito",
            body:{
                producto: {pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado}
            }
        }
    )
}

// const createProducto=async(req,res)=>{
//     const{pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado}=req.query
//     const response = await db.one(`INSERT INTO producto(
//         pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado))
//         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9 ) returning*;`,[pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_stock, pro_imagen, pro_estado])
//         res.json(response)
// }

const putUpdateProducto = async(req, res) =>{
    const {pro_id,pro_nombre,pro_descripcion,cat_id,
        pro_iva,pro_costo,pro_pvp,pro_stock,pro_imagen,pro_estado} = req.query
    const response = await db.any('UPDATE producto SET pro_nombre=$2, pro_descripcion=$3, cat_id=$4, pro_iva=$5, pro_costo=$6, pro_pvp=$7, pro_stock=$8, pro_imagen=$9, pro_estado=$10 WHERE pro_id=$1',[pro_id,pro_nombre,pro_descripcion,cat_id,
        pro_iva,pro_costo,pro_pvp,pro_stock,pro_imagen,pro_estado])
    res.json(
        {
            message: "Producto actualizado con éxito",
            body:{
                producto: {pro_id,pro_nombre,pro_descripcion,cat_id,
                    pro_iva,pro_costo,pro_pvp,pro_stock,pro_imagen,pro_estado}
            }
        }
    )
}

const deleteProducto = async(req, res) =>{
    const {pro_id} = req.query
    const response = await db.any('DELETE FROM producto WHERE pro_id=$1',[pro_id])
    res.json(
        {
            message: "Producto eliminado con éxito",
            body:{
                producto: {pro_id}
            }
        }
    )
}

module.exports = {
    getProductos,getProductosById,
    getProductosByName,postCreateProducto,
    putUpdateProducto,deleteProducto
}