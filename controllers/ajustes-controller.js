const { response } = require('express')
const req = require('express/lib/request')
const { db } = require('../config/connection')

const getAllAjustes = async (req, res) => {
    try {
        const ajustes = await db.any(`select * from ajuste order by aju_numero`);
        let response = [];
        for (let i = 0; i < ajustes.length; i++) {
            let detalleAjuste = await db.any(`select daj.* from ajuste aj, ajuste_detalle daj where aj.aju_numero=daj.aju_numero
             and daj.aju_det_estado=true and daj.aju_numero=$1`, [ajustes[i].aju_numero]);
            ajustes[i].aju_detalle = detalleAjuste
            response.push(ajustes[i])
        }
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getAjustes = async (req, res) => {
    try {
        const ajustes = await db.any(`select * from ajuste where aju_estado=true order by aju_numero`);
        let response = [];
        for (let i = 0; i < ajustes.length; i++) {
            let detalleAjuste = await db.any(`select daj.* from ajuste aj, ajuste_detalle daj where aj.aju_numero=daj.aju_numero and 
                aj.aju_estado=true and daj.aju_det_estado=true and daj.aju_numero=$1`, [ajustes[i].aju_numero]);
            ajustes[i].aju_detalle = detalleAjuste
            response.push(ajustes[i])
        }
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getAjusteByNum = async (req, res) => {
    try {
        const aju_numero = req.params.aju_numero
        const ajuste = await db.one(`select * from ajuste where aju_numero=$1 and aju_estado=true order by aju_numero`,[aju_numero]);
        let response = [];
            let detalleAjuste = await db.any(`select daj.* from ajuste aj, ajuste_detalle daj where aj.aju_numero=daj.aju_numero and 
                aj.aju_estado=true and daj.aju_det_estado=true and daj.aju_numero=$1`, [ajuste.aju_numero]);
            ajuste.aju_detalle = detalleAjuste
            response.push(ajuste)
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getAjustesByProd = async (req, res) => {
    try {
        const productos = await db.query(`select * from producto where pro_estado=true order by pro_id`);
        let response = [];
        for (let i = 0; i < productos.length; i++) {
            let detalleAjuste = await db.query(`select daj.* from producto pro, ajuste_detalle daj where pro.pro_id=daj.pro_id and 
                pro.pro_estado=true and daj.aju_det_estado=true and daj.pro_id=$1`, [productos[i].pro_id]);
            productos[i].pro_ajuste = detalleAjuste
            response.push(productos[i])
        }
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const getAjustesByProdId = async (req, res) => {
    try {
        const pro_id = req.params.pro_id
        const producto = await db.one(`select * from producto where  pro_id=$1 AND pro_estado=true`, [pro_id])
        let response = []
            let detalleAjuste = await db.query(`select daj.* from producto pro, ajuste_detalle daj where pro.pro_id=daj.pro_id and 
                pro.pro_estado=true and daj.aju_det_estado=true and daj.pro_id=$1`, [producto.pro_id])
            producto.pro_ajuste = detalleAjuste
            response.push(producto)
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

/**
 * Obtiene el numero de ajuste que esta disponible 
 * y que continua con la secuencia
 * @param {*} res numero de ajuste
 */
const getAjusteNumero = async (req, res) => {
    try {
        const response = await db.one(`select get_nroAjuste();`)
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

/**
 * Permite crear un ajuste (cabecera)
 * @param {*} req informacion de la cabecera del ajuste
 */
const postCreateAjuste = async (req, res) => {
    const { aju_fecha, aju_descripcion } = req.body
    try {
        const response = await db.one(`INSERT INTO public.ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)
        VALUES (get_nroAjuste(), $1, $2, true) returning*;`, [aju_fecha, aju_descripcion])
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

/**
 * Permite crear el detalle de un ajuste apartir de su id
 * @param {*} req Id del ajuste y un arreglo de detalles
 */
const postCreateAjusteDetalle = async (req, res) => {
    const { aju_numero, detalles } = req.body
    try {
        let detalle = []
        for (let i = 0; i < detalles.length; i++) {
            const response = await db.one(`INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, 
                aju_det_modificable, aju_det_estado) VALUES ($1, $2, $3, true, true) returning*;`,
                [aju_numero, detalles[i].pro_id, detalles[i].aju_det_cantidad])
            detalle.push(response)
        }
        res.json({ ajuste: aju_numero, aju_detalle: detalle })
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

/**
 * Crea un ajuste con su detalle a la vez
 * @param {*} req Informacion del ajuste y un arreglo con sus detalles
 */
const postCreateAjustecompleto = async (req, res) => {
    const { aju_fecha, aju_descripcion, detalles } = req.body
    try {
        //Insercion del ajuste
        const ajuste = await db.one(`INSERT INTO public.ajuste(aju_numero, aju_fecha, aju_descripcion, aju_estado)
        VALUES (get_nroAjuste(), $1, $2, true) returning*;`, [aju_fecha, aju_descripcion])

        //Insercion del detalle
        let detalle = []
        for (let i = 0; i < detalles.length; i++) {
            const response = await db.one(`INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, 
                aju_det_modificable, aju_det_estado) VALUES ($1, $2, $3, true, true) returning*;`,
                [ajuste.aju_numero, detalles[i].pro_id, detalles[i].aju_det_cantidad])
            detalle.push(response)
        }
        ajuste.aju_detalle = detalle
        res.json(ajuste)
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Valores incorrectos'
        })
    }
}

const putUpdateAjuste = async (req, res) => {
    const { aju_numero, aju_fecha, aju_descripcion, detalles } = req.body
    try {
        //Insercion del ajuste
        const ajuste = await db.one(`UPDATE public.ajuste SET aju_fecha=$1, aju_descripcion=$2
            WHERE aju_numero=$3 RETURNING*;`, [aju_fecha, aju_descripcion, aju_numero])

        await db.none(`DELETE FROM public.ajuste_detalle WHERE aju_numero=$1;`, [aju_numero])

        //Insercion del detalle
        let response = [];
        for (let i = 0; i < detalles.length; i++) {
            const detalle = await db.one(`INSERT INTO public.ajuste_detalle(aju_numero, pro_id, aju_det_cantidad, 
                aju_det_modificable, aju_det_estado) VALUES ($1, $2, $3, true, true) returning*;`,
                [ajuste.aju_numero, detalles[i].pro_id, detalles[i].aju_det_cantidad])
            response.push(detalle)
        }
        ajuste.aju_detalle = response
        res.json(ajuste)
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const deleteAjuste = async (req, res) => {
    try {
        const { aju_numero } = req.body
        const response = await db.one(`UPDATE public.ajuste SET aju_estado=false
        WHERE aju_numero=$1 RETURNING*;`, [aju_numero])
        res.json(
            {
                message: "Ajuste eliminado con éxito",
                response
            }
        )
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

const activateAjuste = async (req, res) => {
    try {
        const { aju_numero } = req.body
        const response = await db.one(`UPDATE public.ajuste SET aju_estado=true
        WHERE aju_numero=$1 RETURNING*;`, [aju_numero])
        res.json(
            {
                message: "Ajuste activado con éxito",
                response
            }
        )
    } catch (error) {
        console.log(error.message)
        res.json({ message: error.message })
    }
}

module.exports = {
    getAllAjustes,
    getAjustes,
    getAjusteByNum,
    getAjustesByProd,
    getAjustesByProdId,
    getAjusteNumero,
    postCreateAjuste,
    postCreateAjusteDetalle,
    postCreateAjustecompleto,
    putUpdateAjuste,
    deleteAjuste,
    activateAjuste
}