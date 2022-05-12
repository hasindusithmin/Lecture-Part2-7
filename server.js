var express = require("express");
var app = express();
var db = require("./database.js");
var bodyParser = require("body-parser");
const { request, response } = require("express");
const res = require("express/lib/response");
var cors = require("cors")
app.use(bodyParser.json());
app.use(cors())
let HTTP_PORT = 8080;

app.listen(HTTP_PORT, () => {
    console.log("Server is running on %PORT%".replace("%PORT%", HTTP_PORT))
});

app.post("/api/customer/", (req, res, next) => {

    try {
        var errors = []

        if (!req.body) {
            errors.push("An invalid input");
        }

        const {
            name,
            address,
            email,
            dateOfBirth,
            gender,
            age,
            cardHolderName,
            cardNumber,
            expirytDate,
            cvv,
            timeStamp
        } = req.body;

        var sql = 'INSERT INTO customer (name,address,email,dateOfBirth,gender,age,cardHolderName,cardNumber,expirytDate,cvv,timeStamp) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
        var params = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expirytDate, cvv, timeStamp]
        db.run(sql, params, function (err, result) {

            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            } else {
                res.json({
                    "message": "success",
                    "data": req.body,
                    "id": this.lastID
                })
            }

        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.get("/api/customer", (req, res, next) => {

    try {
        var sql = "select * from customer"
        var params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (E) {
        res.status(400).send(E);
    }
});

app.put("/api/customer/:id", (req, res, next) => {
    const id = req.params.id;
    const {
        name,
        address,
        email,
        dateOfBirth,
        gender,
        age,
        cardHolderName,
        cardNumber,
        expirytDate,
        cvv,
        timeStamp
    } = req.body;

    db.run(`UPDATE customer set name = ?, address = ?, email = ?, dateOfBirth = ?,gender=?,age=?,cardHolderName=?,cardNumber=?,expirytDate=?,cvv=?,timeStamp=? WHERE id = ?`,
        [name,address,email,dateOfBirth,gender,age,cardHolderName,cardNumber,expirytDate,cvv,timeStamp, id], function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(200).json({ updated: this.changes });
        });
});

app.delete("/api/customer/delete/:id", (req, res, next) => {
    try {
        db.run('DELETE FROM customer WHERE id = ?',
            req.params.id,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", rows: this.changes })
            });
    } catch (E) {
        res.status(400).send(E)
    }

});