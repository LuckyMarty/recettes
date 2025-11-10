# Recipe App with MySQL Backend

A comprehensive recipe creation and management application with user authentication, search, filtering, and PDF export capabilities.

## Features

- User registration and authentication
- Recipe creation and editing with live preview
- Advanced search and filtering (cuisine, meal type, dietary restrictions, difficulty)
- Recipe sorting (by title, date created/updated)
- PDF export functionality
- Responsive design with mobile support
- Theme customization
- Drag-and-drop ingredient and step reordering

## Tech Stack

### Frontend
- React 18 with Vite
- CSS Modules with custom design system
- html2pdf.js for PDF generation

### Backend
- Node.js with Express
- MySQL database
- RESTful API with JSON responses

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up MySQL Database
Make sure MySQL is running on your system. On macOS with Homebrew:
```bash
brew services start mysql
```

Create the database:
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS recipe_app;"
```

If you have an existing database from a previous version, you may need to add the name column:
```bash
mysql -u root -e "USE recipe_app; ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL AFTER email;"
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=recipe_app

# Server Configuration
PORT=3001
```

### 4. Start the Application

#### Development Mode (Frontend + Backend)
```bash
npm run dev:full
```

#### Or run separately:
```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend dev server
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration (requires: name, email, password)
- `POST /api/auth/login` - User login (requires: email, password)

### Recipes
- `GET /api/users/:userId/recipes` - Get user's recipes
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

## Database Schema

### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Recipes Table
```sql
CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  servings VARCHAR(50),
  prep_time VARCHAR(50),
  cook_time VARCHAR(50),
  ingredients JSON,
  steps JSON,
  image TEXT,
  tags JSON,
  cuisine VARCHAR(100),
  meal_type VARCHAR(100),
  dietary VARCHAR(100),
  difficulty VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Development

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure
```
src/
├── components/          # React components
│   ├── Auth.jsx        # Authentication forms
│   ├── Profile.jsx     # User dashboard
│   ├── RecipeEditor.jsx # Recipe creation/editing
│   ├── RecipePreview.jsx # Recipe display
│   └── SearchBar.jsx   # Search component
├── App.jsx             # Main application component
└── styles.css          # Global styles

server.js               # Express backend server
.env                    # Environment configuration
```

## Features in Detail

### Recipe Management
- Create recipes with ingredients, steps, and metadata
- Live preview while editing
- Save recipes to database
- Search and filter recipes
- Sort by various criteria
- Export to PDF

### User Experience
- Responsive design for mobile and desktop
- Intuitive drag-and-drop interface
- Real-time search and filtering
- Theme customization
- Clean, modern UI with French localization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
