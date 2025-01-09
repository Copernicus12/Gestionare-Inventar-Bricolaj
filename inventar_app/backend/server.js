const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 1234;

const { ObjectId } = require('mongodb'); // Import ObjectId

app.use(cors());
app.use(express.json()); 

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


async function saveProduct(productData) {
  try {
    const db = client.db('inventar');
    const collection = db.collection('products');
    const result = await collection.insertOne(productData);
    return result.ops[0]; 
  } catch (error) {
    console.error('Error saving product:', error);
    throw error; 
  }
}

// Fetch all employees
app.get('/api/data/employees', async (req, res) => {
  try {
    const db = client.db('inventar');
    const collection = db.collection('employees');
    const data = await collection.find({}).limit(100).toArray(); 
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
    const { id } = req.params;  
    const updatedEmployee = req.body; 

    
    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('employees');

    
    const result = await collection.updateOne(
      { _id: objectId }, 
      { $set: updatedEmployee } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error during update:', error);  // Log the error
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
});

// Delete all employees
app.delete('/api/data/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;  

    // Ensure the id is correctly converted to ObjectId
    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('employees');

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error while deleting employee:', error); 
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
});

// Fetch all RFID entries
app.get('/api/data/rfid', async (req, res) => {
  try {
    const db = client.db('inventar');
    const collection = db.collection('rfid');
    const data = await collection.find({}).limit(100).toArray(); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch RFID data', error: err.message });
  }
});

// Add new RFID entry
app.post('/api/data/rfid', async (req, res) => {
  try {
    const newRfidData = req.body;
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
    const { id } = req.params; 
    const updatedRfidData = req.body; 

    const objectId = new ObjectId(id); 

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
    const data = await collection.find({}).limit(100).toArray(); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// Add new product
app.post('/api/data/products', async (req, res) => {
  try {
    const lastProduct = await client.db('inventar').collection('products').find().sort({ id: -1 }).limit(1).toArray();
    
    const newId = lastProduct.length > 0 ? (parseInt(lastProduct[0].id) + 1).toString() : '1';


    const newProduct = {
      ...req.body,
      id: newId,  
    };

    await client.db('inventar').collection('products').insertOne(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Error adding product");
  }
});


// Update product
app.put('/api/data/products/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedProduct = req.body; 

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('products');

    const result = await collection.updateOne(
      { _id: objectId }, 
      { $set: updatedProduct } 
    );

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
    const { id } = req.params;  

    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('products');

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error while deleting product:', error); 
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Fetch all orders
app.get('/api/data/orders', async (req, res) => {
  try {
    const db = client.db('inventar');
    const collection = db.collection('orders');
    
    const data = await collection.find({ deleted: { $ne: true } }).limit(100).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});


// Add a new order
app.post('/api/data/orders', async (req, res) => {
  try {
    const lastOrder = await client.db('inventar').collection('orders').find().sort({ id: -1 }).limit(1).toArray();

    const newId = lastOrder.length > 0 ? (parseInt(lastOrder[0].id) + 1).toString() : '1';

    const newOrder = {
      ...req.body,
      id: newId,  
    };

    const db = client.db('inventar');
    const collection = db.collection('orders');
    const result = await collection.insertOne(newOrder);

    res.status(201).json({ message: 'Order added successfully', id: result.insertedId, order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add order', error: err.message });
  }
});


// Update an existing order
app.put('/api/data/orders/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedOrder = req.body; 

    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('orders');

    const result = await collection.updateOne(
      { $set: updatedOrder } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error during order update:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// Delete an existing order
app.delete('/api/data/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;  

    if (!id) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const db = client.db('inventar');
    const collection = db.collection('orders');


    const result = await collection.updateOne(
      { id: id },  
      { $set: { deleted: true } }  
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order marked as deleted successfully' });
  } catch (error) {
    console.error('Error while deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

// Fetch all RFID devices
app.get('/api/data/rfid_devices', async (req, res) => {
  try {
    const db = client.db('inventar'); 
    const collection = db.collection('rfid_devices'); 
    const data = await collection.find({}).toArray(); 
    res.json(data); 
  } catch (err) {
    console.error('Failed to fetch RFID devices:', err);
    res.status(500).json({ message: 'Failed to fetch RFID devices', error: err.message });
  }
});

// Add a new RFID device
app.post('/api/data/rfid_devices', async (req, res) => {
  try {
    const newRfidDevice = req.body; 
    const db = client.db('inventar');
    const collection = db.collection('rfid_devices');
    const result = await collection.insertOne(newRfidDevice);
    res.status(201).json({ message: 'RFID device added successfully', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add RFID device', error: err.message });
  }
});

// Update an RFID device
app.put('/api/data/rfid_devices/:id', async (req, res) => {
  try {
    const { id } = req.params;  
    const updatedRfidDevice = req.body; 

    const objectId = new ObjectId(id); 

    const db = client.db('inventar');
    const collection = db.collection('rfid_devices');

    const result = await collection.updateOne(
      { _id: objectId },  
      { $set: updatedRfidDevice } 
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'RFID device not found' });
    }

    res.json({ message: 'RFID device updated successfully' });
  } catch (error) {
    console.error('Error during RFID device update:', error);
    res.status(500).json({ message: 'Failed to update RFID device', error: error.message });
  }
});

// Delete an RFID device
app.delete('/api/data/rfid_devices/:id', async (req, res) => {
  try {
    const { id } = req.params;  
    const objectId = new ObjectId(id);

    const db = client.db('inventar');
    const collection = db.collection('rfid_devices');

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'RFID device not found' });
    }

    res.json({ message: 'RFID device deleted successfully' });
  } catch (error) {
    console.error('Error while deleting RFID device:', error);
    res.status(500).json({ message: 'Failed to delete RFID device', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
