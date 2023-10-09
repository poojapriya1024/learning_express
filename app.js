//require is a function returns a function
const express = require('express');
const Joi = require('joi'); //returns a class
const app = express();

app.use(express.json());

//list of courses
const courses = [
    {id: 1, name: "course1"},
    {id: 2, name:"course2"},
    {id: 3, name:"course3"},
    {id: 4, name:"course4"}
];

//this validates course name
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}

//GET requests
app.get('/', (req, res) => {
    res.send('Hello, world');
});

app.get('/api/about',(req,res) => {
    res.send("This is my very first server using Express");
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("The course with the given ID doesn't exist");
        return;
    }
        else
        res.send(course.name);
});

//POST request
app.post('/api/courses', (req, res) => {
    
    // object deconstruction
    const {error} = validateCourse(req.body); //getting result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

// PUT request
app.put('/api/courses/:id', (req,res) => {
    //check if this course exist
    //if it doesn't exist, return 404
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("The course with the given ID doesn't exist");
        return;
    }
    //validate
    //if invalid, return 400 - bad request

    const {error} = validateCourse(req.body); //getting result.error
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    course.name = req.body.name;
    //return the updated course
    res.send(course);
});

//DELETE
app.delete('/api/courses/:id', (req, res) => {
    //check if the course exists
    //else, return 404
    const course = courses.find( c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("The course with the given ID doesn't exist");
        return;
    }
    //delete the code
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the deleted code
    res.send(course);
});


// if any environment variable is set, then use port. else, listen on 8080
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));

