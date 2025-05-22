const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

bcrypt.hash('1234', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

    const SQLSTATEMENT = `
      DROP TABLE IF EXISTS User;

      DROP TABLE IF EXISTS UserAnswer;

      DROP TABLE IF EXISTS SurveyQuestion;

      DROP TABLE IF EXISTS Reviews;

      DROP TABLE IF EXISTS EcoCadets;

      DROP TABLE IF EXISTS Seeds;

      DROP TABLE IF EXISTS CadetsInventory;

      CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        points INT NOT NULL,
        completed_questions INT NOT NULL,
        UNIQUE (username(255))
      );

      CREATE TABLE UserAnswer (
        answer_id INT AUTO_INCREMENT PRIMARY KEY,
        answered_question_id INT NOT NULL,
        participant_id INT NOT NULL,
        answer BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        additional_notes TEXT
      );

      CREATE TABLE SurveyQuestion (
        question_id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        creator_id INT NOT NULL
      );

      CREATE TABLE Reviews (
      id INT PRIMARY KEY AUTO_INCREMENT,
      review_amt INT NOT NULL,
      review_text TEXT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE EcoCadets (
        cadet_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        cadet_name TEXT NOT NULL, 
        reward_point INT NOT NULL,
        reward_token INT NOT NULL,
        asset BOOLEAN DEFAULT FALSE, 
        UNIQUE (cadet_name(255)),
        UNIQUE (user_id)
      );

      CREATE TABLE Seeds (
        seed_id INT AUTO_INCREMENT PRIMARY KEY,
        seed_name TEXT NOT NULL,
        seed_type TEXT NOT NULL,
        growth_rate INT NOT NULL,
        growth_stage INT NOT NULL,
        seed_price INT NOT NULL
      );

      CREATE TABLE CadetsInventory (
        inventory_id INT AUTO_INCREMENT PRIMARY KEY,
        cadet_id INT NOT NULL,
        owned_seed_id INT NOT NULL,
        grown BOOL NOT NULL DEFAULT FALSE,
        watered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        seed_name TEXT NOT NULL,
        seed_type TEXT NOT NULL,
        growth_rate INT NOT NULL,
        growth_stage INT NOT NULL,
        seed_price INT NOT NULL
      );

      INSERT INTO User (username, email, password, points, completed_questions) VALUES 
      ('admin', 'a@a.com', '${hash}', 100, 20);

      INSERT INTO Reviews (review_amt, review_text, user_id) VALUES
      (5, 'Excellent', 1),
      (4, 'Amazing', 2),  
      (3, 'Good', 3);

      INSERT INTO SurveyQuestion (creator_id, question) VALUES 
      (1, 'Do you buy fruits from FC6?'),
      (1, 'Is the fried chicken at FC5 salty?'),
      (2, 'Did you recycled any e-waste?'),
      (2, 'Do you turn off lights and appliances when not in use?'),
      (2, 'Have you visit the cafe at Moberly?');

      INSERT INTO Seeds (seed_name, seed_type, growth_rate, growth_stage, seed_price) VALUES
      ('Sunflower', 'Flower', 3, 0, 45),
      ('Tomato', 'Vegetable', 5, 0, 100),
      ('Basil', 'Herb', 4, 0, 30),
      ('Lettuce', 'Vegetable', 2, 0, 20),
      ('Rose', 'Flower', 6, 0, 150),
      ('Carrot', 'Vegetable', 4, 0, 70),
      ('Mint', 'Herb', 3, 0, 40),
      ('Daisy', 'Flower', 3, 0, 60),
      ('Oak Tree', 'Tree', 1, 0, 200),
      ('Maple Tree', 'Tree', 1, 0, 0);
      `;

    pool.query(SQLSTATEMENT, (error, results, fields) => {
      if (error) {
        console.error("Error creating tables:", error);
      } else {
        console.log("Tables created successfully:", results);
      }
      process.exit();
    })
  }
});