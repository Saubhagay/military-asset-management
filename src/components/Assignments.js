import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Assignments({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    assetId: '',
    base: user.role === 'Admin' ? 'Base Alpha' : user.base,
    assignedTo: '',
    quantity: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchAssets();
  }, [formData.base]); // eslint-disable-line

  const fetchAssignments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.get('https://military-asset-management-po5d.onrender.com/api/assignments', config);
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments', error);
    }
  };

  const fetchAssets = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = 'https://military-asset-management-po5d.onrender.com/api/assets';
      if (user.role === 'Admin' && formData.base) {
         url += `/${formData.base}`;
      }
      const response = await axios.get(url, config);
      if(Array.isArray(response.data)) {
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
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('https://military-asset-management-po5d.onrender.com/api/assignments', formData, config);
      alert('Assignment recorded successfully!');
      fetchAssignments();
      fetchAssets();
      setFormData({ ...formData, quantity: '', assignedTo: '', assetId: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error recording assignment');
    }
  };

  return (
    <div>
      <h2>Assign Assets</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {user.role === 'Admin' && (
            <div className="form-group" style={{marginBottom: '10px'}}>
              <label>Origin Base</label>
              <select name="base" value={formData.base} onChange={handleInputChange} style={{width: '100%', padding:'8px'}}>
                <option value="Base Alpha">Base Alpha</option>
                <option value="Base Bravo">Base Bravo</option>
                <option value="Base Charlie">Base Charlie</option>
              </select>
            </div>
          )}
          
          <div className="form-group" style={{marginBottom: '10px'}}>
            <label>Select Asset</label>
            <select name="assetId" value={formData.assetId} onChange={handleInputChange} required style={{width: '100%', padding:'8px'}}>
              <option value="">-- Choose Asset --</option>
              {assets.map(a => (
                <option key={a._id} value={a._id}>{a.assetName} (Available: {a.quantity})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{marginBottom: '10px'}}>
            <label>Assign To (Unit / Personnel)</label>
            <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleInputChange} required placeholder="e.g. Alpha Squad" style={{width: '100%', padding:'8px'}}/>
          </div>

          <div className="form-group" style={{marginBottom: '20px'}}>
            <label>Quantity to Assign / Expend</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="1" style={{width: '100%', padding:'8px'}}/>
          </div>
          
          <button type="submit" className="action-btn">Submit Assignment</button>
        </form>
      </div>

      <h2>Recent Assignments (Expenditures)</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset</th>
            <th>Base</th>
            <th>Assigned To</th>
            <th>Qty</th>
            <th>Recorded By</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr><td colSpan="6">No assignments found.</td></tr>
          ) : (
            assignments.map(a => (
              <tr key={a._id}>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.asset ? a.asset.assetName : 'Deleted Asset'}</td>
                <td>{a.base}</td>
                <td>{a.assignedTo}</td>
                <td>{a.quantity}</td>
                <td>{a.recordedBy ? a.recordedBy.username : 'System'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Assignments;
