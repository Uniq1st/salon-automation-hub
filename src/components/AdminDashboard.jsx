import React, { useState, useEffect } from 'react';
import { generateInstagramCaption, generateUpsellContent } from '@/utils/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  // Fetch customers from Square
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/square/customers`);
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
    setLoading(false);
  };

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/square/bookings?startDate=${startDate.toISOString()}&endDate=${new Date().toISOString()}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  // Fetch sales data
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/square/sales?startDate=${startDate.toISOString()}&endDate=${new Date().toISOString()}`);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
    setLoading(false);
  };

  // Generate upsell content for customer
  const handleGenerateUpsell = async (customer) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/content/generate/upsell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonName: 'Brows and Lashes',
          currentService: 'Lash Extensions',
          upsellService: 'Lash Lift',
        }),
      });
      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'customers') fetchCustomers();
    else if (activeTab === 'bookings') fetchBookings();
    else if (activeTab === 'analytics') fetchSalesData();
  }, [activeTab]);

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
    }}>
      <header style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #7F77DD',
        paddingBottom: '1rem',
      }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '2rem', color: '#1f2937' }}>
          ✦ Brows and Lashes Admin Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
          Manage customers, automate campaigns, track analytics
        </p>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        {[
          { id: 'customers', label: '👥 Customers', icon: '👥' },
          { id: 'bookings', label: '📅 Bookings', icon: '📅' },
          { id: 'analytics', label: '📊 Analytics', icon: '📊' },
          { id: 'content', label: '✍️ Content Generator', icon: '✍️' },
          { id: 'campaigns', label: '📢 Campaigns', icon: '📢' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id ? '#7F77DD' : '#f3f4f6',
              color: activeTab === tab.id ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: activeTab === tab.id ? '600' : '500',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Customer List ({customers.length})</h2>
            <button style={{
              padding: '0.75rem 1.5rem',
              background: '#7F77DD',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}>
              + Add Customer
            </button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
          ) : (
            <div style={{
              overflowX: 'auto',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.95rem',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 10).map((customer, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>{customer.given_name} {customer.family_name}</td>
                      <td style={{ padding: '1rem' }}>{customer.email_address || '-'}</td>
                      <td style={{ padding: '1rem' }}>{customer.phone_number || '-'}</td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleGenerateUpsell(customer)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#7F77DD',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          Send Upsell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Recent Bookings ({bookings.length})</h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {bookings.slice(0, 6).map((booking, idx) => (
                <div key={idx} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                }}>
                  <p style={{ margin: '0 0 0.5rem', fontWeight: '600' }}>
                    {booking.customer_note || 'Booking'}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                    📅 {new Date(booking.start_at).toLocaleDateString()}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                    ⏰ {new Date(booking.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Sales Analytics (Last 30 Days)</h2>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
          ) : salesData ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              <div style={{
                backgroundColor: '#EEEDFE',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                borderLeft: '4px solid #7F77DD',
              }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>Total Bookings</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#7F77DD' }}>
                  {salesData.totalBookings}
                </p>
              </div>

              <div style={{
                backgroundColor: '#ecf5f0',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                borderLeft: '4px solid #1D9E75',
              }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>Total Revenue</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1D9E75' }}>
                  ${salesData.totalRevenue?.toFixed(2)}
                </p>
              </div>

              <div style={{
                backgroundColor: '#fce8e6',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                borderLeft: '4px solid #d32f2f',
              }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>Transactions</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#d32f2f' }}>
                  {salesData.totalTransactions}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>No data available</p>
          )}
        </section>
      )}

      {/* Content Generator Tab */}
      {activeTab === 'content' && (
        <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>AI Content Generator</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Generate marketing content powered by Claude AI. Costs tracked and billed automatically.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            <button style={{
              padding: '2rem',
              backgroundColor: '#EEEDFE',
              border: '2px solid #7F77DD',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}>
              📸 Generate Instagram Post
            </button>
            <button style={{
              padding: '2rem',
              backgroundColor: '#ecf5f0',
              border: '2px solid #1D9E75',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}>
              🎬 Generate TikTok Ideas
            </button>
            <button style={{
              padding: '2rem',
              backgroundColor: '#FAECE7',
              border: '2px solid #D85A30',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
            }}>
              💬 Generate Upsell Message
            </button>
          </div>

          {generatedContent && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}>
              <h3 style={{ margin: '0 0 1rem' }}>Generated Content</h3>
              <pre style={{
                backgroundColor: '#1f2937',
                color: '#ecf5f0',
                padding: '1rem',
                borderRadius: '0.375rem',
                overflowX: 'auto',
                fontSize: '0.85rem',
              }}>
                {JSON.stringify(generatedContent, null, 2)}
              </pre>
            </div>
          )}
        </section>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.5rem' }}>Automated Campaigns</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Set up automated email/SMS sequences triggered by customer actions
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { name: 'Welcome Sequence', desc: 'New clients get special offer', color: '#7F77DD' },
              { name: 'Win-Back Campaign', desc: 'Inactive 60+ days', color: '#1D9E75' },
              { name: 'Upsell on Review', desc: 'Triggered by 5-star review', color: '#D85A30' },
            ].map((campaign, idx) => (
              <div key={idx} style={{
                border: `2px solid ${campaign.color}`,
                borderRadius: '0.5rem',
                padding: '1.5rem',
                backgroundColor: campaign.color + '08',
              }}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: '600', fontSize: '1.1rem' }}>
                  {campaign.name}
                </p>
                <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                  {campaign.desc}
                </p>
                <button style={{
                  padding: '0.5rem 1rem',
                  background: campaign.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}>
                  Configure
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
