module.exports = function(router, db){

    router.get('/students', async (req, res, next) => {
        try {
            let results = await db.getAllStudents();
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });

    router.post('/students', async (req, res, next) => {
        try {
            let results = await db.createStudent(req.body);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/students/oprhaned', async (req, res, next) => {
        try {
            let results = await db.getAllOpenStudents();
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/students/:id', async (req, res, next) => {
        try {
            let results = await db.findStudentById(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.delete('/students/:id', async (req, res, next) => {
        try {
            let results = await db.deleteStudent(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.put('/students/:id', async (req, res, next) => {
        try {
            let results = await db.updateStudent(req.params.id, req.body);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/students/:id/courses', async (req, res, next) => {
        try {
            let results = await db.getStudentCourses(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
    router.get('/students/:id/class', async (req, res, next) => {
        try {
            let results = await db.getStudentClass(req.params.id);
            res.json(results);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    });
    
}