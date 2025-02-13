class dashboardController {
    static async dashboardPartner(req, res) {
        try {
            const user = res.locals.user || null; 
            res.render('dashboardPartner', { user, cache: false });
        } catch (err) {
            console.error('Error rendering dashboard:', err);
            res.status(500).send(err.message);
        }
    }
    static async partner(req, res) {
        try {
            const user = res.locals.user || null; 
            res.render('partner', { user, cache: false });
        } catch (err) {
            console.error('Error rendering partner:', err);
            res.status(500).send(err.message);
        }
    }
    static async chat(req, res) {
        try {
            const user = res.locals.user || null; 
            res.render('chat', { user, cache: false });
        } catch (err) {
            console.error('Error rendering chat:', err);
            res.status(500).send(err.message);
        }
    }
    static async helpCenter(req, res) {
        try {
            const user = res.locals.user || null; 
            res.render('helpCenter', { user, cache: false });
        } catch (err) {
            console.error('Error rendering help center:', err);
            res.status(500).send(err.message);
        }
    }
}

module.exports = dashboardController;
