const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const Yup = require("yup");
const pool = require("../db.js");
const bcrypt = require("bcrypt");




// logging in users with bcrypt and session cookies
router
.route('/login')
.get(async(req,res)=>{
  if(req.session.user && req.session.user.username){
    res.json({loggedIn:true,username:req.session.user.username})
  }else{
    res.json({loggedIn:false})
  }
})
.post(async (req, res) => {
  validateForm(req, res);

  const verifiedLogin = await pool.query(
    "SELECT id, username, password FROM users WHERE username = $1;",
    [req.body.username]
  );

  if (verifiedLogin.rowCount > 0) {
    const checkPass = await bcrypt.compare(
      req.body.password,
      verifiedLogin.rows[0].password
    );
    if (checkPass) {
      req.session.user = {
        username: req.body.username,
        id: verifiedLogin.rows[0].id,
      };
      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password" });
    }
  } else {
    res.json({ loggedIn: false, status: "Wrong username or password" });
  }
});





// signing up users with bcrypt and session cookies
router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const existingUser = await pool.query(
    "SELECT  username FROM users WHERE username = $1;",
    [req.body.username]
  );
  

  if (existingUser.rowCount === 0) {
    //register
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id,username;",
      [req.body.username, hashedPassword]
    );
    req.session.user = {
      username: req.body.username,
      id: newUser.rows[0].id,
    };
    res.json({ loggedIn: true, message: "User created!", status: "success",username:req.body.username });
  } else {
    res.json({
      loggedIn: false,
      message: "User already exists!",
      status: "user name taken",
    });
  }
});

module.exports = router;
