const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Cria uma conta
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterBody'
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 */
router.post('/register', controller.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Faz login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginBody'
 *     responses:
 *       200:
 *         description: Token JWT retornado com sucesso
 */
router.post('/login', controller.login);

module.exports = router;