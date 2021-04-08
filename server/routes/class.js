module.exports = function(router, db){

    router.get('/classes', async (req, res, next) => {
        try {
            let results = await db.classes();
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.post('/classes', async (req, res, next) => {
        try {
            let results = await db.createClass(req.body);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.put('/classes/:id', async (req, res, next) => {
        try {
            let results = await db.updateClass(req.params.id, req.body);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.delete('/classes/:id', async (req, res, next) => {
        try {
            let results = await db.deleteClass(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/classes/:id', async (req, res, next) => {
        try {
            let results = await db.findClassById(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    
    router.get('/classes/:id/attendees', async (req, res, next) => {
        try {
            let results = await db.getClassAttendees(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.post('/classes/:id/:student_id', async (req, res, next) => {
        try {
            let results = await db.setClassAttendee(req.params.id, req.params.student_id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.delete('/classes/:id/:student_id', async (req, res, next) => {
        try {
            let results = await db.deleteClassAttendee(req.params.id, req.params.student_id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
}