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

module.exports = {
getAjusteProducto
}

