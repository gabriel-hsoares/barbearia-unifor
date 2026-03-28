const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const pool = require('../db');

router.get('/appointments', auth, admin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.user_id,
        a.service_id,
        a.date,
        a.time,
        a.status,
        s.name AS service_name,
        s.price,
        s.duration,
        CASE
          WHEN u.role = 'admin' THEN 'Criado pelo administrador'
          ELSE u.name
        END AS client_name
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY a.date, a.time
    `);

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
});

router.put('/appointments/:id', auth, admin, async (req, res) => {
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2',
      [status, req.params.id]
    );

    return res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar status' });
  }
});

module.exports = router;