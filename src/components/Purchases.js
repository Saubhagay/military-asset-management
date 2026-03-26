import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Purchases({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    assetName: '',
    category: 'Weapon',
    base: user.role === 'Admin' ? 'Base Alpha' : user.base,
    quantity: '',
    cost: ''
  });

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('http://localhost:5000/api/purchases', config);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/purchases', formData, config);
      alert('Purchase recorded successfully!');
      fetchPurchases();
      // Reset form quantity
      setFormData({ ...formData, quantity: '', cost: '', assetName: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error recording purchase');
    }
  };

  return (
    <div>
      <h2>Record New Purchase</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{marginBottom: '10px'}}>
            <label>Asset Name</label>
            <input type="text" name="assetName" value={formData.assetName} onChange={handleInputChange} required style={{width: '100%', padding:'8px'}}/>
          </div>
          <div className="form-group" style={{marginBottom: '10px'}}>
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} style={{width: '100%', padding:'8px'}}>
              <option value="Weapon">Weapon</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Ammunition">Ammunition</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
          {user.role === 'Admin' && (
            <div className="form-group" style={{marginBottom: '10px'}}>
              <label>Base</label>
              <select name="base" value={formData.base} onChange={handleInputChange} style={{width: '100%', padding:'8px'}}>
                <option value="Base Alpha">Base Alpha</option>
                <option value="Base Bravo">Base Bravo</option>
                <option value="Base Charlie">Base Charlie</option>
              </select>
            </div>
          )}
          <div className="form-group" style={{marginBottom: '10px'}}>
            <label>Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="1" style={{width: '100%', padding:'8px'}}/>
          </div>
          <div className="form-group" style={{marginBottom: '20px'}}>
            <label>Total Cost ($)</label>
            <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} required min="0" style={{width: '100%', padding:'8px'}}/>
          </div>
          <button type="submit" className="action-btn">Submit Purchase</button>
        </form>
      </div>

      <h2>Recent Purchases</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Category</th>
            <th>Base</th>
            <th>Qty</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p._id}>
              <td>{new Date(p.date).toLocaleDateString()}</td>
              <td>{p.assetName}</td>
              <td>{p.category}</td>
              <td>{p.base}</td>
              <td>{p.quantity}</td>
              <td>${p.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Purchases;
