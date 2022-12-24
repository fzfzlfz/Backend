import express from 'express';
import session from 'express-session';
import {v4 as UUIDv4} from 'uuid' ;
import { PrismaClient } from '@prisma/client'
import * as childp from 'child_process';
const prisma = new PrismaClient()
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
import * as auth from './auth.mjs'

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const exec = childp.exec;
const basePrice = {
  "Bike": 200, 
  "Van": 1000,
  "Sedan": 1500,
  "E-Scooter": 500,
  "E-Bike": 400,
  "Dump truck": 10000,
  "Bus": 10000,
  "Armored Truck": 10000,
  "Box Truck": 10000,
  "Beverage Truck": 10000
}

setInterval(periodExecution,7*24*60*60*1000); // one week
// periodically train
function periodExecution() {
  const curr = new Promise((resolve, reject)=>{
    resolve();
  }).then(()=>{
    const cmdStr = 'python train_person.py';
    exec(cmdStr, (err, stdout, stderr)=>{
        if(err){
            console.log(stderr)
        }else{
            console.log(stdout)
        }
    })
    return;
  }).catch((err) => {
    console.log(err);
  });
}
app.post('/addClaim', async (req, res, next) => {
    console.log('addClaim');
    await prisma.claim.create({
      data:{
        id:UUIDv4(),
        ...req.body
      }
    });
    res.json('ok');
});

app.post('/buyInsurance', async (req, res, next) => {
  console.log('buyInsurance');
  // db.insertNewInsurance(req.body);
  res.json('ok');
});

app.get('/getInsurance', async (req, res) => {
  const insurances = await prisma.insurance.findMany();
  res.send(insurances);
});

app.get('/getClaim', async (req, res) => {
  const claims = await prisma.claim.findMany();
  res.send(claims);
});


//TODO: register
app.post('/register', (req, res) => {
  console.log('register');
  function success() {
    res.send({success: 'Register Sucessfully!'});
    console.log('SUCCESS');
  }
  

  function error(err) {
    res.send({err: err.message});
    console.log('ERROR:', err.message);
  }

  // attempt to register new user
  auth.register(req.query.email, req.query.password, error, success);
});

app.post('/getPrice', async (req, res) => {
  const age = req.body.age;
  const sexual = (req.body.gender === "Female") ? 0 : 1; // FM:0 M:1
  const curr = new Promise((resolve, reject)=>{
    console.log('fetching price');
    resolve();
  }).then(()=>{
    const cmdStr = 'python predict_person.py' + ' ' + age + ' ' + sexual;  
    exec(cmdStr, (err, stdout, stderr)=>{
        if(err){
            console.log(stderr)
        }else{
            console.log(stdout)
        }
    })
    return;
  }).catch((err) => {
    console.log(err);
  }).finally(()=>{console.log('finish')})
  //then read the file
  let retprice = basePrice[req.body.vtype]; // get the base price
  await fs.readFile('price.txt', 'utf-8', function (err, data) {
    const value = parseInt(data);
    const ratio = getRatio(value);
    retprice = retprice * ratio;
  });
  res.json(retprice);
})

const getRatio = (val) => {
  if(val === 1) return val;
  else if (val === 2) return val * 1.5;
  else if (val === 3) return val * 2;
  else if (val === 4) return val * 2.5;
  else if (val === 5) return val * 3;
}

// TODO: login
app.get('/login', (req, res) => {
  // setup callbacks for login success and error
  function success(user) {
    console.log('login successful');

    res.status(200).send({
      id: user.id,
      email: user.email,
      photo: user.photo,
    }); 
  }

  function error(err) {
    console.log('login err');
    res.send({ err: err.message}); 
  }

  // attempt to login
  auth.login(req.query.email, req.query.password, error, success);
});

// app.get('/changePic', async (req, res) => {
//   console.log('change pic');
//   console.log(req.query.link, '|', req.query.id);
//   const newuser = await User.findByIdAndUpdate(req.query.id,{
//     photo: req.query.link
//   }, {new: true});
//   res.status(200).send({
//     id: newuser._id,
//     email: newuser.email,
//     photo: newuser.photo,
//   }); 
// });

// app.post('/changePsw', async(req, res) => {
//   console.log('changePsw');
//   const user = await User.findById(req.body.id);
//   console.log('user--', user);
//   bcrypt.compare(req.body.opsw, user.password, async (err, passwordMatch) => {
//     // regenerate session if passwordMatch is true
//     if(passwordMatch) { //match
//       const saltRounds = 10;
//       const newpsw = await new Promise((resolve, reject) => {
//           bcrypt.hash(req.body.npsw, saltRounds, function(err, hash) {
//             resolve(hash);
//           })
//       });
//       await User.findByIdAndUpdate(req.body.id,{
//         password: newpsw
//       }, {new: true});
//       console.log('new user--', user);
//       res.send({});
//     } else {
//       console.log('send err')
//       res.send({err: 'incorrect old password'});
//     }
//    });
// })



app.listen(process.env.PORT || 3000);

