const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Helper function to safely parse JSON
function safeJsonParse(str, defaultValue = []) {
  if (Array.isArray(str)) return str;
  if (!str || str === 'undefined' || str === 'null') return defaultValue;
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload limit for images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection (use a pool to avoid "closed connection" errors)
let db;

async function initializeDatabase() {
  try {
    // Use a pool so connections are managed and recreated when needed
    db = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'recipe_app',
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONN_LIMIT || '10', 10),
      queueLimit: 0
    });

    console.log('Initialized MySQL connection pool');

    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  try {
    // Users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Recipes table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        servings VARCHAR(50),
        prep_time VARCHAR(50),
        cook_time VARCHAR(50),
        ingredients JSON,
        steps JSON,
        image LONGTEXT,
        tags JSON,
        cuisine VARCHAR(100),
        meal_type VARCHAR(100),
        dietary VARCHAR(100),
        difficulty VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Ensure image column can handle large data
    await db.execute(`
      ALTER TABLE recipes MODIFY COLUMN image LONGTEXT
    `).catch(err => {
      // Ignore error if column is already LONGTEXT
      if (!err.message.includes('same type')) {
        console.warn('Could not modify image column:', err.message);
      }
    });

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "L'utilisateur existe déjà" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
      [email, name, hashedPassword]
    );

    res.json({ id: result.insertId, email, name });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: "L'inscription a échoué" });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const user = users[0];

    // Compare password with hash
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "La connexion a échoué" });
  }
});

// Get user recipes
app.get('/api/users/:userId/recipes', async (req, res) => {
  try {
    const { userId } = req.params;

    const [recipes] = await db.execute(
      'SELECT * FROM recipes WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );

    console.log('Raw recipes from DB:', recipes.map(r => ({ id: r.id, ingredients: r.ingredients, steps: r.steps, tags: r.tags })))

    // Parse JSON fields
    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: safeJsonParse(recipe.ingredients),
      steps: safeJsonParse(recipe.steps),
      tags: safeJsonParse(recipe.tags)
    }));

    console.log('Returning recipes with parsed data:', formattedRecipes.map(r => ({ id: r.id, ingredients: r.ingredients, steps: r.steps, tags: r.tags })))

    res.json(formattedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: "Échec de la récupération des recettes" });
  }
});

// Create recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const {
      user_id,
      title,
      subtitle,
      servings,
      prep_time,
      cook_time,
      ingredients,
      steps,
      image,
      tags,
      cuisine,
      meal_type,
      dietary,
      difficulty
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO recipes (
        user_id, title, subtitle, servings, prep_time, cook_time,
        ingredients, steps, image, tags, cuisine, meal_type, dietary, difficulty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id, title, subtitle, servings, prep_time, cook_time,
      JSON.stringify(ingredients), JSON.stringify(steps), image,
      JSON.stringify(tags), cuisine, meal_type, dietary, difficulty
    ].map(val => val === undefined ? null : val));

    res.json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: "Échec de la création de la recette" });
  }
});

// Update recipe
app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      servings,
      prep_time,
      cook_time,
      ingredients,
      steps,
      image,
      tags,
      cuisine,
      meal_type,
      dietary,
      difficulty
    } = req.body;

    await db.execute(`
      UPDATE recipes SET
        title = ?, subtitle = ?, servings = ?, prep_time = ?, cook_time = ?,
        ingredients = ?, steps = ?, image = ?, tags = ?,
        cuisine = ?, meal_type = ?, dietary = ?, difficulty = ?
      WHERE id = ?
    `, [
      title, subtitle, servings, prep_time, cook_time,
      JSON.stringify(ingredients), JSON.stringify(steps), image,
      JSON.stringify(tags), cuisine, meal_type, dietary, difficulty, id
    ].map(val => val === undefined ? null : val));

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: "Échec de la mise à jour de la recette" });
  }
});

// Delete recipe
app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM recipes WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: "Échec de la suppression de la recette" });
  }
});

// Start server
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();