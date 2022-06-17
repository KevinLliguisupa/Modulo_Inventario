const req = require('express/lib/request')
const { db } = require('../config/connection')

const getCatByEstado = async (req, res) => {
    const response = await db.any('SELECT * FROM categoria WHERE cat_estado=true;')
    res.json(response)
}

const putUpdateCatbyId = async (req, res) => {
    const { cat_id, cat_nombre, cat_estado } = req.query
    const response = await db.any('UPDATE public.categoria SET cat_nombre=$2,cat_estado=$3 WHERE cat_id=$1', [cat_id, cat_nombre, cat_estado])
    res.json(response)
}

const deleteCat = async (req, res) => {
    const {cat_id} = req.query
    const response = await db.any('UPDATE public.categoria SET cat_estado=false WHERE cat_id=$1 returning*', [cat_id])
    res.json(response)
}

const createCat = async (req, res) => {
    const { cat_nombre, cat_estado } = req.query
    const response = await db.one(`INSERT INTO public.categoria (cat_nombre, cat_estado)
                                    VALUES ($1, $2) returning*;`, [cat_nombre, cat_estado])


    res.json(response)
}


module.exports = {
    getCatByEstado,
    putUpdateCatbyId,
    deleteCat,
    createCat
}