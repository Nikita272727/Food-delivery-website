const express = require('express');
const path = require('path');
const mysql2 = require('mysql2');
const app = express();

const database = mysql2.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Abhijeet@123",
    database: "foodie"  
});

database.connect((error) => {
    if (error) {
        return console.log(error);
    }
    console.log("MySQL database is connected...");
});


// signup to DataBase
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve homepage (sign up page)
app.get('/signup', (req, res) => {
    const htmlfile = path.join(__dirname, 'views', 'signup.html');
    res.sendFile(htmlfile);
});

// Sign-up handler
app.post('/handleform', (req, res) => {
    try {
        const { username, email, password } = req.body;
        const SQL_COMMAND = "INSERT INTO customer(username, email, password) VALUES (?, ?, ?)";
        database.query(SQL_COMMAND, [username, email, password], (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Registration unsuccessful");
            }
            console.log(result);
            // res.send("Registration successful");
            res.redirect("/homepage.html");
        });
    } catch (err) {
        console.error(err);
        res.send("Registration unsuccessful");
        
    }
});


// login to DataBase
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// ✅ Login handler
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const SQL_COMMAND = "SELECT * FROM customer WHERE username = ? AND password = ?";
    database.query(SQL_COMMAND, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.send("Login error");
        }
        if (results.length > 0) {
            res.redirect("/homepage.html");
        } else {
            res.send("Invalid username or password");
            
        }
    });
});


// homepage to Resturants
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

app.post('/home', (req, res) => {
    if (results.length > 0) {
        res.redirect("/fastrestaurant.html");
    }
});


// homepage to Orderpage
app.use(express.static(path.join(__dirname, 'public')));

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

app.post('/order', (req, res) => {
    if (results.length > 0) {
        res.redirect("/fastrestaurant.html");
    }
});


//Resturants to Orderpage
app.use(express.static(path.join(__dirname, 'public')));

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fastrestaurant.html'));
});

app.post('/order', (req, res) => {
    if (results.length > 0) {
        res.redirect("/order.html");
    }
});

// navbar
app.use(express.static(path.join(__dirname, 'public')));

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fastrestaurant.html'));
});

app.post('/order', (req, res) => {
    if (results.length > 0) {
        res.redirect("/order.html");
    }
});

// login to signup
app.use(express.static(path.join(__dirname, 'views')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});


app.post('/login', (req, res) => {
    if (results.length > 0) {
        res.redirect("/signup.html");
    }
});

// orderpage to DataBase
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/order', (req, res) => {
    const htmlfile = path.join(__dirname, 'views', 'order.html');
    res.sendFile(htmlfile);
});

app.post('/orders', (req, res) => {
    try {
        const { phone, address} = req.body;
        const SQL_COMMAND = "INSERT INTO placed(phone, address ) VALUES (?, ?)";
        database.query(SQL_COMMAND, [phone, address ], (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Registration unsuccessful");
            }
            console.log(result);
            res.redirect("/payment.html");
            // res.alert("order placed");
        });
    } catch (err) {
        console.error(err);
        res.send("Registration unsuccessful");
    }
});

// this is payment database
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/payment', (req, res) => {
    const htmlfile = path.join(__dirname, 'views', 'payment.html');
    res.sendFile(htmlfile);
});

app.post('/submit', (req, res) => {
    try {
        const { full_name,email,payment_method,card_number,expiry_date,cvv,upi_id,bank,cod} = req.body;
        const SQL_COMMAND = "INSERT INTO payment(full_name,email,payment_method,card_number,expiry_date,cvv,upi_id,bank,cod) VALUES (?,?,?,?,?,?,?,?,?)";
        database.query(SQL_COMMAND, [full_name,email,payment_method,card_number,expiry_date,cvv,upi_id,bank,cod], (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Registration unsuccessful");
            }
            console.log(result);
            res.redirect("/last.html");
            // res.alert("order placed");
        });
    } catch (err) {
        console.error(err);
        res.send("Registration unsuccessful");
    }
});

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});

