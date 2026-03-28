const pool = require('../db');

function isPastDateTime(date, time) {
  const appointmentDateTime = new Date(`${date}T${time}:00`);
  const now = new Date();
  return appointmentDateTime < now;
}

function isValidHalfHour(time) {
  return /^([01]\d|2[0-3]):(00|30)$/.test(time);
}

exports.create = async (req, res) => {
  const { service_id, date, time } = req.body;

  try {
    if (!service_id || !date || !time) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
    }

    if (!isValidHalfHour(time)) {
      return res.status(400).json({ message: 'Os horários devem ser de 30 em 30 minutos' });
    }

    if (isPastDateTime(date, time)) {
      return res.status(400).json({ message: 'Não é permitido agendar horários que já passaram' });
    }

    const exists = await pool.query(
      'SELECT * FROM appointments WHERE date = $1 AND time = $2 AND status != $3',
      [date, time, 'cancelado']
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Horário já ocupado' });
    }

    const result = await pool.query(
      `INSERT INTO appointments (user_id, service_id, date, time, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, service_id, date, time, 'pendente']
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar agendamento' });
  }
};

exports.getMine = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        a.*,
        s.name AS service_name,
        s.price,
        s.duration,
        CASE
          WHEN u.role = 'admin' THEN 'Criado pelo administrador'
          ELSE u.name
        END AS client_name
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.user_id = $1
      ORDER BY a.date, a.time`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.name AS service_name, s.price, s.duration
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar agendamento' });
  }
};

exports.update = async (req, res) => {
  const { service_id, date, time, status } = req.body;

  try {
    const existing = await pool.query(
      'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (!existing.rows.length) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    const current = existing.rows[0];

    const newServiceId = service_id ?? current.service_id;
    const newDate = date ?? current.date;
    const rawTime = time ?? current.time;
    const newTime =
      typeof rawTime === 'string' && rawTime.length >= 5
        ? rawTime.slice(0, 5)
        : rawTime;
    const newStatus = status ?? current.status;

    const allowedStatus = ['pendente', 'cancelado', 'finalizado'];

    if (!allowedStatus.includes(newStatus)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    if (newStatus !== 'cancelado' && newStatus !== 'finalizado') {
      if (!isValidHalfHour(newTime)) {
        return res.status(400).json({ message: 'Os horários devem ser de 30 em 30 minutos' });
      }

      if (isPastDateTime(newDate, newTime)) {
        return res.status(400).json({ message: 'Não é permitido agendar horários que já passaram' });
      }

      const conflict = await pool.query(
        `SELECT * FROM appointments
         WHERE date = $1 AND time = $2 AND id != $3 AND status != $4`,
        [newDate, newTime, req.params.id, 'cancelado']
      );

      if (conflict.rows.length > 0) {
        return res.status(400).json({ message: 'Horário já ocupado' });
      }
    }

    const result = await pool.query(
      `UPDATE appointments
       SET service_id = $1, date = $2, time = $3, status = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [newServiceId, newDate, newTime, newStatus, req.params.id, req.user.id]
    );

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar agendamento' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }

    return res.json({ message: 'Agendamento excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir agendamento' });
  }
};