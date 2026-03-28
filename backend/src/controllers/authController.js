const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // utilizamos o bcrypt para criptografar a senha no supabase
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    return res.json({ message: 'Usuário criado com sucesso' });

  } catch (err) {
    // verific se já existe o email cadastrado no db
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    // mensagem de usuário ñ encontrado
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // verificação da senha no db
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    // gerar token de login
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.json({ token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};