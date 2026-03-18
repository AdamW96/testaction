const router =  require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { db } = require('../db')
const { requireAuth } = require('../middleware/auth')

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({error:'Email and password required'})
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if(!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({error: 'Invalid account'})
    }
    const token = jwt.sign(
        { id: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    )
    return res.json({ token, user: {id:user.id, email: user.email}})
})

router.get('/me', requireAuth, (req, res) => {
    const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.user.id)
    return res.json(user)
})

module.exports = router