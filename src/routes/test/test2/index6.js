function get(req, res) {
    res.json({name: 'test handlerGet'})
}

function options(req, res) {
    res.json({name: 'test handlerOptions'})
}

export {get, options}
