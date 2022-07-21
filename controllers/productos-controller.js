const { json } = require('express');
const req = require('express/lib/request');
const { db } = require('../config/connection')
const fetch = require('node-fetch');

/**
 * Calcula el stock de los ajustes realizados a un producto mediante su id
 * @returns Json con calculo del stock
 */
function ajustesStock() {
    try {
        return new Promise(resolve => {
            const ajuste_stock = db.any(`select pro.pro_id, sum(ad.aju_det_cantidad) from producto pro, 
                                ajuste_detalle ad, ajuste aj where pro.pro_id=ad.pro_id and ad.aju_numero=aj.aju_numero 
                                and aj.aju_estado=true GROUP BY pro.pro_id ORDER BY pro.pro_id;`)
            resolve(ajuste_stock)
        });
    } catch (error) {
        console.log(error);
    }
}

/**
 * Mediante el api del modulo facturas calcula el stock de las facturas 
 * pertenecientes a un producto 
 * @returns Suma del stock 
 */
const facturasStock = async () => {
    try {
        let stocks = {}

        const respuesta = await fetch('https://api-facturacion-utn.herokuapp.com/facturas/search');
        const datos = await respuesta.json()
        for (let i = 0; i < datos.length; i++) {
            for (let j = 0; j < datos[i].detalle.length; j++) {

                let id = datos[i].detalle[j].prod_id
                let cantidad = datos[i].detalle[j].cantidad

                if (id in stocks) {
                    stocks[id] += cantidad;
                } else {
                    stocks[id] = cantidad
                }

            }
        }
        return stocks
    } catch (error) {
        console.log(error);
        return {}
    }
}


/**
 * Mediante el api del modulo facturas calcula el stock de las facturas 
 * pertenecientes a un producto 
 * @returns Suma del stock 
 */
const comprasStock = async () => {
    try {
        let stocks = {}

        const respuesta = await fetch('https://modelo-223.herokuapp.com/detalle_compras');
        const datos = await respuesta.json()
        for (let i = 0; i < datos.length; i++) {

            let id = datos[i].prod_id
            let cantidad = datos[i].dcom_cantidad

            if (id in stocks) {
                stocks[id] += cantidad;
            } else {
                stocks[id] = cantidad
            }

        }
        return stocks
    } catch (error) {
        console.log(error);
        return {}
    }
}


const getAllProductos = async (req, res) => {
    try {
        const facturas_stock = await facturasStock()
        const compras_stock = await comprasStock()
        const ajuste_stock = await ajustesStock()

        let response = []
        const productos = await db.any(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen, pro_estado
            from producto ORDER BY pro_id;`)
        for (let i = 0; i < productos.length; i++) {
            const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
                where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [productos[i].pro_id])

            //calculo de stock
            let total = 0
            if (ajuste_stock != undefined) {
                for (let cont = 0; cont < ajuste_stock.length; cont++) {
                    const stock = ajuste_stock[cont];
                    if (stock.pro_id == productos[i].pro_id) {
                        total += parseInt(stock.sum)
                        break
                    }
                }
            }

            if (facturas_stock != undefined) {
                if (productos[i].pro_id in facturas_stock) {
                    total -= facturas_stock[productos[i].pro_id]
                }
            }

            if (compras_stock != undefined) {
                if (productos[i].pro_id in compras_stock) {
                    total += compras_stock[productos[i].pro_id]
                }
            }

            productos[i].pro_stock = total
            productos[i].pro_categoria = categoria
            response.push(productos[i])
        }
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getProductos = async (req, res) => {
    try {
        const facturas_stock = await facturasStock()
        const compras_stock = await comprasStock()
        const ajuste_stock = await ajustesStock()


        let response = []
        const productos = await db.any(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen 
            from producto where pro_estado=true ORDER BY pro_id;`)
        for (let i = 0; i < productos.length; i++) {
            const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
                where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [productos[i].pro_id])

            //calculo de stock
            let total = 0
            if (ajuste_stock != undefined) {
                for (let cont = 0; cont < ajuste_stock.length; cont++) {
                    const stock = ajuste_stock[cont];
                    if (stock.pro_id == productos[i].pro_id) {
                        total += parseInt(stock.sum)
                        break
                    }
                }
            }

            if (facturas_stock != undefined) {
                if (productos[i].pro_id in facturas_stock) {
                    total -= facturas_stock[productos[i].pro_id]
                }
            }

            if (compras_stock != undefined) {
                if (productos[i].pro_id in compras_stock) {
                    total += compras_stock[productos[i].pro_id]
                }
            }

            productos[i].pro_stock = total
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
        const facturas_stock = await facturasStock()
        const compras_stock = await comprasStock()
        const ajuste_stock = await ajustesStock()

        const pro_id = req.params.pro_id
        const response = await db.one(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen 
            from producto where pro_id=$1;`, [pro_id])
        const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
            where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [pro_id])

        //calculo de stock
        let total = 0
        if (ajuste_stock != undefined) {
            for (let cont = 0; cont < ajuste_stock.length; cont++) {
                const stock = ajuste_stock[cont];
                if (stock.pro_id == response.pro_id) {
                    total += parseInt(stock.sum)
                    break
                }
            }
        }

        if (facturas_stock != undefined) {
            if (response.pro_id in facturas_stock) {
                total -= facturas_stock[response.pro_id]
            }
        }

        if (compras_stock != undefined) {
            if (response.pro_id in compras_stock) {
                total += compras_stock[response.pro_id]
            }
        }

        response.pro_stock = total
        response.pro_categoria = categoria
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getProductosByName = async (req, res) => {
    try {
        const facturas_stock = await facturasStock()
        const compras_stock = await comprasStock()
        const ajuste_stock = await ajustesStock()

        const pro_nombre = req.params.pro_nombre
        const response = await db.one(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, pro_imagen 
            from producto where pro_nombre=$1 and pro_estado=true`, [pro_nombre])
        const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
            where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [response.pro_id])

        //calculo de stock
        let total = 0
        if (ajuste_stock != undefined) {
            for (let cont = 0; cont < ajuste_stock.length; cont++) {
                const stock = ajuste_stock[cont];
                if (stock.pro_id == response.pro_id) {
                    total += parseInt(stock.sum)
                    break
                }
            }
        }

        if (facturas_stock != undefined) {
            if (response.pro_id in facturas_stock) {
                total -= facturas_stock[response.pro_id]
            }
        }

        if (compras_stock != undefined) {
            if (response.pro_id in compras_stock) {
                total += compras_stock[response.pro_id]
            }
        }

        response.pro_stock = total
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

const activateProducto = async (req, res) => {
    try {
        const { pro_id } = req.body
        const response = await db.one('UPDATE producto SET pro_estado=true WHERE pro_id=$1 RETURNING*;', [pro_id])
        res.json(
            {
                message: "Producto activado con éxito",
                response
            }
        )
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

module.exports = {
    getAllProductos,
    getProductos,
    getProductosById,
    getProductosByName,
    postCreateProducto,
    putUpdateProducto,
    deleteProducto,
    activateProducto
}