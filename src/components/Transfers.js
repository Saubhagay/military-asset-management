import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Transfers({ user }) {
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    fromBase: user.role === 'Admin' ? 'Base Alpha' : user.base,
    toBase: 'Base Bravo',
    quantity: ''
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTransfers();
    fetchAssets();
  }, [formData.fromBase]);

  const fetchTransfers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('http://localhost:5000/api/transfers', config);
      setTransfers(response.data);
    } catch (error) {
      console.error('Error fetching transfers', error);
    }
  };

  const fetchAssets = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = 'http://localhost:5000/api/assets';
      if (user.role === 'Admin' && formData.fromBase) {
        url += `/${formData.fromBase}`;
      }
      const response = await axios.get(url, config);
      // Fallback in case it's not array
      if (Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error('Error fetching assets', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fromBase === formData.toBase) {
      return alert('Cannot transfer to the same base.');
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/transfers', formData, config);
      alert('Transfer recorded successfully!');
      fetchTransfers();
      fetchAssets();
      setFormData({ ...formData, quantity: '', assetId: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error recording transfer');
    }
  };

  return (
    <div>
      <h2>Initiate Inter-Base Transfer</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {user.role === 'Admin' && (
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label>From Base</label>
              <select name="fromBase" value={formData.fromBase} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
                <option value="Base Alpha">Base Alpha</option>
                <option value="Base Bravo">Base Bravo</option>
                <option value="Base Charlie">Base Charlie</option>
              </select>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label>Select Asset</label>
            <select name="assetId" value={formData.assetId} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
              <option value="">-- Choose Asset --</option>
              {assets.map(a => (
                <option key={a._id} value={a._id}>{a.assetName} (Available: {a.quantity})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label>To Destination Base</label>
            <select name="toBase" value={formData.toBase} onChange={handleInputChange} required style={{ width: '100%', padding: '8px' }}>
              <option value="Base Alpha">Base Alpha</option>
              <option value="Base Bravo">Base Bravo</option>
              <option value="Base Charlie">Base Charlie</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Quantity to Transfer</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="1" style={{ width: '100%', padding: '8px' }} />
          </div>

          <button type="submit" className="action-btn">Submit Transfer</button>
        </form>
      </div>

      <h2>Transfer History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset</th>
            <th>From</th>
            <th>To</th>
            <th>Qty</th>
            <th>Recorded By</th>
          </tr>
        </thead>
        <tbody>
          {transfers.length === 0 ? (
            <tr><td colSpan="6">No transfers found.</td></tr>
          ) : (
            transfers.map(t => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.asset ? t.asset.assetName : 'Deleted Asset'}</td>
                <td>{t.fromBase}</td>
                <td>{t.toBase}</td>
                <td>{t.quantity}</td>
                <td>{t.recordedBy ? t.recordedBy.username : 'System'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Transfers;
