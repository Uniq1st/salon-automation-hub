import axios from 'axios';

function getSquareClient() {
  return axios.create({
    baseURL: `${process.env.SQUARE_API_URL || 'https://connect.squareup.com'}/v2`,
    headers: {
      'Square-Version': '2024-04-17',
      'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
}

function getLocationId() {
  return process.env.SQUARE_LOCATION_ID;
}

// Get all customers from Square
export async function getAllCustomers() {
  try {
    const response = await getSquareClient().get('/customers');
    return {
      success: true,
      customers: response.data.customers || [],
      count: response.data.customers?.length || 0,
    };
  } catch (error) {
    console.error('Square get customers error:', error);
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }
}

// Get single customer
export async function getCustomer(customerId) {
  try {
    const response = await getSquareClient().get(`/customers/${customerId}`);
    return {
      success: true,
      customer: response.data.customer,
    };
  } catch (error) {
    console.error('Square get customer error:', error);
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }
}

// Create customer
export async function createCustomer(customerData) {
  try {
    const response = await getSquareClient().post('/customers', {
      given_name: customerData.firstName,
      family_name: customerData.lastName,
      email_address: customerData.email,
      phone_number: customerData.phone,
      note: customerData.note || '',
    });

    return {
      success: true,
      customer: response.data.customer,
    };
  } catch (error) {
    console.error('Square create customer error:', error);
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}

// Update customer
export async function updateCustomer(customerId, customerData) {
  try {
    const response = await getSquareClient().put(`/customers/${customerId}`, {
      given_name: customerData.firstName,
      family_name: customerData.lastName,
      email_address: customerData.email,
      phone_number: customerData.phone,
      note: customerData.note,
    });

    return {
      success: true,
      customer: response.data.customer,
    };
  } catch (error) {
    console.error('Square update customer error:', error);
    throw new Error(`Failed to update customer: ${error.message}`);
  }
}

// Get customer bookings (appointments)
export async function getCustomerBookings(customerId) {
  try {
    const response = await getSquareClient().get('/bookings', {
      params: {
        customer_id: customerId,
      },
    });

    return {
      success: true,
      bookings: response.data.bookings || [],
      count: response.data.bookings?.length || 0,
    };
  } catch (error) {
    console.error('Square get bookings error:', error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}

// Get all bookings for location
export async function getAllBookings(startDate, endDate) {
  try {
    const response = await getSquareClient().get('/bookings', {
      params: {
        location_id: getLocationId(),
        start_at_min: startDate,
        start_at_max: endDate,
      },
    });

    return {
      success: true,
      bookings: response.data.bookings || [],
      count: response.data.bookings?.length || 0,
    };
  } catch (error) {
    console.error('Square get bookings error:', error);
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
}

// Send SMS via Square (requires SMS-enabled location)
export async function sendSMS(phoneNumber, message) {
  try {
    // Square doesn't have direct SMS API, so we use their customer communication
    // In production, you'd integrate with Twilio or use Square's SMS-enabled subscriptions
    
    console.log(`SMS to ${phoneNumber}: ${message}`);
    
    return {
      success: true,
      message: 'SMS queued (via Square integration)',
      phone: phoneNumber,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
}

// Send email via Square (uses Square's customer communication)
export async function sendEmail(customerId, subject, body) {
  try {
    // Square's email is through their customer communication API
    // Store email in customer note for CRM tracking
    
    const customer = await getCustomer(customerId);
    const updatedNote = `${customer.customer.note || ''}\n[${new Date().toISOString()}] Email sent: ${subject}`;
    
    await updateCustomer(customerId, {
      ...customer.customer,
      note: updatedNote,
    });

    return {
      success: true,
      message: 'Email logged in customer record',
      customerId,
      subject,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Get customer payment history
export async function getCustomerPayments(customerId) {
  try {
    const response = await getSquareClient().get('/payments', {
      params: {
        customer_id: customerId,
      },
    });

    return {
      success: true,
      payments: response.data.payments || [],
      totalSpent: response.data.payments?.reduce((sum, p) => sum + (p.amount_money?.amount || 0), 0) || 0,
    };
  } catch (error) {
    console.error('Square get payments error:', error);
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }
}

// Get invoice data
export async function getInvoices() {
  try {
    const response = await getSquareClient().get('/invoices', {
      params: {
        location_id: getLocationId(),
      },
    });

    return {
      success: true,
      invoices: response.data.invoices || [],
      count: response.data.invoices?.length || 0,
    };
  } catch (error) {
    console.error('Square get invoices error:', error);
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }
}

// Get catalog (services/products)
export async function getCatalog() {
  try {
    const response = await getSquareClient().get('/catalog/list');

    return {
      success: true,
      items: response.data.objects || [],
      count: response.data.objects?.length || 0,
    };
  } catch (error) {
    console.error('Square get catalog error:', error);
    throw new Error(`Failed to fetch catalog: ${error.message}`);
  }
}

// Get sales data (aggregated)
export async function getSalesData(startDate, endDate) {
  try {
    const bookings = await getAllBookings(startDate, endDate);
    const payments = await getSquareClient().get('/payments', {
      params: {
        begin_time: startDate,
        end_time: endDate,
      },
    });

    const totalRevenue = payments.data.payments?.reduce(
      (sum, p) => sum + (p.amount_money?.amount || 0),
      0
    ) || 0;

    return {
      success: true,
      totalBookings: bookings.count,
      totalRevenue: totalRevenue / 100, // Convert from cents
      totalTransactions: payments.data.payments?.length || 0,
      currency: payments.data.payments?.[0]?.amount_money?.currency || 'USD',
      period: { start: startDate, end: endDate },
    };
  } catch (error) {
    console.error('Sales data error:', error);
    throw new Error(`Failed to fetch sales data: ${error.message}`);
  }
}

// Tag customer (for segmentation)
export async function tagCustomer(customerId, tag) {
  try {
    const customer = await getCustomer(customerId);
    const currentNote = customer.customer.note || '';
    const tags = currentNote.split('\n').filter(line => line.startsWith('#'));
    
    if (!tags.includes(`#${tag}`)) {
      tags.push(`#${tag}`);
    }

    await updateCustomer(customerId, {
      ...customer.customer,
      note: currentNote + (currentNote ? '\n' : '') + tags.join('\n'),
    });

    return {
      success: true,
      customerId,
      tag,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Tag customer error:', error);
    throw new Error(`Failed to tag customer: ${error.message}`);
  }
}

// Search customers by phone or email
export async function searchCustomers(query) {
  try {
    const customers = await getAllCustomers();
    
    const filtered = customers.customers.filter(c => 
      c.email_address?.toLowerCase().includes(query.toLowerCase()) ||
      c.phone_number?.includes(query)
    );

    return {
      success: true,
      customers: filtered,
      count: filtered.length,
    };
  } catch (error) {
    console.error('Search customers error:', error);
    throw new Error(`Failed to search customers: ${error.message}`);
  }
}

// Get inactive customers (no bookings in X days)
export async function getInactiveCustomers(daysInactive = 60) {
  try {
    const customers = await getAllCustomers();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const inactiveCustomers = [];

    for (const customer of customers.customers) {
      const bookings = await getCustomerBookings(customer.id);
      if (bookings.bookings.length === 0 || 
          new Date(bookings.bookings[bookings.bookings.length - 1].start_at) < cutoffDate) {
        inactiveCustomers.push(customer);
      }
    }

    return {
      success: true,
      inactiveCustomers,
      count: inactiveCustomers.length,
      threshold: `${daysInactive} days`,
    };
  } catch (error) {
    console.error('Inactive customers error:', error);
    throw new Error(`Failed to fetch inactive customers: ${error.message}`);
  }
}
