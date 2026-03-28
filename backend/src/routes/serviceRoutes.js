const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

/**
 * @openapi
 * /services:
 *   get:
 *     summary: Lista serviços
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de serviços
 */
router.get('/', controller.getAll);

/**
 * @openapi
 * /services:
 *   post:
 *     summary: Cria serviço
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceBody'
 *     responses:
 *       201:
 *         description: Serviço criado
 */
router.post('/', auth, admin, controller.create);

/**
 * @openapi
 * /services/{id}:
 *   put:
 *     summary: Atualiza serviço
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Serviço atualizado
 */
router.put('/:id', auth, admin, controller.update);

/**
 * @openapi
 * /services/{id}:
 *   delete:
 *     summary: Exclui serviço
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Serviço excluído
 */
router.delete('/:id', auth, admin, controller.remove);

module.exports = router;