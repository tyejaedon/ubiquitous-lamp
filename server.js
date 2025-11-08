require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const e = require("cors");




function decodeAndVerifyToken(token, secretKey) {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, secretKey);
    return decoded; // Returns payload (user details, expiration, etc.)
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
}

function getTokenFromHeader(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1]; // Extract token after "Bearer "
  }
  return null; // No valid token found
}






const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname); // Saves with the original filename
  }
});

const upload = multer({ storage });

app.get("/api/auth/check-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }
    res.status(200).json({ message: "Token is valid" });
  });
});


  const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "JWT token has expired", expired: true });
        }
        return res.status(403).json({ message: "Invalid token", expired: false });
      }
  ;

        req.userId = user.userId; // Ensure userId is extracted
        next();
    });
};
function getUserIdFromToken(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
  if (!token) return null;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded); // Debugging output
      return decoded.userId;  // Assuming the token payload contains { id: user.id }
  } catch (err) {
      console.error("Token verification failed:", err);
      return null;
  }
}
const checkAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
}
const id = getUserIdFromToken(req);
console.log(id);
const sql = "SELECT role FROM User WHERE id = ?";
pool.query(sql, [id], (err, results) => {
    if (err) {
        console.error("Role check error:", err);
        return res.status(500).json({ message: "Role check failed" });
    }

    if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin only" });
    }

    next();
});




};
const allowedOrigins = [
  "https://localhost:5173",       // local dev
  "https://localhost:3000",
  "https://localhost:5000",
  "https://tyjaedon.me",         // live domain
  "https://www.tyjaedon.me",     // www domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Match subdomains if needed (optional but helpful)
      const isAllowed = allowedOrigins.includes(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked:", origin);
        callback(new Error("CORS policy: Not allowed by server"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


if (!process.env.JWT_SECRET) {
    console.error("❌ Missing JWT_SECRET in .env file");
    process.exit(1);
}
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  };

// Debugging: Check if environment variables are loaded
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

// ✅ Database Connection (Using createPool correctly)
const pool = mysql.createPool({
  connectionLimit: 10, // Max number of connections
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


// ✅ Properly Check MySQL Connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database ✅");
    connection.release(); // Release the connection back to the pool
  }
});
pool.on("error", (err) => {
    console.error("MySQL Pool Error:", err);
  });

// ✅ Sample Route
app.get("/api", (req, res) => {
  res.send("CMI Donation API is Running 🚀");
});


const checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
      const checkEmailSql = "SELECT email FROM User WHERE email = ?";
      pool.query(checkEmailSql, [email], (err, results) => {
        if (err) return reject(err); // Handle DB error
        resolve(results.length > 0); // true if email exists, false otherwise
      });
    });
  };
