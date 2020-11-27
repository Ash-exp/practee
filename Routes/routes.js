const router = require('express').Router();
const path =  require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const User = require('../DB/user');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//route to post user details to db
router.post('/teacher', async(req, res) => {
    const teacher = new User.teacher({
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        role: req.body.role
    });
    const savedTeacher = await teacher.save();
    res.send(savedTeacher);
});

router.post('/student', async(req, res) => {
    const student = new User.student({
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        teacher: req.body.teacher,
        course: req.body.course
    });
    const savedStudent = await student.save();
    res.send(savedStudent);
});

//route to see the data in the database
router.get('/readTea', function(req, res) {
    var select = req.query.select;
    User.teacher.find({}, function(err, foundData) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (foundData.length == 0) {
                var responseObj = undefined;
                if (select && select == 'count') {
                    responseObj = { count: foundData.length };
                }
            } else {
                var responseObj = foundData;
                if (select && select == 'count') {
                    responseObj = { count: foundData.length };
                }
                res.send(responseObj);
            }
        }
    });
});

router.get('/readStu', function(req, res) {
    var select = req.query.select;
    User.student.find({}, function(err, foundData) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (foundData.length == 0) {
                var responseObj = undefined;
                if (select && select == 'count') {
                    responseObj = { count: foundData.length };
                }
            } else {
                var responseObj = foundData;
                if (select && select == 'count') {
                    responseObj = { count: foundData.length };
                }
                res.send(responseObj);
            }
        }
    });
});


router.get('/test', async (req, res) => {
    res.sendFile(path.join(__dirname + '/test.html'))
});

router.post('/test', function(req, res){
    const mon = req.body.month;
    const dy = req.body.day;
    const yr = req.body.year;
    var tc;
    fetch("https://kpi.knowlarity.com/Basic/v1/account/calllog?start_time=" + yr + "-" + mon + "-" + dy + "%2000%3A00%3A01%2B05%3A30&end_time=" + yr + "-" + mon + "-" + dy + "%2023%3A23%3A59%2B05%3A30", {
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "x-api-key": "xihMXYtXYY0E1v8Vkwai7WW4YmLgCGN5PyN3i8R6",
          "Authorization": "07a30c67-cd45-4fe9-a874-347260404af9"
        }
      })
        .then(response => { 
          return response.json();
        })
        .then(data => {
            tc = data['meta']['total_count'];
            fetch("https://kpi.knowlarity.com/Basic/v1/account/calllog?start_time=" + yr + "-" + mon + "-" + dy + "%2000%3A00%3A01%2B05%3A30&end_time=" + yr + "-" + mon + "-" + dy + "%2023%3A23%3A59%2B05%3A30&limit=" + tc.toString(), {
              method: 'GET',
              headers: {
                "Accept": "application/json",
                "x-api-key": "xihMXYtXYY0E1v8Vkwai7WW4YmLgCGN5PyN3i8R6",
                "Authorization": "07a30c67-cd45-4fe9-a874-347260404af9"
              }
            })
            .then(response => { 
                return response.json();
              })
              .then(data => {
                User.student.find({}, (err, stData) => {
                    User.teacher.find({}, (err, tData) => {
                        res.render('test', {sd : data, st_d : stData, t_d : tData});
                    });
                });
              });
        });
});

module.exports = router;



// router.post('/new', async (req, res) => {
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     });
//     const savedUser = await user.save();
//     res.send(savedUser);
// });

//route to see the data in the database
// router.get('/read', function(req, res) {
//     var select = req.query.select;
//     User.find({}, function(err, foundData) {
//         if(err){
//             console.log(err);
//             res.status(500).send();
//         } else {
//             if(foundData.length == 0){
//                 var responseObj = undefined;
//                 if(select && select == 'count'){
//                     responseObj = { count: foundData.length};
//                 }
//             } else {
//                 var responseObj = foundData;
//                 if(select && select == 'count'){
//                     responseObj = { count: foundData.length};
//                 }
//                 res.send(JSON.parse(responseObj));
//             }
//         }
//     });
// });
