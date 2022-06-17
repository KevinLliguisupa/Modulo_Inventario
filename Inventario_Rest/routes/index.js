const { Router } = require("express");

const { getCatByEstado, putUpdateCatbyId, deleteCat, createCat } = require('../controllers/categoria-controller')
const router = Router()


router.get('/getCat', getCatByEstado)
router.put('/updateCat', putUpdateCatbyId)
router.put('/deleteCat', deleteCat)
router.post('/createCat', createCat)

module.exports = router