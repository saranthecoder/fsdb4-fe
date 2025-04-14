import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', city: '' });
  const [editingUserId, setEditingUserId] = useState(null);

  const API_URL = 'https://fsdb4-be.onrender.com/api/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        // Update user
        await axios.put(`${API_URL}/${editingUserId}`, formData);
        setEditingUserId(null);
      } else {
        // Add user
        await axios.post(API_URL, formData);
      }

      fetchUsers();
      setFormData({ name: '', email: '', city: '' });
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, city: user.city });
    setEditingUserId(user._id);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="app">
      <h1>User Manager</h1>

      <form className="user-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingUserId ? 'Update User' : 'Add User'}</button>
      </form>

      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>City: {user.city}</p>
            <div className="actions">
              <button className="edit" onClick={() => handleEdit(user)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(user._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
