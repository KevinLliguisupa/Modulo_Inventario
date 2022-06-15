const { response } = require('express')
const req = require('express/lib/request')
const { db } = require('../config/connection')

/**
 * Obtiene el numero de ajuste que esta disponible 
 * y que continua con la secuencia
 * @param {*} res numero de ajuste
 */
const getAjusteId = async (req, res) => {
    try {
        const response = await db.one(`select get_nroAjuste();`)
        res.json(response)    
    } catch (error) {
        console.log(error)
        res.json({
            message: 'No se pudo obtener el numero'
        })
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
        console.log(error)
        res.json({
            message: 'Valores incorrectos'
        })
    }
}

/**
 * Permite crear el detalle de un ajuste apartir de su id
 * @param {*} req Id del ajuste y un arreglo de detalles
 */
const postCreateAjusteDetalle = async (req, res) => {
    const { aju_id, detalles } = req.body
    try {
        let detalle=[]
        for (let i = 0; i < detalles.length; i++) {
            const response = await db.one(`INSERT INTO public.ajuste_detalle(aju_id, pro_id, aju_det_cantidad, 
                aju_det_modificable, aju_det_estado) VALUES ($1, $2, $3, true, true) returning*;`,
                [aju_id, detalles[i].pro_id, detalles[i].aju_det_cantidad])
            detalle.push(response)
        }
        res.json({ ajuste: aju_id, detalle: detalle })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Valores incorrectos'
        })
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
        let detalle=[]
        for (let i = 0; i < detalles.length; i++) {
            const response = await db.one(`INSERT INTO public.ajuste_detalle(aju_id, pro_id, aju_det_cantidad, 
                aju_det_modificable, aju_det_estado) VALUES ($1, $2, $3, true, true) returning*;`,
                [ajuste.aju_id, detalles[i].pro_id, detalles[i].aju_det_cantidad])
            detalle.push(response)
        }
        res.json({ ajuste: ajuste, detalle: detalle })
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Valores incorrectos'
        })
    }
}

module.exports = {
    getAjusteId,
    postCreateAjuste,
    postCreateAjusteDetalle,
    postCreateAjustecompleto
}