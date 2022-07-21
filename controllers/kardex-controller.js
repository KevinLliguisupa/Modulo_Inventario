const { db } = require('../config/connection')
const fetch = require('node-fetch');

/**
 * Calcula el stock de los ajustes realizados a un producto mediante su id
 * @returns Json con calculo del stock
 */
function AjustesByProd(pro_id) {
    try {
        return new Promise(resolve => {
            const ajuste_stock = db.any(`SELECT 'Ajuste' as tipo, aj.aju_numero as id, aj.aju_fecha as fecha, 
                aj.aju_descripcion as descipcion, ad.aju_det_cantidad as cantidad FROM ajuste aj, ajuste_detalle ad 
                WHERE aj.aju_numero=ad.aju_numero AND aju_det_estado=true AND aju_estado=true AND ad.pro_id=$1;`, [pro_id])
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
const facturasByProd = async (pro_id) => {
    try {
        let registros = []

        const respuesta = await fetch('https://api-facturacion-utn.herokuapp.com/facturas/search');
        const datos = await respuesta.json()
        for (let i = 0; i < datos.length; i++) {
            const factura = datos[i];
            for (let j = 0; j < factura.detalle.length; j++) {

                let detalle = factura.detalle[j]
                if (detalle.prod_id == pro_id) {
                    registros.push({
                        tipo: 'Venta',
                        id: factura.nro_factura,
                        fecha: factura.fecha,
                        descipcion: 'FACT.COMP ' + factura.nro_factura,
                        cantidad: detalle.cantidad
                    })
                }

            }
        }
        return registros
    } catch (error) {
        console.log(error);
    }
}

/**
 * Mediante el api del modulo compras busca facturas de compra
 * pertenecientes a un producto 
 * @returns Suma del stock 
 */
const comprasByProd = async (pro_id) => {
    const consulta = await fetch('https://modelo-223.herokuapp.com/fac_compras');
    const facturas = await consulta.json()
    try {
        let registros = []

        const respuesta = await fetch('https://modelo-223.herokuapp.com/detalle_compras');
        const datos = await respuesta.json()
        for (let i = 0; i < datos.length; i++) {
            const detalle = datos[i]

            if (detalle.prod_id == pro_id) {
                for (let j = 0; j < facturas.length; j++) {
                    const factura = facturas[j];
                    if (detalle.fcom_id == factura.fcom_id) {
                        registros.push({
                            tipo: 'Compra',
                            id: factura.fcom_id,
                            fecha: factura.fcom_fecha,
                            descipcion: 'FACT.VENT ' + factura.fcom_id,
                            cantidad: detalle.dcom_cantidad
                        })
                        break
                    }
                }
            }

        }
        return registros
    } catch (error) {
        console.log(error);
    }
}

const getKardexById = async (req, res) => {
    try {
        const pro_id = req.params.pro_id
        //Consulta informacion del producto 
        const response = await db.one(`select pro_id, pro_nombre, pro_descripcion, pro_iva, pro_costo, pro_pvp, 
        pro_imagen, pro_estado from producto where pro_id=$1;`, [pro_id])
        const categoria = await db.one(`select cat.cat_id, cat.cat_nombre from categoria cat, producto pro 
            where pro.cat_id=cat.cat_id and pro.pro_id=$1;`, [pro_id])

        //Consultamos los movimientos del producto
        const ajustes = await AjustesByProd(pro_id)
        const facturas = await facturasByProd(pro_id)
        const compras = await comprasByProd(pro_id)

        let movimientos = []

        //unimos todos los movimientos existentes
        if (ajustes != undefined) {
            movimientos = movimientos.concat(ajustes)
        }
        if (facturas != undefined) {
            movimientos = movimientos.concat(facturas)
        }
        if (compras != undefined) {
            movimientos = movimientos.concat(compras)
        }

        //Ordenamos los movimientos por fecha
        let movOrdenado = []
        let stock=0
        const longitud=movimientos.length
        for (let index = 0; index < longitud; index++) {
            let menor = movimientos[0]
            for (let i = 0; i < movimientos.length; i++) {
                const movimiento = movimientos[i];
                if (new Date(movimiento.fecha) < new Date(menor.fecha)) {
                    menor = movimiento
                }
            }

            if (menor.tipo=='Venta') {
                stock-=parseInt(menor.cantidad)
            }else{
                stock+=parseInt(menor.cantidad)
            }
            menor.stock=stock
            movOrdenado.push(menor)
            movimientos.splice(movimientos.indexOf(menor),1)
        }
        //Asignamos los movimientos, el stock y categoria al producto
        response.pro_categoria = categoria.cat_nombre
        response.pro_stock=stock
        response.movimientos=movOrdenado.reverse()
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

module.exports = {
    getKardexById
}