const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/* ================= USER REGISTRATION ================= */

app.post("/register",(req,res)=>{

const {
full_name,
email,
phone,
age,
gender,
occupation,
address,
city,
state,
pincode
} = req.body;

const sql = `
INSERT INTO User
(full_name,email,phone,age,gender,occupation,address,city,state,pincode)
VALUES (?,?,?,?,?,?,?,?,?,?)
`;

db.query(sql,
[
full_name,
email,
phone,
age,
gender,
occupation,
address,
city,
state,
pincode
],
(err,result)=>{

if(err){
console.log(err);
res.send("Registration failed");
}else{
res.send("Registration successful");
}

});

});


/* ================= ADOPTION FORM ================= */

app.post("/adopt",(req,res)=>{

const {
full_name,
email,
phone,
age,
gender,
residence_type,
house_owned,
other_pets,
experience_level,
alone_hours,
reason_for_adoption,
daily_routine,
care_plan,
vet_support,
pet_id
} = req.body;


/* find user id */

const userQuery = "SELECT user_id FROM User WHERE email=?";

db.query(userQuery,[email],(err,result)=>{

if(err){
console.log(err);
return;
}

if(result.length === 0){
res.send("User not found. Please register first.");
return;
}

const user_id = result[0].user_id;


/* insert adoption application */

const applicationQuery = `
INSERT INTO AdoptionApplication
(user_id,pet_id,residence_type,house_owned,other_pets,
experience_level,hours_pet_alone,reason_for_adoption,
daily_routine,care_plan,vet_support,status)
VALUES (?,?,?,?,?,?,?,?,?,?,?,'Pending')
`;

db.query(applicationQuery,
[
user_id,
pet_id,
residence_type,
house_owned,
other_pets,
experience_level,
alone_hours,
reason_for_adoption,
daily_routine,
care_plan,
vet_support
],
(err,result)=>{

if(err){
console.log(err);
res.send("Application failed");
}else{
res.send("Adoption request submitted successfully");
}

});

});

});


/* ================= PET STATUS API ================= */

app.get("/pets",(req,res)=>{

const query = "SELECT pet_id,status FROM Pet";

db.query(query,(err,result)=>{

if(err){
console.log(err);
}else{
res.json(result);
}

});

});


app.listen(3000,()=>{
console.log("Server running on port 3000");
});