// ✅ SIGNUP Route
app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }
  
      // Insert new user
      const userSql =
        "INSERT INTO User (first_name, last_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?, ?)";
      pool.query(
        userSql,
        [firstName, lastName, email, phone, hashedPassword, "user"],
        (err, result) => {
          if (err) {
            console.error("Signup error:", err);
            return res.status(500).json({ message: "Signup failed" });
          }
  
          const userId = result.insertId; // Get the newly inserted user's ID
          const token = generateToken(userId);
  
          // Insert default profile
          const profileSql = "INSERT INTO profile (user_id) VALUES (?)";
          pool.query(profileSql, [userId], (profileErr) => {
            if (profileErr) {
              console.error("Profile creation error:", profileErr);
            }
  
            // ✅ Send response with user details & token
            res.status(201).json({
              message: "User registered successfully",
              token,
              user: {
                id: userId,
                firstName,
                lastName,
                email,
                phone,
                role: "user",
              },
            });
          });
        }
      );
    } catch (error) {
      console.error("Hashing error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
//login
  
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
  
    const sql = "SELECT id, first_name, last_name, email, role, password FROM User WHERE email = ?";
    pool.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const user = results[0];
      if (user.role !== "user") {
        const passwordMatch = password === user.password;
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
      }else{
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
      }
  
     
  
      const token = generateToken(user.id);
      console.log(token)
  
      // ✅ Return user details and token in a single response
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
        },
      });
    });
  });
  
  
  //profile 
  app.get("/api/profile", authenticateToken, async (req, res) => {
    const userId = getUserIdFromToken(req);
    const userSql = "SELECT * FROM User WHERE id = ?";
    const profileSql = "SELECT * FROM profile WHERE user_id = ?";
    console.log(userId);

    pool.query(userSql, [userId], (err, userResults) => {
        if (err) {
            console.error("User fetch error:", err);
            return res.status(500).json({ message: "Failed to retrieve user data" });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userResults[0];

        pool.query(profileSql, [userId], (err, profileResults) => {
            if (err) {
                console.error("Profile fetch error:", err);
                return res.status(500).json({ message: "Failed to retrieve profile" });
            }

            if (profileResults.length === 0) {
                return res.status(404).json({ message: "Profile not found" });
            }

            let profile = profileResults[0];
            if (profile.profile_image !==  null){
              profile.profile_image = 'https://tyjaedon.me' + profile.profile_image;
            }
           

            profile = {
                id: profile.id,
                user_id: profile.user_id,
                total_donations: profile.total_donations || 0.00,
                achievements: profile.achievements || "N/A",
                profile_image: profile.profile_image || null,
                created_at: profile.created_at,
            };

            res.status(200).json({
                message: "Profile retrieved successfully",
                user,
                profile,
            });
        });
    });
});

// Route for multiple file uploads



app.post("/api/profile/update", authenticateToken, upload.single('profilePhoto'), (req, res) => {
  const userId = getUserIdFromToken(req);
const jsonData = req.body.jsonData ? JSON.parse(req.body.jsonData) : null;
let  firstName, lastName, phone;
if (jsonData) {
  firstName = jsonData.firstName;
  lastName = jsonData.lastName;
  phone = jsonData.phone;
}
  


   
    console.log(req.body);
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;


    let userUpdates = [];
    let userValues = [];

    if (firstName) {
        userUpdates.push("first_name = ?");
        userValues.push(firstName);
    }
    if (lastName) {
        userUpdates.push("last_name = ?");
        userValues.push(lastName);
    }
    if (phone) {
        userUpdates.push("phone_number = ?");
        userValues.push(phone);
    }

    userValues.push(userId); // Add userId at the end
console.log(userValues);

    const updateUserQuery = userUpdates.length
        ? `UPDATE User SET ${userUpdates.join(", ")} WHERE id = ?`
        : null;

      // Only update the profile image if a file is provided
const updateProfileQuery = profileImage
? `UPDATE profile SET profile_image = ? WHERE user_id = ?`
: null;

console.log(updateUserQuery);
const promise1 = new Promise((resolve, reject) => {
    if (updateUserQuery) {
        pool.query(updateUserQuery, userValues, (err) => {
            if (err) {
                console.error("User update error:", err);
                reject(err);
                return res.status(500).json({ message: "Failed to update user details" });
            }
            resolve(true);
        });
        

    } 
  });
  const promise2 = new Promise((resolve, reject) => {
     if (updateProfileQuery) {
        pool.query(updateProfileQuery, [profileImage, userId], (err) => {
            if (err) {
                console.error("Profile image update error:", err);
                reject(err);
                return res.status(500).json({ message: "Failed to update profile image" });
            }
           resolve(true);
        });

    } 
});
Promise.any([promise1, promise2])
  .then(result => {
    console.log(result); // 'Third'
    res.status(200).json({ message: "Profile updated successfully" });
  })
  .catch(error => {
    console.error(error); // All promises rejected
  res.status(500).json({ message: "Failed to update profile" });
  });
}

);
app.get('/api/organisations', (req, res) => {
  pool.query('SELECT * FROM organisation', (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching organisations', error: err });
      }
      res.json(results);
  });
});
app.post('/api/organisations', checkAdmin, upload.single('org_photo'), (req, res) => {
  let name, usage_of_funds, amount_raised, summary;
  const jsonData = req.body.jsonData ? JSON.parse(req.body.jsonData) : null;

  if (jsonData) {
      name = jsonData.name;
      usage_of_funds = jsonData.usage_of_funds;
      amount_raised = jsonData.amount_raised;
      summary = jsonData.summary;
  }

  const org_photo = req.file ? req.file.path : null;  // Get the path of the uploaded image

  if (!org_photo) {
      return res.status(400).json({ message: 'Organisation photo is required' });
  }

  const query = 'INSERT INTO organisation (name, usage_of_funds, amount_raised, summary, org_photo) VALUES (?, ?, ?, ?, ?)';
  
  pool.query(query, [name, usage_of_funds, amount_raised, summary, org_photo], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error adding organisation', error: err });
      }
      res.json({ message: 'Organisation added successfully', id: results.insertId });
  });
});

app.put('/api/organisations/:id', checkAdmin, upload.single('org_photo'), (req, res) => {
  const { id } = req.params;
  let name, usage_of_funds, amount_raised, summary;
  
  // Parse JSON data sent in the body
  const jsonData = req.body.jsonData ? JSON.parse(req.body.jsonData) : null;

  if (jsonData) {
      name = jsonData.name;
      usage_of_funds = jsonData.usage_of_funds;
      amount_raised = jsonData.amount_raised;
      summary = jsonData.summary;
  }

  // Get the path of the uploaded photo if it exists
  const org_photo = req.file ? req.file.path : null; 

  // Prepare the query to update the organisation
  const query = 'UPDATE organisation SET name = ?, usage_of_funds = ?, amount_raised = ?, summary = ?, org_photo = ? WHERE id = ?';

  // If no photo is uploaded, pass the existing `org_photo` as null to keep the current photo
  pool.query(query, [name, usage_of_funds, amount_raised, summary, org_photo, id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error updating organisation', error: err });
      }
      res.json({ message: 'Organisation updated successfully' });
  });
});
app.delete('/api/organisations/:id', checkAdmin, (req, res) => {
  const { id } = req.body;

  const query = 'DELETE FROM organisation WHERE id = ?';
  pool.query(query, [id], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Error deleting organisation', error: err });
      }
      res.json({ message: 'Organisation deleted successfully' });
  });
});


