# E-Commerce Platform

A full-featured e-commerce platform built with Angular, Python, and MongoDB.

## Technologies Used

### Frontend
- Angular 16+
- Tailwind CSS
- Material-UI (Admin Panel)

### Backend
- Python
- MongoDB with Mongoose
- JWT Authentication
- GraphQL (Optional)
- Stripe & PayPal Integration

### Storage & Services
- AWS S3/Cloudinary for file storage
- Nodemailer for email notifications

## Project Structure
```
├── frontend/           # Angular frontend application
├── admin/             # Angular admin panel
├── backend/           # Python backend server
├── docs/              # Documentation
└── docker/            # Docker configuration files
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB
- Angular CLI

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Install admin panel dependencies:
   ```bash
   cd admin
   npm install
   ```

### Environment Setup
Create `.env` files in both frontend and backend directories using the provided `.env.example` templates.

### Running the Application
1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```
2. Start the frontend application:
   ```bash
   cd frontend
   ng serve
   ```
3. Start the admin panel:
   ```bash
   cd admin
   ng serve --port 4201
   ```

## Features

### Customer Features
- User authentication and authorization
- Product browsing and search
- Shopping cart management
- Secure checkout process
- Order tracking
- User profile management
- Wishlist functionality

### Admin Features
- Dashboard with analytics
- Product management
- Order management
- User management
- Content management
- Settings configuration
- SEO management
- Banner and offer management

## Security
- JWT based authentication
- Secure payment processing
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
