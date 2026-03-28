const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/appointmentController');

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Lista os agendamentos do usuário
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 */
router.get('/', auth, controller.getMine);

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Cria um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentBody'
 *     responses:
 *       201:
 *         description: Agendamento criado
 */
router.post('/', auth, controller.create);

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     summary: Busca um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 */
router.get('/:id', auth, controller.getById);

/**
 * @openapi
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 */
router.put('/:id', auth, controller.update);

/**
 * @openapi
 * /appointments/{id}:
 *   delete:
 *     summary: Exclui um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agendamento excluído
 */
router.delete('/:id', auth, controller.remove);

module.exports = router;