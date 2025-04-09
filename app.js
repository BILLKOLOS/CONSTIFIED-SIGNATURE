
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
app.get('/collection/:slug', (req, res) => {
    const slug = req.params.slug;
    
    // Fetch the collection data based on the slug
    // This is just an example - replace with your actual data fetching logic
    const collection = {
      name: "Example Collection", // This will be collectionName in the template
      description: "This is an example collection description.",
      slug: slug
    };
    
    // Fetch products for this collection
    const products = [
      // Example product data
      {
        id: 1,
        name: "Example Product",
        slug: "example-product",
        category: "Loafers",
        price: 45000,
        salePrice: null,
        rating: 4,
        reviewCount: 12,
        image: "/api/placeholder/400/400",
        isNew: true,
        isSale: false,
        isLimited: false,
        inWishlist: false,
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "Brown", hex: "#964B00" }
        ]
      }
      // Add more products as needed
    ];
    
    // Pagination data
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 12;
    const totalItems = 36; // Example count
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Featured collections
    const featuredCollections = [
      {
        name: "Oxford Shoes",
        slug: "oxford-shoes",
        image: "/api/placeholder/400/300",
        productCount: 15
      },
      {
        name: "Loafers",
        slug: "loafers",
        image: "/api/placeholder/400/300",
        productCount: 12
      }
      // Add more featured collections as needed
    ];
    
    // Render the template with all required data
    res.render('collection', {
      collectionName: collection.name,
      collectionDescription: collection.description,
      products: products,
      currentPage: currentPage,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: totalPages,
      featuredCollections: featuredCollections
    });
  });

// Add this with your other routes
app.get('/wishlist', (req, res) => {
    res.render('wishlist', { title: 'My Wishlist' });
  });

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