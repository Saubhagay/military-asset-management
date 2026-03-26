import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBase, setFilterBase] = useState(user.role === 'Admin' ? '' : user.base);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, [filterBase]); // eslint-disable-line

  const fetchAssets = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = 'https://military-asset-management-po5d.onrender.com/api/assets';
      
      if (user.role === 'Admin' && filterBase) {
        url += `/${filterBase}`;
      }
      
      const response = await axios.get(url, config);
      if (Array.isArray(response.data)) {
        setAssets(response.data);
      } else {
        setAssets([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assets', error);
      setLoading(false);
    }
  };

  const handleShowDetails = (asset) => {
    setSelectedAsset(asset);
  };

  const closePopup = () => {
    setSelectedAsset(null);
  };

  return (
    <div className="dashboard">
      <h2>Asset Dashboard</h2>
      
      {user.role === 'Admin' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Filter by Base: </label>
          <select value={filterBase} onChange={(e) => setFilterBase(e.target.value)} style={{ padding: '5px' }}>
            <option value="">All Bases</option>
            <option value="Base Alpha">Base Alpha</option>
            <option value="Base Bravo">Base Bravo</option>
            <option value="Base Charlie">Base Charlie</option>
          </select>
        </div>
      )}

      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Base</th>
              <th>Current Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr><td colSpan="6">No assets found.</td></tr>
            ) : (
              assets.map(asset => (
                <tr key={asset._id}>
                  <td>{asset.assetName}</td>
                  <td>{asset.category}</td>
                  <td>{asset.base}</td>
                  <td>{asset.quantity}</td>
                  <td>{asset.status}</td>
                  <td>
                    <button className="action-btn" style={{padding: '5px'}} onClick={() => handleShowDetails(asset)}>View Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {selectedAsset && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h3>Asset Details</h3>
            <p><strong>Name:</strong> {selectedAsset.assetName}</p>
            <p><strong>Category:</strong> {selectedAsset.category}</p>
            <p><strong>Base:</strong> {selectedAsset.base}</p>
            <p><strong>Total Quantity:</strong> {selectedAsset.quantity}</p>
            <p><strong>Status:</strong> {selectedAsset.status}</p>
            <button className="action-btn" onClick={closePopup} style={{marginTop: '15px'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
