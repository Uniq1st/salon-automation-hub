import express from 'express';
import {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerBookings,
  getAllBookings,
  sendSMS,
  sendEmail,
  getCustomerPayments,
  getInvoices,
  getCatalog,
  getSalesData,
  tagCustomer,
  searchCustomers,
  getInactiveCustomers,
} from '../services/square.js';

const router = express.Router();

// Customers
router.get('/customers', async (req, res) => {
  try {
    const result = await getAllCustomers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inactive customers — must be before /customers/:customerId
router.get('/customers/inactive', async (req, res) => {
  try {
    const { daysInactive = 60 } = req.query;
    const result = await getInactiveCustomers(parseInt(daysInactive));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/customers/:customerId', async (req, res) => {
  try {
    const result = await getCustomer(req.params.customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/customers', async (req, res) => {
  try {
    const result = await createCustomer(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/customers/:customerId', async (req, res) => {
  try {
    const result = await updateCustomer(req.params.customerId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/customers/:customerId/bookings', async (req, res) => {
  try {
    const result = await getCustomerBookings(req.params.customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/customers/:customerId/payments', async (req, res) => {
  try {
    const result = await getCustomerPayments(req.params.customerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Communications
router.post('/customers/:customerId/sms', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    const result = await sendSMS(phoneNumber, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/customers/:customerId/email', async (req, res) => {
  try {
    const { subject, body } = req.body;
    const result = await sendEmail(req.params.customerId, subject, body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bookings
router.get('/bookings', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await getAllBookings(startDate, endDate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Invoices
router.get('/invoices', async (req, res) => {
  try {
    const result = await getInvoices();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Catalog
router.get('/catalog', async (req, res) => {
  try {
    const result = await getCatalog();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await getSalesData(startDate, endDate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }
    const result = await searchCustomers(q);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tags
router.post('/customers/:customerId/tags', async (req, res) => {
  try {
    const { tag } = req.body;
    const result = await tagCustomer(req.params.customerId, tag);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
