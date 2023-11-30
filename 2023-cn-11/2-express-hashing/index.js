// const express = require("express");
// const session = require("express-session");
// const path = require("path");
// const sqlite3 = require("sqlite3").verbose();
// const crypto = require("crypto");
// const app = express();
// const port = 3000;

// // Middleware
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Session configuration
// app.use(
//   session({
//     secret: "YourSecretKey",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // Set to true if using https
//       maxAge: 3600000 // Session max age in milliseconds
//     }
//   })
// );

// // SQLite database setup
// const db = new sqlite3.Database("./db.sqlite", (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the SQLite database.');
// });

// // Create users table if it doesn't exist
// db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

// // Function to add user to the database
// const addUserToDatabase = (username, password) => {
//   const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
//   db.run(sql, [username, password], (err) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     console.log(`A new user has been added: ${username}`);
//   });
// };

// // Function to get user by username
// const getUserByUsername = (username) => {
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT * FROM users WHERE username = ?`;
//     db.get(sql, [username], (err, row) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(row);
//       }
//     });
//   });
// };

// // Function to hash password
// const hashPassword = (password) => {
//   const hash = crypto.createHash('sha256');
//   hash.update(password);
//   return hash.digest('hex');
// };

// // Routes
// // Home route
// app.get("/", (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect("/dashboard");
//   } else {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   }
// });

// // Dashboard route
// app.get("/dashboard", (req, res) => {
//   if (req.session.loggedIn) {
//     res.sendFile(path.join(__dirname, "public", "dashboard.html"));
//   } else {
//     res.redirect("/");
//   }
// });

// // Signup route
// app.get("/signup", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "signup.html"));
// });

// // Signup form submission
// // Signup form submission
// app.post("/signup", async (req, res) => {
//   try {
//     const user = await getUserByUsername(req.body.username);
//     if (user) {
//       return res.send("Username already exists");
//     }
//     const hashedPassword = hashPassword(req.body.password);
//     addUserToDatabase(req.body.username, hashedPassword);

//     // Redirect to login page or show a success message
//     // res.redirect("/"); // Redirect to login page
//     res.send("Signup successful. Please <a href='/'>login</a>."); // Show success message with login link
//   } catch (error) {
//     res.status(500).send("Error processing your request");
//   }
// });

// // Login form submission
// app.post("/authenticate", async (req, res) => {
//   try {
//     const user = await getUserByUsername(req.body.username);
//     if (!user) {
//       return res.status(401).send("User not found");
//     }
//     const hashedPassword = hashPassword(req.body.password);
//     if (hashedPassword === user.password) {
//       req.session.loggedIn = true;
//       req.session.username = user.username;
//       res.redirect("/dashboard");
//     } else {
//       res.status(401).send("Incorrect password");
//     }
//   } catch (error) {
//     res.status(500).send("Error processing your request");
//   }
// });

// // Logout route
// app.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


const express = require("express");
const session = require("express-session");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: "YourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using https
      maxAge: 3600000 // Session max age in milliseconds
    }
  })
);

// SQLite database setup
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create users table if it doesn't exist
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");

// Function to add user to the database
const addUserToDatabase = (username, password) => {
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, password], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`A new user has been added: ${username}`);
  });
};

// Function to get user by username
const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Function to hash password
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};

// Routes
// Home route
app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/");
  }
});

// Signup route
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Signup form submission
app.post("/signup", async (req, res) => {
  try {
    const user = await getUserByUsername(req.body.username);
    if (user) {
      return res.send("Username already exists");
    }
    const hashedPassword = hashPassword(req.body.password);
    addUserToDatabase(req.body.username, hashedPassword);

    // Send a confirmation message
    res.send("User created successfully.");
  } catch (error) {
    res.status(500).send("Error processing your request");
  }
});

// Login form submission
app.post("/authenticate", async (req, res) => {
  try {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
      return res.status(401).send("User not found");
    }
    const hashedPassword = hashPassword(req.body.password);
    if (hashedPassword === user.password) {
      req.session.loggedIn = true;
      req.session.username = user.username;
      res.redirect("/dashboard");
    } else {
      res.status(401).send("Incorrect password");
    }
  } catch (error) {
    res.status(500).send("Error processing your request");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
