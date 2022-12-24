import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client'

import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// assumes that User was registered in `./db.mjs`


const prisma = new PrismaClient();
export const register = async (email, password, errorCallback, successCallback) => {
  // TODO: implement register
    const error = {message : ''};
    const result = await prisma.user.findUnique({where: {
      email: email
    },});
    console.log('result',result)
    if(result){ //already exist
      console.log('EMAIL ALREADY EXISTS');
      error.message = 'EMAIL ALREADY EXISTS';
      errorCallback(error);
    } else { // not exist-->create a new user
        console.log('create a new user');
        const saltRounds = 10;
        const newpsw = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err, hash) {
            if(err) {
                error.message('ERROR IN HASHING');
                errorCallback(error);
            }
            resolve(hash);
        });
      });
      const user = await prisma.user.create({
        data:{
          email: email,
          password: newpsw,
          photo: "/assets/images/avatars/avatar_default.jpg"
        }
      })
      if(user) {
        successCallback();
      }
    }
}


export const login = async (email, password, errorCallback, successCallback) => {
  // TODO: implement login
  console.log('auth login!');
  const error = {message : ''};
  const user = await prisma.user.findUnique({
    where :{
      email: email
      }
    });
  if (user) {
    // compare with form password
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      // regenerate session if passwordMatch is true
      if(passwordMatch) { //match
        successCallback(user);
      } else {
        error.message = 'PASSWORDS DO NOT MATCH';
        errorCallback(err);
      }
      });
  } else {
    error.message = 'USER NOT FOUND';
    errorCallback(error);
  }
};


