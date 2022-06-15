const req = require('express/lib/request')
const { db } = require('../config/connection')


const getAjusteProducto = async (req, res) => { 
    try
        { 
            const ajustes = await db.query(`select * from ajuste where aju_estado=true order by 1`); 
            let response=[]; 
            for (let i = 0; i < ajustes.length; i++) { 
                let detalleAjuste = await db.query(`select daj.* from ajuste aj, ajuste_detalle daj where aj.aju_id=daj.aju_det_id and 
                aj.aju_estado=true and daj.aju_det_estado=true and daj.aju_id=$1`,[ajustes[i].aju_id]); 
                response.push({ 
                ajuste:ajustes[i],detalleAjuste:detalleAjuste 
                }) 
            } 
            res.json(response) 
    }catch (error){ 
        res.json({ message:'Problema al obtener el detalle' }) 
    } 
}

const putUpdateAjuste = async (req, res) => {
    const {aju_id, aju_fecha, aju_descripcion, detalles } = req.body
    try {
        //Insercion del ajuste
        const ajuste = await db.one(`UPDATE public.ajuste
        SET   aju_fecha=$1, aju_descripcion=$2, aju_estado=true
        WHERE aju_id=$3 RETURNING*;`, [aju_fecha, aju_descripcion,aju_id])

        await db.none(`DELETE FROM public.ajuste_detalle
        WHERE aju_id=$1;`, [aju_id])

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

const getProductoAjuste = async (req, res) => { 
    try
        { 
            const productos = await db.query(`select * from producto where pro_estado=true order by 1`); 
            let response=[]; 
            for (let i = 0; i < productos.length; i++) { 
                let detalleAjuste = await db.query(`select daj.* from producto pro, ajuste_detalle daj where pro.pro_id=daj.pro_id and 
                pro.pro_estado=true and daj.aju_det_estado=true and daj.pro_id=$1`,[productos[i].pro_id]); 
                response.push({ 
                producto:productos[i],detalleAjuste:detalleAjuste 
                }) 
            } 
            res.json(response) 
    }catch (error){ 
        res.json({ message:'Problema al obtener el detalle' }) 
    } 
}

module.exports = {
getAjusteProducto,
putUpdateAjuste,
getProductoAjuste
}

