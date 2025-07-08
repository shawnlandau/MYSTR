# Real Estate Portfolio Tracker

A full-stack web application for tracking personal real estate investments, built with React, Node.js, and PostgreSQL.

## Features

- **Dashboard**: Portfolio overview with charts for cash flow, property performance, and depreciation
- **Property Management**: Add, edit, and delete properties with detailed financial information
- **Transaction Tracking**: Log income and expenses by property with categorization
- **Depreciation Tracking**: Manual input of straight-line and bonus depreciation for tax purposes
- **Responsive Design**: Clean, modern UI that works on desktop and mobile
- **PWA Support**: Progressive Web App with offline capabilities

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Chart.js for data visualization
- Lucide React for icons
- React Router for navigation

### Backend
- Node.js with Express
- PostgreSQL database
- RESTful API architecture
- CORS and security middleware

### Deployment
- Render.com hosting
- PostgreSQL managed database
- Static site hosting for frontend

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-portfolio-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your database credentials
   DATABASE_URL=postgresql://username:password@localhost:5432/real_estate_db
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run dev:backend  # Backend on http://localhost:5000
   npm run dev:frontend # Frontend on http://localhost:5173
   ```

## Database Schema

### Properties Table
- `id` (SERIAL PRIMARY KEY)
- `address` (VARCHAR)
- `property_type` (VARCHAR)
- `purchase_price` (DECIMAL)
- `current_value` (DECIMAL)
- `monthly_rent` (DECIMAL)
- `annual_taxes` (DECIMAL)
- `annual_insurance` (DECIMAL)
- `hoa_fees` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Transactions Table
- `id` (SERIAL PRIMARY KEY)
- `property_id` (INTEGER, FOREIGN KEY)
- `type` (VARCHAR - 'income' or 'expense')
- `category` (VARCHAR)
- `amount` (DECIMAL)
- `description` (TEXT)
- `date` (DATE)
- `created_at` (TIMESTAMP)

### Depreciation Table
- `id` (SERIAL PRIMARY KEY)
- `property_id` (INTEGER, FOREIGN KEY)
- `year` (INTEGER)
- `straight_line` (DECIMAL)
- `bonus_depreciation` (DECIMAL)
- `total_depreciation` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/property/:propertyId` - Get transactions by property
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Depreciation
- `GET /api/depreciation` - Get all depreciation records
- `GET /api/depreciation/property/:propertyId` - Get depreciation by property
- `POST /api/depreciation` - Create depreciation record
- `PUT /api/depreciation/:id` - Update depreciation record
- `DELETE /api/depreciation/:id` - Delete depreciation record

### Dashboard
- `GET /api/dashboard/overview` - Get portfolio overview
- `GET /api/dashboard/property-performance` - Get property performance data
- `GET /api/dashboard/monthly-cashflow` - Get monthly cash flow data
- `GET /api/dashboard/depreciation-chart` - Get depreciation chart data

## Deployment on Render

1. **Connect your repository to Render**
   - Create a new account on [Render.com](https://render.com)
   - Connect your GitHub repository

2. **Deploy using render.yaml**
   - Render will automatically detect the `render.yaml` file
   - It will create the database and both services automatically

3. **Environment Variables**
   - The database connection string is automatically provided
   - Update the frontend API URL in the render.yaml if needed

## Security Features

- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Input validation
- SQL injection protection via parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for personal use only. No commercial use without permission.

## Support

For issues or questions, please create an issue in the repository. 