const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let orders = [];
let laptops = [
  { "id": "std-01", "model": "Lenovo ThinkPad E14", "cpu": "i5 13th Gen", "ram": "16GB", "storage": "512GB SSD", "price": 850, "category": "Standard" },
  { "id": "std-02", "model": "Dell Latitude 3440", "cpu": "i5 13th Gen", "ram": "16GB", "storage": "512GB SSD", "price": 820, "category": "Standard" },
  { "id": "dev-01", "model": "MacBook Pro 14 M3", "cpu": "M3 Pro", "ram": "18GB", "storage": "512GB SSD", "price": 1999, "category": "Developer" }
];

app.get('/api/laptops', (req,res) => res.json(laptops));

app.post('/api/order', (req,res) => {
  const { employeeName, employeeEmail, department, laptopId } = req.body;
  const laptop = laptops.find(l => l.id === laptopId);
  const orderId = 'REQ' + Date.now();
  const flowExecution = {
    orderId,
    trigger: 'Catalog Item Submitted',
    steps: [
      { step: 1, action: 'Validate Request', status: 'Completed', details: `Validated ${employeeName} from ${department}` },
      { step: 2, action: 'Manager Approval', status: department === 'IT' ? 'Auto-Approved' : 'Pending Approval', details: 'Look up Manager -> Send Approval' },
      { step: 3, action: 'Check Stock & Budget', status: 'Completed', details: `Budget $${laptop.price} approved` },
      { step: 4, action: 'Create Procurement Task', status: 'Completed', details: `Task for ${laptop.model}` },
      { step: 5, action: 'Notify Requester', status: 'Completed', details: `Email sent to ${employeeEmail}` }
    ],
    status: department === 'IT' ? 'Approved & Ordered' : 'Awaiting Manager Approval',
    laptop,
    requester: { employeeName, employeeEmail, department },
    createdAt: new Date().toISOString()
  };
  orders.push(flowExecution);
  res.json(flowExecution);
});

app.get('/api/orders', (req,res) => res.json(orders.reverse()));
app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));