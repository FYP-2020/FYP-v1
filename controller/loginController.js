var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/mydb';
var connectionString = 'mongodb://localhost:27017/mydb';

module.exports = (function(app){
  app.get('/', function(req,res){
    res.render('login');
  });
  app.get('/register',function(req,res){
    res.render('register');
  });

app.get('/error', function(req,res){
    res.render('error');
  });

app.get('/pengurusanTugas', function(req,res){
MongoClient.connect(url, function(err, db) {
      const cursor=db.collection('tasksMgmt').find().toArray()
      .then(results=>{
     res.render('pengurusanTugas.ejs', { tasksMgmt: results })
      }).catch(error=>console.error(error));
      });
  });


app.get('/completeprofile', function(req,res){
    // res.render('completeprofile');
     MongoClient.connect(url, function(err, db) {
    const cursor=db.collection('userprofile').find().toArray()
    .then(results=>{
     res.render('completeprofile.ejs', { userprofile: results })
      }).catch(error=>console.error(error));
  });
   });


app.get('/manageMeetingInvitation', function(req,res){
     MongoClient.connect(url, function(err, db) {
    const cursor=db.collection('userprofile').find().toArray()
    .then(results=>{
     res.render('manageMeetingInvitation.ejs', { userprofile: results })
      }).catch(error=>console.error(error));
  });
   });

app.get('/viewMeetingInfo', function(req,res){
     MongoClient.connect(url, function(err, db) {
    const cursor=db.collection('meetingInfo').find().toArray()
    .then(results=>{
     res.render('viewMeetingInfo.ejs', { meetingInfo: results })
      }).catch(error=>console.error(error));
  });
   });

app.get('/meetingInfo', function(req,res){
       MongoClient.connect(url, function(err, db) {
    const cursor=db.collection('tasksMgmt').find().toArray()
    .then(results=>{
     res.render('meetingInfo.ejs', { tasksMgmt: results })
      }).catch(error=>console.error(error));
  });
   });

// Login TO DB==================================================================
  app.post('/test',urlencodedParser,function(req,res){
   MongoClient.connect(url, function(err, db) {
   db.collection('userprofile').findOne({ name: req.body.name}, function(err, user) {
             if(user ===null){
              console.log("Empty");
               res.render('error');
            }else if (user.name === req.body.name && user.pass === req.body.pass){
            const cursor=db.collection('test').find().toArray()
    .then(results=>{
     res.render('test.ejs', { taskpoint: results })
      }).catch(error=>console.error(error))
          } else {
            console.log("Credentials wrong");
            res.render('error');
          }
   });
 });
});

//save tasks to MongoDB================================================================
  app.post('/pengurusanTugas',urlencodedParser,function(req,res){
   var obj = JSON.stringify(req.body);
   console.log("Final reg Data : "+obj);
   var jsonObj = JSON.parse(obj);
      MongoClient.connect(url, function(err, db) {
      db.collection("tasksMgmt").insertOne(jsonObj, function(err, res) {
     if (err) throw err;
     console.log("1 document inserted");
     db.close();
      });

      //============ save tasks detail to individual DB =====================
      //if jsonObj.task=Luar Sekolah, addtoset luar:Tajuk
      //if jsonObj.task=Tugasan Sekolah, if tahap=tinggi, addtoset tinggi:Tajuk, 
      //if tahap=Sederhana, addtoset sederhana:Tajuk, if tahap=rendah, addtoset rendah:Tajuk
      var newvalues = { $addToSet: {luar: jsonObj.Tajuk } };
      db.collection("taskdetail").updateOne({name: req.body.name11 }, newvalues, function(err, res){
        if (err) throw err;
        console.log("1 document updated");
        db.close();
         });
      //====================================================================

      //========= save points to individual DB============
      //if jsonObj.task=Luar Sekolah, addtoset luar: 1
      //if jsonObj.task=Tugasan Sekolah, if tahap=tinggi, addtoset tinggi:1, 
      //if tahap=Sederhana, addtoset sederhana:1, if tahap=rendah, addtoset rendah:1
      var newvalues2 = { $addToSet: {luar: 1 } };
      db.collection("taskpoint").updateOne({name: req.body.name11 }, newvalues2, function(err, res){
        if (err) throw err;
        console.log("1 document updated");
        db.close();
         });
      //====================================================================

      const cursor=db.collection('tasksMgmt').find().toArray()
      .then(results=>{
     res.render('pengurusanTugas.ejs', { tasksMgmt: results })
      }).catch(error=>console.error(error));
      });
    });

 app.post('/viewMeetingInfo',urlencodedParser,function(req,res){
   var obj = JSON.stringify(req.body);
   console.log("Final reg Data : "+obj);
   var jsonObj = JSON.parse(obj);
      MongoClient.connect(url, function(err, db) {
      db.collection("meetingInfo").insertOne(jsonObj, function(err, res) {
     if (err) throw err;
     console.log("1 document inserted");
     db.close();
      });
      const cursor=db.collection('meetingInfo').find().toArray()
      .then(results=>{
     res.render('viewMeetingInfo.ejs', { meetingInfo: results})
      }).catch(error=>console.error(error));
      });
    });  

MongoClient.connect(connectionString,{
  useUnifiedTopology: true
  }).then(client => {
 
  console.log('Connected to Database')
  const db = client.db('mydb')
  //const profile= db.collection('userprofile')
  const leaveCollection = db.collection('hourlyleave')
  const attendance = db.collection('attendance')
  const approvedLeave = db.collection('notification')
  
  app.post('/hourlyleave', (req, res) => {
      leaveCollection.insertOne(req.body)
      .then(result => {
        
  res.render('hourlyy.ejs')
    
      })
      .catch(error => console.error(error))
  })
  
  app.post('/notification', (req, res) => {
      approvedLeave.insertOne(req.body)
      .then(result => {
        
      console.log('haaiai')
    
      })
      .catch(error => console.error(error))
  })


  app.get('/hourlyleave',(req,res)=>{
      //const cursor = db.collection('quotes').find().toArray()
      //.then(results =>{
          res.render('hourly.ejs')//,{ quotes: results})
     // })
     // .catch(error=>console.error(error))
     
  })

  app.get('/approved',(req,res)=>{

      res.render('approved.ejs')
  })

  app.get('/attendance',(req,res)=>{
      const cursor = db.collection('attendance').find().toArray()
      .then(results =>{
          res.render('attendance.ejs',{ attendance: results})
      })
      .catch(error=>console.error(error))
     
  })

  app.get('/test',(req,res)=>{
    const cursor = db.collection('taskpoint').find().toArray()
    .then(results =>{
        res.render('test.ejs',{ taskpoint: results})
    })
    .catch(error=>console.error(error))
   
})

  app.get('/approve',(req,res)=>{
      const cursor = db.collection('hourlyleave').find().toArray()
      .then(results =>{
          res.render('approve.ejs',{ hourlyleave: results})
      })
      .catch(error=>console.error(error))
     
  })

  app.delete('/approved', (req,res)=>{
      
      leaveCollection.deleteOne(

      )
      .then(result=>{
          res.json('deleted')
      })
      .catch(error => console.error(error))

     
  })

  app.get('/getdetails',(req,res)=>{
    const cursor=db.collection('userprofile').find().toArray()
    .then(results=>{
     res.render('completeprofile.ejs', { userprofile: results })
      }).catch(error=>console.error(error))
  })
  app.get('/getInvitation',(req,res)=>{
    const cursor=db.collection('userprofile').find().toArray()
    .then(results=>{
     res.render('manageMeetingInvitation.ejs', { userprofile: results })
      }).catch(error=>console.error(error))
  })
  app.get('/getMeetingInfo',(req,res)=>{
    const cursor=db.collection('tasksMgmt').find().toArray()
    .then(results=>{
     res.render('meetingInfo.ejs', { tasksMgmt: results })
      }).catch(error=>console.error(error))
  })
  app.get('/getUserDetail',(req,res)=>{
    const cursor=db.collection('userprofile').find().toArray()
    .then(results=>{
     res.render('meetingInfo.ejs', { userprofile: results })
      }).catch(error=>console.error(error))
  })
  app.get('/pengurusanTugas',(req,res)=>{
    const cursor=db.collection('tasksMgmt').find().toArray()
    .then(results=>{
     res.render('pengurusanTugas.ejs', { tasksMgmt: results })
      }).catch(error=>console.error(error))
  })
   app.delete('/pengurusanTugas', (req, res) => {
      db.collection('tasksMgmt').deleteOne()
        .then(result => {
          console.log('Task deleted')
          res.json('Task deleted')
          res.render('pengurusanTugas.ejs', { tasksMgmt: results })
        })
        .catch(error => console.error(error))
    })
})
})
//testing