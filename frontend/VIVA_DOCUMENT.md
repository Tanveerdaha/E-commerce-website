# Viva Documentation: Northstar Store Frontend

## 1. Project Title
Northstar Store Frontend

## 2. Introduction
This project is a modern e-commerce frontend application developed using React, Vite, React Router, and Context API. It provides users with a smooth shopping experience by allowing them to browse products, view product details, add items to a cart, save favorites in a wishlist, and navigate through a polished interface.

## 3. Objective of the Project
The main objective of this project is to demonstrate:
- front-end e-commerce website development
- state management using React Context API
- dynamic routing with React Router
- reusable component architecture
- responsive and animated UI design

## 4. Problem Statement
Traditional online shopping experiences require a user-friendly interface for browsing products, managing selected items, and tracking preferences. This project solves that by creating a simple yet attractive shopping platform where users can explore products, manage cart items, and save wishlist products without needing a backend.

## 5. Features Implemented
### Core Features
- Home page with hero section and featured products
- Product listing page
- Search, category filtering, and sorting
- Product detail page
- Add to cart functionality
- Wishlist management
- Cart drawer with quantity updates and subtotal calculation
- Login page and 404 page
- Smooth animations using Framer Motion

### User Experience Features
- Responsive design for desktop and mobile screens
- Modern UI styling with cards, buttons, and soft shadows
- Animated transitions between pages
- Clear navigation and cart/wishlist indicators

## 6. Technology Stack
- React.js for UI development
- Vite for fast project bundling
- React Router DOM for page navigation
- Framer Motion for animations
- React Icons for icons
- CSS for styling

## 7. Project Structure
- src/App.jsx: Main app layout and routing setup
- src/main.jsx: Application entry point
- src/context/StoreContext.jsx: Shared cart, wishlist, and drawer state
- src/components/: Reusable UI components such as Navbar, Footer, ProductCard, CartDrawer
- src/pages/: Page components for Home, Products, ProductDetails, Cart, Wishlist, Login, and NotFound
- src/data/products.js: Static product dataset
- src/index.css: Global styling

## 8. Working of the Project
### Step-by-step Flow
1. The app starts from the main entry file and renders the root component.
2. The App component wraps the entire application inside a StoreProvider so all components can access shared shopping state.
3. BrowserRouter enables navigation between pages.
4. The Navbar shows navigation links, cart count, and wishlist count.
5. On the Home page, users can view featured products and access the product catalog.
6. The Products page loads the product list from the local data file and allows search and filtering.
7. Clicking a product opens the ProductDetails page.
8. Users can add products to the cart or wishlist from any product card.
9. The cart drawer opens when an item is added and displays selected products, quantities, and subtotal.
10. The Cart page provides a full view of the order summary and item management.
11. The Wishlist page stores favorite items for later purchase.

## 9. Code Review
### Strengths
- Clean component-based structure
- Reusable ProductCard component reduces duplication
- Context API centralizes shared cart and wishlist logic
- Router-based navigation is easy to understand
- Animation effects improve user experience
- Code is readable and suitable for beginner-to-intermediate learners

### Areas for Improvement
- The project currently uses static product data; a backend/API can be integrated later
- Cart and wishlist are not persisted after page refresh
- Authentication is only a UI placeholder and not functional
- Checkout is not implemented as a real payment workflow
- Search and filters could be expanded with more advanced logic

## 10. Key Code Components Explained
### App.jsx
This file defines the main structure of the application and uses React Router to render different pages based on the current URL.

### StoreContext.jsx
This file manages shared state for:
- cart items
- wishlist items
- whether the cart drawer is open

It also provides functions to add items, remove items, update quantity, and calculate subtotal.

### ProductCard.jsx
This is a reusable card component used on the home page, product page, and wishlist page. It displays product information and actions such as add to cart and add to wishlist.

### CartDrawer.jsx
This component provides a sliding cart panel where users can modify item quantities and view the subtotal.

### Products.jsx
This page handles product search, category filtering, and sorting logic using React state and useMemo.

## 11. Explanation of Important Features
### 1. State Management
The project uses Context API to share state across multiple components without passing props repeatedly. This makes the cart and wishlist behavior consistent across the app.

### 2. Routing
React Router DOM is used for navigation between pages such as Home, Products, Product Details, Cart, Wishlist, and Login.

### 3. Animations
Framer Motion is used to add smooth transitions and interactive animations, making the interface feel modern and lively.

### 4. Reusability
Components such as ProductCard are designed to be reused in different sections of the app, reducing redundancy.

## 12. Viva Questions and Answers
### Q1. What is this project about?
This project is a frontend e-commerce application that allows users to browse products, add items to a cart, save products in a wishlist, and navigate through the shopping experience.

### Q2. Which technologies are used in this project?
React, Vite, React Router DOM, Framer Motion, React Icons, and CSS.

### Q3. How is the cart managed?
The cart is managed using React Context API. Shared state is stored centrally and functions are provided to add, remove, and update items.

### Q4. What is the role of Context API here?
Context API allows different components like the navbar, cart drawer, product card, and cart page to access and update the same shopping state without prop drilling.

### Q5. How is navigation implemented?
Navigation is implemented using React Router DOM with routes defined for the home page, products page, product details page, cart page, wishlist page, login page, and 404 page.

### Q6. What is the purpose of ProductCard?
ProductCard is a reusable UI component that displays product information and offers actions such as adding an item to the cart or wishlist.

### Q7. What are the limitations of the current project?
The current version uses static product data and does not include real backend integration, authentication, or payment processing.

## 13. Future Enhancements
- Connect with a real backend/API
- Add user authentication and login functionality
- Save cart and wishlist data in local storage or database
- Implement checkout and payment flow
- Add admin dashboard for product management
- Improve filtering with advanced search and price range controls

## 14. How to Run the Project
Run the following commands in the project folder:
```bash
npm install
npm run dev
```

## 15. Conclusion
This project demonstrates the development of a complete and attractive frontend shopping experience using React. It successfully implements core e-commerce features such as browsing, filtering, cart management, wishlist handling, and routing. The project is a strong example of modern front-end development with modular components and efficient state management.
