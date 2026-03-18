const router = require('express').Router()
const {requireAuth} = require('../middleware/auth')

const ALERTS = [
    {severity: 'critical', message:'CPU exceeded 95%', provider:'AWS'},
    {severity: 'warning', message:'Memory above 70%', provider:'Azure'},
    {severity: 'info', message:'Maintenance in 2hr', provider:'GCP'}
]

router.get('/', requireAuth, (req, res) => {
    const count = Math.floor(Math.random()*3) + 1
    const alerts = Array.from({length:count}, (_, i) => ({
        
        id: i + 1,
        ...ALERTS[Math.floor(Math.random() * ALERTS.length)],
        timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    
    }))
    res.json({total: alerts.length, alerts})
})

module.exports = router