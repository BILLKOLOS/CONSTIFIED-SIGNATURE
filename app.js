
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/shop', (req, res) => {
  res.render('shop', { title: 'Shop' });
});

app.get('/product/:id', (req, res) => {
  // In a real app, fetch product by ID from database
  res.render('product', { title: 'Product Details', productId: req.params.id });
});

app.get('/collection/:category', (req, res) => {
  res.render('collection', { title: 'Collection', category: req.params.category });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/cart', (req, res) => {
  res.render('cart', { title: 'Shopping Cart' });
});

app.get('/checkout', (req, res) => {
  res.render('checkout', { title: 'Checkout' });
});

app.get('/account', (req, res) => {
  res.render('account', { title: 'My Account' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});