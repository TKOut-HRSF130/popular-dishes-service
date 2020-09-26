/* eslint-disable no-console */
const faker = require('faker');
const db = require('./index.js');
const dishes = require('./dishes.js');

const dropAll = (seedFn) => {
  db.query('truncate table restaurants;truncate table dishes; truncate table users; truncate table reviews;', seedFn);
};

const loop = (n, sql, param, cb) => {
  const toAdd = [];
  for (let i = 0; i < n; i += 1) {
    toAdd.push([param()]);
  }
  if (cb) {
    db.query(sql, [toAdd], cb);
  } else {
    db.query(sql, [toAdd]);
  }
};

const getDishes = (cb) => {
  const getRestr = 'select (id) from restaurants;';
  db.query(getRestr, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Creating dishes for ${res.length} restaurants`);
    const dishesToInsert = [];
    for (let i = 0; i < res.length; i += 1) {
      const numOfDishes = Math.floor(Math.random() * (6 - 3) + 3);
      for (let dishCount = 0; dishCount < numOfDishes; dishCount += 1) {
        const dish = faker.random.arrayElement(dishes);
        dishesToInsert.push([res[i].id, dish.name, dish.ingr]);
      }
    }
    const sql = 'insert into dishes (restr_id, name, ingredients) values ?';
    db.query(sql, [dishesToInsert], cb);
  });
};

const getReviews = () => {
  const getDish = 'select (id) from dishes;';
  db.query(getDish, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Inserting reviews for ${res.length} dishes`);
      for (let i = 0; i < res.length; i += 1) {
        const numOfReviews = Math.floor(Math.random() * (8 - 3) + 3);
        for (let r = 0; r < numOfReviews; r += 1) {
          const user = faker.random.number(10); //FIX ACCORDING TO NUM OF USERS
          const review = faker.lorem.paragraph(Math.floor(Math.random() * (5 - 3) + 3));
          const dinedOn = faker.date.recent(800);
          const stars = faker.finance.amount(3.5, 5, 1);
          const userStatus = faker.random.boolean();
          const sql = 'insert into reviews (dish_id, user_id, review, dined_on, stars, user_status) values (?, ?, ?, ?, ?, ?);';
          db.query(sql, [res[i].id, user, review, dinedOn, stars, userStatus], (error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      }
    }
  });
};

const genUsers = (n) => {
  const sql = 'insert into users (name) values ?;';
  const name = () => `${faker.name.firstName()} ${faker.name.lastName()}`;

  loop(n, sql, name);
};

const genRestaurants = (n, cb) => {
  const sql = 'insert into restaurants (name) values ?;';
  const name = () => `${faker.company.bsBuzz()}`;
  loop(n, sql, name, cb);
};

// dropAll((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('success drop all');
//     genUsers(10);
//     genRestaurants(10, () => {
//       console.log('created restaurants');
//       getDishes(getReviews);
//     });
//   }
// });
const https = require('https');
const fs = require('fs');

let numImages = 50

for (let i = 0; i < numImages; i += 1) {
  const file = fs.createWriteStream(`${i}.jpg`);
  const imgUrl = faker.image.avatar();
  https.get(imgUrl, function(response) {
    response.pipe(file);
  });
}