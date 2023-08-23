const express = require('express')
const {
    getAllTravels,
    getTravel,
    getAllTravelsByUser,
    createTravel,
    updateTravel,
    deleteTravel
} = require('../controllers/travel.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const router = express.Router()

router.use(express.json());


router.get('/', getAllTravels)
router.get('/:id', getTravel)
router.get('/all/:id', getAllTravelsByUser)
router.post('/', authMiddleware, createTravel)
router.put('/:id', authMiddleware, updateTravel)
router.delete('/:id', authMiddleware, deleteTravel)

module.exports = router
