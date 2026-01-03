import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCareer.css';

const AdminCareer = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    department: '',
    location: '',
    type: '',
    description: '',
    logo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const res = await axios.get('https://backend-s2hb.vercel.app/api/careers');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form change
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 // Handle add/update job with image upload
const handleSubmit = async e => {
  e.preventDefault();
  try {
    const data = new FormData(); // Create FormData for file upload
    data.append('title', formData.title);
    data.append('company', formData.company);
    data.append('department', formData.department);
    data.append('location', formData.location);
    data.append('type', formData.type);
    data.append('description', formData.description);

    if (formData.logoFile) {
      data.append('logo', formData.logoFile); // Append file if selected
    }

    if (editingId) {
      await axios.put(`https://backend-s2hb.vercel.app/api/careers/${editingId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditingId(null);
    } else {
      await axios.post('https://backend-s2hb.vercel.app/api/careers', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    // Reset form
    setFormData({
      title: '',
      company: '',
      department: '',
      location: '',
      type: '',
      description: '',
      logoFile: null
    });

    fetchJobs(); // Refresh job list
  } catch (err) {
    console.error(err);
    alert('Something went wrong!');
  }
};
  // Edit job
  const handleEdit = job => {
    setEditingId(job._id);
    setFormData({
      title: job.title,
      company: job.company,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      logo: job.logo
    });
  };

  // Delete job
  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`https://backend-s2hb.vercel.app/api/careers/${id}`);
        fetchJobs();
      } catch (err) {
        console.error(err);
        alert('Delete failed!');
      }
    }
  };

  return (
    <div className="admin-career-container">
      <h2>Admin Career Panel</h2>

      <form className="job-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="type" placeholder="Type (Remote/On-Site)" value={formData.type} onChange={handleChange} required />
<input
  type="file"
  name="logo"
  accept="image/*"
  onChange={e => setFormData({ ...formData, logoFile: e.target.files[0] })}
/>
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>

        <button type="submit">{editingId ? 'Update Job' : 'Add Job'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title:'', company:'', department:'', location:'', type:'', description:'', logo:'' }); }}>Cancel</button>}
      </form>

      <h3>Existing Jobs</h3>
      {loading ? <p>Loading...</p> :
        <div className="jobs-list">
          {jobs.map(job => (
            <div key={job._id} className="job-item">
              <strong>{job.title}</strong> - {job.company} ({job.location})
              <div className="job-actions">
                <button onClick={() => handleEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      } 
    </div>
  );
};

export default AdminCareer;
