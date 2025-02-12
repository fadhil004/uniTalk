class dashboardController {
    static async index(req, res) {
        try {
            const user = res.locals.user || null; 
            res.render('index', { user, cache: false });
        } catch (err) {
            console.error('Error rendering home:', err);
            res.status(500).send(err.message);
        }
    }
}

module.exports = dashboardController;
