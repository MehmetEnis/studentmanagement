module.exports = function(router, db){

    router.get('/courses', async (req, res, next) => {
        try {
            let results = await db.courses();
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.post('/courses', async (req, res, next) => {
        try {
            let results = await db.createCourse(req.body);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/courses/:id', async (req, res, next) => {
        try {
            let results = await db.findCourseById(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.put('/courses/:id', async (req, res, next) => {
        try {
            let results = await db.updateCourse(req.params.id, req.body);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/courses/:id/attendees', async (req, res, next) => {
        try {
            let results = await db.getCourseAttendees(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.post('/courses/:id/:student_id', async (req, res, next) => {
        try {
            let results = await db.setCourseAttendee(req.params.id, req.params.student_id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.delete('/courses/:id/:student_id', async (req, res, next) => {
        try {
            let results = await db.deleteCourseAttendee(req.params.id, req.params.student_id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.delete('/courses/:id', async (req, res, next) => {
        try {
            let results = await db.deleteCourse(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });

    
}