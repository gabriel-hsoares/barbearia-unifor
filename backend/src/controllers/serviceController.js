const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro em getAll services:', err);
    return res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
};

exports.create = async (req, res) => {
  const { name, price, duration } = req.body;

  try {
    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const result = await pool.query(
      'INSERT INTO services (name, price, duration) VALUES ($1, $2, $3) RETURNING *',
      [name, price, duration]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro em create service:', err);
    return res.status(500).json({ message: 'Erro ao criar serviço' });
  }
};

exports.update = async (req, res) => {
  const { name, price, duration } = req.body;

  try {
    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const result = await pool.query(
      `UPDATE services
       SET name = $1, price = $2, duration = $3
       WHERE id = $4
       RETURNING *`,
      [name, price, duration, req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro em update service:', err);
    return res.status(500).json({ message: 'Erro ao atualizar serviço' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    return res.json({ message: 'Serviço excluído com sucesso' });
  } catch (err) {
    console.error('Erro em remove service:', err);
    return res.status(500).json({ message: 'Erro ao excluir serviço' });
  }
};