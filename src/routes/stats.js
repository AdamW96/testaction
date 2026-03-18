const router = require('express').Router()
const {requireAuth} = require('../middleware/auth')
const {getAllProviders, getProvider, getTimeseries} = require('../services/cloud')

router.get('/', requireAuth, (req, res) => {

    res.json({timestamp: new Date().toISOString(), providers: getAllProviders()})
})

router.get('/:provider', requireAuth, (req, res)=> {
    const data = getProvider(req.params.provider)
    if(!data) return res.status(404).json({error: 'Unknown provider'})
    res.json(data)
})

router.get('/:provider/timeseries', requireAuth, (req, res)=>{
    res.json({provider: req.params.provider, series:getTimeseries(req.params.provider)})
})

module.exports = router