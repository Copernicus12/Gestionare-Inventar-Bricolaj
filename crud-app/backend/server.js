const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 1234;

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

  

  const { ObjectId } = require('mongodb'); // Import ObjectId

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
  

  

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
