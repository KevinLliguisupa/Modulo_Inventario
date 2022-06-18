const req = require('express/lib/request')
const { db } = require('../config/connection')

const getProductos = async (req, res) => {
    try {
        let response = []
        const productos = await db.any(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen 
            from producto where pro_estado=true ORDER BY pro_id;`)
        for (let i = 0; i < productos.length; i++) {
            const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
                where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [productos[i].pro_id])
            productos[i].pro_categoria = categoria
            response.push(productos[i])
        }
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getProductosById = async (req, res) => {
    try {
        const pro_id = req.params.pro_id
        const response = await db.one(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen 
            from producto where pro_id=$1 and pro_estado=true;`, [pro_id])
        const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
            where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [pro_id])
        response.pro_categoria = categoria
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getProductosByName = async (req, res) => {
    try {
        const pro_nombre = req.params.pro_nombre
        const response = await db.one(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen 
            from producto where pro_nombre=$1 and pro_estado=true`, [pro_nombre])
        const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
            where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [response.pro_id])
        response.pro_categoria = categoria
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const postCreateProducto = async (req, res) => {
    try {
        const { pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen } = req.body
        const response = await db.one(`INSERT INTO public.producto(pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, 
            pro_pvp, pro_imagen, pro_estado) VALUES ($1,$2,$3,$4,$5,$6,$7,true) RETURNING*;`,
            [pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen])
        res.json(
            {
                message: "Producto creado con éxito",
                response
            }
        )
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }

}

const putUpdateProducto = async (req, res) => {
    try {
        const { pro_id, pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen } = req.body
        const response = await db.one(`UPDATE producto SET pro_nombre=$2, pro_descripcion=$3, cat_id=$4, pro_iva=$5, 
        pro_costo=$6, pro_pvp=$7, pro_imagen=$8 WHERE pro_id=$1 RETURNING*`,
            [pro_id, pro_nombre, pro_descripcion, cat_id, pro_iva, pro_costo, pro_pvp, pro_imagen])
        res.json(
            {
                message: "Producto actualizado con éxito",
                response
            }
        )
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const deleteProducto = async (req, res) => {
    try {
        const { pro_id } = req.body
        const response = await db.one('UPDATE producto SET pro_estado=false WHERE pro_id=$1 RETURNING*;', [pro_id])
        res.json(
            {
                message: "Producto eliminado con éxito",
                response
            }
        )
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

module.exports = {
    getProductos, 
    getProductosById,
    getProductosByName, 
    postCreateProducto,
    putUpdateProducto, 
    deleteProducto
}