app.get('/api/cmi', (req, res) => {
  pool.query('SELECT * FROM cmi', (err, results) => {
      if (err) {
          console.error('Error fetching CMI records:', err);
          return res.status(500).json({ message: 'Error fetching CMI records' });
      }
      res.json(results);
  });
});
app.get("/api/donation-progress", async (req, res) => {
  try {
    const query = `SELECT donation_total, goal FROM cmi LIMIT 1;`;
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching donation progress:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: "No donation data found" });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Route to add a new CMI record
app.post('/api/cmi', (req, res) => {
  const { mpesa_info, donation_total, goal } = req.body;
  const query = 'INSERT INTO cmi (mpesa_info, donation_total, goal, created_at) VALUES (?, ?, ?, NOW())';
  pool.query(query, [mpesa_info, donation_total, goal], (err, result) => {
      if (err) {
          console.error('Error adding CMI record:', err);
          return res.status(500).json({ message: 'Error adding CMI record' });
      }
      res.status(201).json({ message: 'CMI record added successfully' });
  });
});

// Route to delete a CMI record by ID
app.put('/api/cmi/:id', (req, res) => {
  const { id } = req.params;
  const { donation_total, goal } = req.body;

  const query = `
    UPDATE cmi 
    SET donation_total = ?, goal = ? 
    WHERE id = ?`;

  pool.query(query, [donation_total, goal, id], (err, result) => {
    if (err) {
      console.error('Error updating CMI record:', err);
      return res.status(500).json({ message: 'Error updating CMI record' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'CMI record not found' });
    }
    res.json({ message: 'CMI record updated successfully' });
  });
});


// POST API to add a donation
app.post("/api/donate", (req, res) => {
  let { user_id, organization_id, amount } = req.body;

  if (!organization_id || !amount) {
    return res.status(400).json({ error: "Organization ID and amount are required." });
  }

  // Ensure user_id is either a valid number or NULL
  user_id = user_id ? user_id : null;

  const query = `
    INSERT INTO donations (user_id, organization_id, amount, donated_at) 
    VALUES (?, ?, ?, NOW())`;

  pool.query(query, [user_id, organization_id, amount], (err, result) => {
    if (err) {
      console.error("Error inserting donation:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "Donation recorded successfully!", donation_id: result.insertId });
  });
});



app.get("/api/user",authenticateToken ,(req, res) => {
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "SELECT id, first_name, last_name, phone_number, email FROM user WHERE id = ?";

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(results[0]); // Return the user object
  });
});

app.get("/api/donations",authenticateToken, (req, res) => {
  const user_id  = getUserIdFromToken(req);
  console.log(user_id);
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
    SELECT 
      d.*, 
      o.name AS organisation_name, 
      o.usage_of_funds 
    FROM donations d
    JOIN organisation o ON d.organization_id = o.id
    WHERE d.user_id = ? 
    ORDER BY d.donated_at DESC`;

  pool.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user donations:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});
// GET: Fetch all donations (Admin only)
app.get("/api/admin/donations", checkAdmin, (req, res) => {


  const query = `
    SELECT 
      d.*, 
      u.first_name AS donor_name, 
      o.name AS organisation_name 
    FROM donations d
    JOIN user u ON d.user_id = u.id
    JOIN organisation o ON d.organization_id = o.id
    ORDER BY d.donated_at DESC`;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching donations:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// POST: Update donation status (Admin only)
app.post("/api/admin/donations", checkAdmin, (req, res) => {
 

  const { donation_id, status } = req.body;

  if (!donation_id || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updateQuery = `UPDATE donations SET status = ? WHERE id = ?`;

  pool.query(updateQuery, [status, donation_id], (err, results) => {
    if (err) {
      console.error("Error updating donation status:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Donation status updated successfully" });
  });
});

app.post("/api/admin/update-donations", checkAdmin, (req, res) => {
  const query = `
    UPDATE organisation o
    JOIN (
        SELECT organization_id, SUM(amount) AS total_donations
        FROM donations
        WHERE status = 'approved'
        GROUP BY organization_id
    ) d ON o.id = d.organization_id
    SET o.amount_raised = d.total_donations
    WHERE o.id IN (SELECT DISTINCT organization_id FROM donations WHERE status = 'approved');
  `;
  const query2 = `
    UPDATE cmi 
SET donation_total = (
    SELECT SUM(amount_raised) 
    FROM organisation
);
  `;


  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error updating donation totals:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    pool.query(query2, (err, result) => {
      if (err) {
        console.error("Error updating donation totals:", err);
        return res.status(500).json({ error: "Database update failed" });
      }
    });
    res.json({ message: "Donation totals updated successfully" });
  });
});

  


// Serve static files React build folder
// Correctly serve the static files from the build output
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve index.html for React Router
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});



// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
