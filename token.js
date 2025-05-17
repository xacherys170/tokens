import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { action, userId, token } = req.body;

    if (action === 'generate') {
      if (!userId) return res.status(400).json({ error: 'Falta userId' });

      const payload = { uid: userId };
      const token = jwt.sign(payload, SECRET, { expiresIn: '30d' });

      return res.status(200).json({ token });
    }

    if (action === 'validate') {
      if (!token) return res.status(400).json({ error: 'Falta token' });

      try {
        const decoded = jwt.verify(token, SECRET);
        return res.status(200).json({ valid: true, decoded });
      } catch (e) {
        return res.status(200).json({ valid: false, error: e.message });
      }
    }

    return res.status(400).json({ error: 'Acción inválida' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Método no permitido');
  }
}
