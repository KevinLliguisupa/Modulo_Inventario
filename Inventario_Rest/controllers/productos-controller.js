const req = require('express/lib/request')
const { db } = require('../config/connection')

const getProductos = async (req,res)=>{
    const response = await db.any(`select * from producto where pro_estado=true;`)
    res.json(response)
}

const getProductosById=async(req,res)=>{
    const pro_id=req.params.pro_id
    const response = await db.any(`select * from producto where
     pro_id=$1 and pro_estado=true;`,[pro_id])
    res.json(response)
}


const getProductosByName=async(req,res)=>{
    const pro_nombre=req.params.pro_nombre
    const response = await db.any(`select * from producto where
     pro_nombre=$1 and pro_estado=true`,[pro_nombre])
    res.json(response)
}

const postCreateProducto = async(req, res) =>{
    const {pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado} = req.query
    const response = await db.any(`INSERT INTO public.producto(pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8);`,[pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado])
    res.json(
        {
            message: "Producto creado con éxito",
            body:{
                producto: {pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado}
            }
        }
    )
}

const putUpdateProducto = async(req, res) =>{
    const {pro_id,pro_nombre,pro_descripcion,cat_id,
        pro_iva,pro_costo,pro_pvp,pro_imagen,pro_estado} = req.query
    const response = await db.any(`UPDATE producto SET pro_nombre=$2, pro_descripcion=$3, cat_id=$4, pro_iva=$5,
     pro_costo=$6, pro_pvp=$7, pro_imagen=$8, pro_estado=$9
      WHERE pro_id=$1`,[pro_id,pro_nombre,pro_descripcion,cat_id,
        pro_iva,pro_costo,pro_pvp,pro_imagen,pro_estado])
    res.json(
        {
            message: "Producto actualizado con éxito",
            body:{
                producto: {pro_id,pro_nombre,pro_descripcion,cat_id,
                    pro_iva,pro_costo,pro_pvp,pro_imagen,pro_estado}
            }
        }
    )
}

const deleteProducto = async(req, res) =>{
    const {pro_id} = req.query
    const response = await db.any('UPDATE producto SET pro_estado=false WHERE pro_id=$1',[pro_id])
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