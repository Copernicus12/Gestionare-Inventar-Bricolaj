const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 1234;

const { ObjectId } = require('mongodb'); // Import ObjectId

app.use(cors());
app.use(express.json()); // For parsing application/json

const uri = 'mongodb+srv://admin:FE2dBBOCG6QODZA3@cluster0.hols2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Fetch all employees
app.get('/api/data/employees', async (req, res) => {
  try {
    const db = client.db('inventar');
    const collection = db.collection('employees');
    const data = await collection.find({}).limit(10).toArray(); // Limit the result to 10 employees
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
});

// Add a new employee
app.post('/api/data/employees', async (req, res) => {
  try {
    const newEmployee = req.body;
    const db = client.db('inventar');
    const collection = db.collection('employees');
    const result = await collection.insertOne(newEmployee);
    res.status(201).json({ message: 'Employee added successfully', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add employee', error: err.message });
  }
});

// Update all employees
app.put('/api/data/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;  // The ID of the employee to update
    const updatedEmployee = req.body; // The updated employee data from the frontend

    // Ensure the id is correctly converted to ObjectId
    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('employees');

    // Perform the update operation
    const result = await collection.updateOne(
      { _id: objectId }, // Find employee by _id
      { $set: updatedEmployee } // Update the fields
    );

    // If no document was found or updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error during update:', error);  // Log the error
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
});

  

// Detele all employees
  app.delete('/api/data/employees/:id', async (req, res) => {
    try {
      const { id } = req.params;  // The ID from the URL
  
      // Ensure the id is correctly converted to ObjectId
      const objectId = new ObjectId(id);
  
      const db = client.db('inventar');
      const collection = db.collection('employees');
  
      // Perform delete operation
      const result = await collection.deleteOne({ _id: objectId });
  
      // Check if any document was deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error while deleting employee:', error); // Log the error for debugging
      res.status(500).json({ message: 'Failed to delete employee', error: error.message });
    }
  });
  
  // Fetch all RFID entries
app.get('/api/data/rfid', async (req, res) => {
    try {
      const db = client.db('inventar');
      const collection = db.collection('rfid');
      const data = await collection.find({}).limit(10).toArray(); // Limit to 10 RFID entries
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch RFID data', error: err.message });
    }
  });
  
  // Add new RFID entry
  app.post('/api/data/rfid', async (req, res) => {
    try {
      const newRfidData = req.body; // New RFID entry data from frontend
      const db = client.db('inventar');
      const collection = db.collection('rfid');
      const result = await collection.insertOne(newRfidData);
      res.status(201).json({ message: 'RFID data added successfully', id: result.insertedId });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add RFID data', error: err.message });
    }
  });

  // Update RFID entry
app.put('/api/data/rfid/:id', async (req, res) => {
    try {
      const { id } = req.params;  // The ID of the RFID to update
      const updatedRfidData = req.body; // The updated RFID data from the frontend
  
      const objectId = new ObjectId(id); // Convert id to ObjectId
  
      const db = client.db('inventar');
      const collection = db.collection('rfid');
  
      const result = await collection.updateOne(
        { _id: objectId },
        { $set: updatedRfidData } // Update the fields
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'RFID entry not found' });
      }
  
      res.json({ message: 'RFID entry updated successfully' });
    } catch (error) {
      console.error('Error during RFID update:', error);
      res.status(500).json({ message: 'Failed to update RFID entry', error: error.message });
    }
  });

  // Delete RFID entry
app.delete('/api/data/rfid/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const objectId = new ObjectId(id);
  
      const db = client.db('inventar');
      const collection = db.collection('rfid');
  
      const result = await collection.deleteOne({ _id: objectId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'RFID entry not found' });
      }
  
      res.json({ message: 'RFID entry deleted successfully' });
    } catch (error) {
      console.error('Error while deleting RFID entry:', error);
      res.status(500).json({ message: 'Failed to delete RFID entry', error: error.message });
    }
  });
  
  // Fetch all products
app.get('/api/data/products', async (req, res) => {
  try {
    const db = client.db('inventar');
    const collection = db.collection('products');
    const data = await collection.find({}).limit(10).toArray(); // Limit to 10 products
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// Add a new product
app.post('/api/data/products', async (req, res) => {
    try {
      const db = client.db('inventar');
      const collection = db.collection('products');
  
      // Găsește ultimul produs și extrage ID-ul său
      const lastProduct = await collection.find().sort({ _id: -1 }).limit(1).toArray();
      let newId = 1; // ID-ul va începe de la 1, dacă nu există produse.
  
      if (lastProduct.length > 0) {
        // Dacă există produse, ia ID-ul ultimului produs și crește-l cu 1
        newId = lastProduct[0].id + 1;
      }
  
      // Creează un obiect nou cu ID-ul incrementat
      const newProduct = {
        id: newId, // Folosește ID-ul incremental
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      };
  
      // Adaugă produsul în baza de date
      const result = await collection.insertOne(newProduct);
  
      // Răspuns de succes
      res.status(201).json(result.ops[0]);
  
    } catch (error) {
      console.error('Error while creating product:', error);
      res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
  });
  

// Update product
app.put('/api/data/products/:id', async (req, res) => {
  try {
    const { id } = req.params;  // The ID of the product to update
    const updatedProduct = req.body; // The updated product data from the frontend

    // Ensure the id is correctly converted to ObjectId
    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('products');

    // Perform the update operation
    const result = await collection.updateOne(
      { _id: objectId }, // Find product by _id
      { $set: updatedProduct } // Update the fields
    );

    // If no document was found or updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error during update:', error);  // Log the error
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Delete product
app.delete('/api/data/products/:id', async (req, res) => {
  try {
    const { id } = req.params;  // The ID from the URL

    // Ensure the id is correctly converted to ObjectId
    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('products');

    // Perform delete operation
    const result = await collection.deleteOne({ _id: objectId });

    // Check if any document was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error while deleting product:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});


// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
