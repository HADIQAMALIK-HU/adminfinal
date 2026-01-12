import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './CreateUser.css'; 
// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// 1. Click Handler Component
function LocationPickerMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? <Marker position={position} /> : null;
}

// 2. City change hone par Map move karne wala component
function MapViewUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 12); // City change hone par map wahan move ho jayega
        }
    }, [center, map]);
    return null;
}
function CreateUser() {
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        area: '',
        displayType: '',
        displaySubType: '', 
        price: '',
        size: [],
        customLength: '', 
        customWidth: '',  
        sqft: '',         
        lights: '',
        availability: '',
        installedAt: '',
        impression: '',
        reach: '',
        trafficComingFrom: '',
        trafficGoingToward: '',
        environment: [],
        image: null, 
        displayId: '',
        province: '',
        location: '',
        latitude: '',
        longitude: '',
        ownerName: '',
    });
    const navigate = useNavigate();
    const [generalErrorMessage, setGeneralErrorMessage] = useState('');
    const [displayIdError, setDisplayIdError] = useState(''); 
    const [isCheckingDisplayId, setIsCheckingDisplayId] = useState(false); 
    const citiesByProvince = {
        Punjab: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Pattoki', 'Multan', 'Gujranwala', 'Sialkot'],
        Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana'],
        KPK: ['Peshawar', 'Abbottabad', 'Swat', 'Mardan'],
        Islamabad: ['Islamabad'],
        Balochistan: ['Quetta', 'Gwadar'],
        'Azad Kashmir': ['Muzaffarabad', 'Mirpur'],
        'Gilgit Baltistan': ['Gilgit', 'Skardu'],
    };
    const environmentOptions = [
        { value: 'Bank', label: 'Bank' },
        { value: 'School', label: 'School' },
        { value: 'Hospital', label: 'Hospital' },
        { value: 'Brand Outlets', label: 'Brand Outlets' },
        { value: 'Offices', label: 'Offices' },
        { value: 'Car Showrooms', label: 'Car Showrooms' },
        { value: "McDonald's", label: "McDonald's" },
        { value: 'KFC', label: 'KFC' },
        { value: 'DHA Office', label: 'DHA Office' },
        { value: 'Industrial Area', label: 'Industrial Area' },
        { value: 'Universities', label: 'Universities' },
        { value: 'Residential Area', label: 'Residential Area' },
        { value: 'Commercial Area', label: 'Commercial Area' },
        { value: 'Public Transport Hub', label: 'Public Transport Hub' },
        { value: 'Recreational Park', label: 'Recreational Park' },
        { value: 'Shopping Mall', label: 'Shopping Mall' },
        { value: 'Market', label: 'Market' },
    ];
    const displaySubTypes = {
        Static: ['Billboard', 'Bridge Panel', 'Under Passes', 'Streamers', 'Mopi', 'Gantry', 'Bus Shelter', 'T Sign', 'Floats'],
        Digital: ['SMD', '3D SMD', 'Streamers', 'Mopies', 'Digital Floats'],
    }; 
    const displayTypeOptions = ['Static', 'Digital'];
    const installedAtOptions = ['Ground', 'Wall', 'Pole', 'Rooftop'];
   // Size options for the multi-select dropdown
 const sizeOptions = [
        { value: '60x20', label: '60x20' },
        { value: '45x15', label: '45x15' },
        { value: '20x10', label: '20x10' },
        { value: '120x30', label: '120x30' },
        { value: '169x70', label: '169x70' },
        { value: '90x30', label: '90x30' },
        { value: '40x30', label: '40x30' },
        { value: '30x40', label: '30x40' },
        { value: '20x60', label: '20x60' },
        { value: '40x20', label: '40x20' },
        { value: '20x50', label: '20x50' },
        { value: '30x15', label: '30x15' },
        { value: 'Custom', label: 'Custom (Enter your own size)' },
    ];

    const [availableCities, setAvailableCities] = useState([]);
    // Is line ko function CreateUser ke andar add karein

   const cityCoords = {
    'Lahore': [31.5204, 74.3587],
    'Karachi': [24.8607, 67.0011],
    'Islamabad': [33.6844, 73.0479],
    'Rawalpindi': [33.5651, 73.0169],
    'Faisalabad': [31.4504, 73.1350],
    'Multan': [30.1575, 71.5249],
    'Peshawar': [34.0151, 71.5249],
    'Quetta': [30.1798, 66.9750],
    // Baaki cities ke coords bhi isi tarah add kar sakte hain
};
const currentCityCoords = cityCoords[formData.city] || [31.5204, 74.3587];
     // --- START: Size and SQFT Calculation Logic ---
    // Effect to calculate total SQFT whenever selected sizes or custom dimensions change
    useEffect(() => {
        const calculateTotalSqft = () => {
            let totalSqft = 0;
            // Ensure formData.size is an array before iterating
            if (Array.isArray(formData.size)) {
                formData.size.forEach(selectedSize => {
                    if (selectedSize === 'Custom') {
                        // If 'Custom' is selected, use customLength and customWidth for calculation
                        const length = parseFloat(formData.customLength);
                        const width = parseFloat(formData.customWidth);
                        if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
                            totalSqft += (length * width);
                        }
                    } else {
                        // For predefined sizes like '10x20', parse dimensions and add to total
                        const dimensions = selectedSize.split('x').map(Number);
                        if (dimensions.length === 2 && !isNaN(dimensions[0]) && !isNaN(dimensions[1])) {
                            totalSqft += (dimensions[0] * dimensions[1]);
                        }
                    }
                });
            }
            // Update the sqft field in formData state
            setFormData(prev => ({ ...prev, sqft: totalSqft.toString() }));
        };
        calculateTotalSqft();
    }, [formData.size, formData.customLength, formData.customWidth]); // Dependencies for recalculation
    // --- END: Size and SQFT Calculation Logic ---

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const currentDisplayId = formData.displayId.trim();
            if (currentDisplayId) {
                if (isNaN(Number(currentDisplayId))) {
                    setDisplayIdError('Display ID must be a number.');
                    setIsCheckingDisplayId(false);
                    return;
                }

                setIsCheckingDisplayId(true);
                try {
                    const response = await axios.get(`https://backend-s2hb.vercel.app/filter?displayId=${currentDisplayId}`);
                    if (response.data.totalCount > 0) {
                        setDisplayIdError('This Display ID already exists. Please use a different one.');
                    } else {
                        setDisplayIdError(''); 
                    }
                } catch (err) {
                    console.error('Error checking Display ID uniqueness:', err);
                    setDisplayIdError('Failed to check ID. Please try again.');
                } finally {
                    setIsCheckingDisplayId(false);
                }
            } else {
                setDisplayIdError('');
            }
        }, 500); 

        return () => clearTimeout(delayDebounceFn); 
    }, [formData.displayId]); 

    const handleProvinceChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            city: ''
        }));
        setAvailableCities(citiesByProvince[value] || []);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            let newState = { ...prev };
            if (name === 'displayId') {
                if (value === '' || /^\d*$/.test(value)) {
                    newState[name] = value;
                } else {
                    setDisplayIdError('Display ID must be a number.');
                    return prev; 
                }
            } else {
                newState[name] = type === 'checkbox' ? checked : value;
            }

            if (name === 'displayType') {
                newState.displaySubType = '';
                if (value === 'Digital') {
                    newState.lights = 'false'; 
                } else {
                    if (prev.displayType === 'Digital' && prev.lights === 'false') {
                        newState.lights = '';
                    }
                }
            }
            if (name === 'size') {
                if (value === 'Custom') {
                    newState.sqft = ''; 
                    newState.customLength = ''; 
                    newState.customWidth = ''; 
                } else if (value !== '') {
                    const dimensions = value.split('x').map(Number);
                    if (dimensions.length === 2 && !isNaN(dimensions[0]) && !isNaN(dimensions[1])) {
                        newState.sqft = (dimensions[0] * dimensions[1]).toString();
                        newState.customLength = dimensions[0].toString(); 
                        newState.customWidth = dimensions[1].toString();   
                    } else {
                        newState.sqft = '';
                        newState.customLength = '';
                        newState.customWidth = '';
                    }
                } else {
                    newState.sqft = '';
                    newState.customLength = '';
                    newState.customWidth = '';
                }
            }

            setGeneralErrorMessage(''); 
            return newState;
        });
    };
// --- START: Size Multi-Select Handler ---
    // Handler for multi-select 'Size' dropdown
    const handleSizeChange = (selectedOptions) => {
        // Extract only the 'value' from the selected options
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => ({
            ...prev,
            size: selectedValues, // Update the size array in formData
            // Clear custom dimensions if 'Custom' is no longer selected
            customLength: selectedValues.includes('Custom') ? prev.customLength : '',
            customWidth: selectedValues.includes('Custom') ? prev.customWidth : '',
        }));
    };
    // --- END: Size Multi-Select Handler ---
    const handleEnvironmentChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            environment: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0] 
        }));
    };
    const showMessageBox = (message) => {
        setGeneralErrorMessage(message);
        const messageBox = document.createElement('div');
        messageBox.className = 'custom-message-box';
        messageBox.innerHTML = `
            <div class="custom-message-content">
                <p>${message}</p>
                <button class="custom-message-button">OK</button>
            </div>
        `;
        document.body.appendChild(messageBox);
        messageBox.querySelector('.custom-message-button').onclick = () => {
            document.body.removeChild(messageBox);
            setGeneralErrorMessage(''); 
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralErrorMessage(''); 
        if (displayIdError) {
            setGeneralErrorMessage('Please fix the Display ID error before submitting.');
            return;
        }
        if (isCheckingDisplayId) {
            setGeneralErrorMessage('Please wait, checking Display ID uniqueness...');
            return;
        }
        if (formData.displayId.trim() !== '' && isNaN(Number(formData.displayId))) {
            setGeneralErrorMessage('Display ID must be a valid number.');
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            if (key === 'image') {
                if (formData.image) {
                    data.append('image', formData.image);
                }
                continue;
            }
            if (key === 'displayId' && formData[key] === '') {
                continue;
            }
            if (key === 'environment' && Array.isArray(formData[key])) {
                data.append(key, JSON.stringify(formData[key]));
            } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }
    for (let pair of data.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
    }
    console.log("FormData sent to backend (inspect above for details).");
        try {
    
            const response = await axios.post('https://backend-s2hb.vercel.app/createBillboard', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Billboard created successfully:', JSON.stringify(response.data, null, 2));
            navigate('/');
        } catch (err) {
            console.error('Error creating billboard:', err);
            let clientErrorMessage = 'Failed to create billboard. Check console for details.';
            if (err.response) {

                if (err.response.status === 409 && err.response.data.message) {
                    clientErrorMessage = err.response.data.message; 
                } else {
                    clientErrorMessage = `Server error: ${err.response.status} - ${err.response.data.error || err.response.statusText}`;
                }
            } else if (err.request) {
                // Request was made but no response received
                clientErrorMessage = 'Network error: Backend server might not be running or reachable.';
            } else {
                // Something else happened in setting up the request
                clientErrorMessage = `An unexpected error occurred: ${err.message}`;
            }
            // Using a custom message box instead of alert()
            showMessageBox(clientErrorMessage); // Use the general message box
        }
    };
    console.log("📤 Submitting Form Data:", formData);

    return (
        <div className='create-user-page'>
            <div className='create-user-form-container'>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="d-flex">
                        <h2 className="mb-4 me-5">Add Billboard</h2>
                        <Link to="/" className="btn btn-outline-primary mb-4">← Back to All Billboards</Link>
                    </div>

                    {generalErrorMessage && (
                        <div className="error-message-box">
                            {generalErrorMessage}
                            <button className="close-error" onClick={() => setGeneralErrorMessage('')}>&times;</button>
                        </div>
                    )}

                    {/* First row */}
                    <div className="row form-section-row">
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Title</label>
                            <input name="title" type="text" className='form-control' value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Display ID (Optional)</label>
                            <input
                                name="displayId"
                                type="text" // Keep as text to allow empty string, validate numeric in handleChange and useEffect
                                className={`form-control ${displayIdError ? 'is-invalid' : ''}`} // Apply is-invalid class
                                value={formData.displayId}
                                onChange={handleChange}
                                placeholder="Enter Unique ID"
                            />
                            {isCheckingDisplayId && <div className="text-muted small mt-1">Checking ID...</div>}
                            {displayIdError && <div className="invalid-feedback">{displayIdError}</div>} {/* Display specific error */}
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Media Owner</label>
                            <input name="ownerName" type="text" className='form-control' value={formData.ownerName} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Second row */}
                    <div className="row form-section-row">
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Province</label>
                            <select name="province" className='form-control' value={formData.province} onChange={handleProvinceChange} required>
                                <option value="">Select Province</option>
                                {Object.keys(citiesByProvince).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">City</label>
                            <select name="city" className='form-control' value={formData.city} onChange={handleChange} disabled={!formData.province} required>
                                <option value="">Select City</option>
                                {availableCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Area</label>
                            <input name="area" type="text" className='form-control' value={formData.area} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Third row */}
                    <div className="row form-section-row">
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Location</label>
                            <input
  type="text"
  className="form-control"
  placeholder="Search & pin location "
  value={formData.location}
  onChange={async (e) => {
    const query = e.target.value;
    setFormData(prev => ({ ...prev, location: query }));

    if (query.length > 3) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        }
      } catch (err) {
        console.error("Location search error", err);
      }
    }
  }}
/>

                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Display Type</label>
                            <select name="displayType" className='form-control' value={formData.displayType} onChange={handleChange} required>
                                <option value="">Select Type</option>
                                {displayTypeOptions.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        {formData.displayType && (
                            <div className="col-12 col-md-4 form-group-col">
                                <label className="form-label">{formData.displayType} Type</label>
                                <select
                                    name="displaySubType"
                                    className='form-control'
                                    value={formData.displaySubType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select {formData.displayType} Type</option>
                                    {displaySubTypes[formData.displayType].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Fourth row - Corrected structure */}
                    <div className="row form-section-row">
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Price</label>
                            <input name="price" type="number" className='form-control' value={formData.price} onChange={handleChange} placeholder="e.g., 50000" />
                        </div>
                        {/* --- START: Size Selection Section --- */}
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Size</label>
                            <Select
                                isMulti // Enable multi-selection
                                name="size"
                                options={sizeOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                // Filter options to display selected ones based on formData.size array
                                value={sizeOptions.filter(option => formData.size.includes(option.value))}
                                onChange={handleSizeChange} // Use the new handler for size
                                placeholder="Select Sizes"
                            />
                        </div>

                        {/* Conditionally render custom length and width inputs if 'Custom' size is selected */}
                        {formData.size.includes('Custom') && (
                            <>
                               
                                <div className="col-12 col-md-2 form-group-col">
                                    <label className="form-label">Custom Width</label>
                                    <input
                                        name="customWidth"
                                        type="number"
                                        className='form-control'
                                        value={formData.customWidth}
                                        onChange={handleChange}
                                        placeholder="Width"
                                    />
                                </div>
                                 <div className="col-12 col-md-2 form-group-col">
                                    <label className="form-label">Custom Height</label>
                                    <input
                                        name="customLength"
                                        type="number"
                                        className='form-control'
                                        value={formData.customLength}
                                        onChange={handleChange}
                                        placeholder="Height"
                                    />
                                </div>
                            </>
                        )}
                        {/* --- END: Size Selection Section --- */}

                        {/* --- START: Calculated SQFT Display --- */}
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">SQFT</label>
                            <input
                                name="sqft"
                                type="text"
                                className='form-control'
                                value={formData.sqft}
                                readOnly // Make it read-only as it's calculated
                                placeholder="Calculated SQFT"
                            />
                        </div>
                        {/* --- END: Calculated SQFT Display --- */}

                        {/* LIGHTS LOGIC START HERE */}
                        {/* Conditionally render the Lights dropdown only if displayType is 'Static' */}
                        {formData.displayType === 'Static' && (
                            <div className="col-12 col-md-4 form-group-col">
                                <label className="form-label">Lights</label>
                                <select
                                    name="lights"
                                    className="form-control"
                                    value={formData.lights}
                                    onChange={handleChange}
                                >
                                    <option value="">Any</option> {/* Default option (no filter) */}
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        )}
                        {/* LIGHTS LOGIC END HERE */}
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Availability Date</label>
                            <input name="availability" type="date" className='form-control' value={formData.availability} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Fifth Row (Installed At, Impression, Reach) */}
                    <div className="row form-section-row">
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Installed At</label>
                            <select name="installedAt" className='form-control' value={formData.installedAt} onChange={handleChange}>
                                <option value="">Select Location</option>
                                {installedAtOptions.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Impression</label>
                            <input name="impression" type="number" className='form-control' value={formData.impression} onChange={handleChange} placeholder="e.g., 100000" />
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Reach</label>
                            <input name="reach" type="number" className='form-control' value={formData.reach} onChange={handleChange} placeholder="e.g., 50000" />
                        </div>
                    </div>

                    {/* Sixth Row (Traffic, Environment) */}
                    <div className="row form-section-row">
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Traffic Coming From</label>
                            <input name="trafficComingFrom" type="text" className='form-control' value={formData.trafficComingFrom} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Traffic Going Toward</label>
                            <input name="trafficGoingToward" type="text" className='form-control' value={formData.trafficGoingToward} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-4 form-group-col">
                            <label className="form-label">Environment</label>
                            <Select
                                isMulti
                                name="environment"
                                options={environmentOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={environmentOptions.filter(option => formData.environment.includes(option.value))}
                                onChange={handleEnvironmentChange}
                                placeholder="Select Environments"
                            />
                        </div>
                    </div>
                   <div className="row mt-4 mb-4">
                        <div className="col-12">
                            <label className="form-label text-primary">
                                <strong>Pin Location on Map ({formData.city || 'Default: Lahore'}):</strong>
                            </label>
                            <div style={{ height: '350px', width: '100%', border: '2px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
                                <MapContainer 
                                    center={currentCityCoords} 
                                    zoom={12} 
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    
                                    {/* Map update logic */}
                                    <MapViewUpdater center={currentCityCoords} />
                                    
                                  <LocationPickerMarker 
    position={
        formData.latitude && formData.longitude 
        ? [Number(formData.latitude), Number(formData.longitude)] 
        : null
    }
    setPosition={(pos) => {
        setFormData(prev => ({ ...prev, latitude: pos[0], longitude: pos[1] }));
    }}
/>

                                </MapContainer>
                            </div>
                            <div className="d-flex gap-3 mt-2">
                                <small>Latitude: <strong>{Number(formData.latitude)}</strong></small>
<small>Longitude: <strong>{Number(formData.longitude)}</strong></small>

                            </div>
                        </div>
                    </div>
                    {/* Image Upload */}
                    <div className="mb-4 form-section-row">
                        <label className="form-label">Upload Image</label>
                        <input type="file" name="image" className="form-control" onChange={handleImageChange} accept="image/*" />
                    </div>

                    <button type="submit" className='btn btn-success submit-button ' style={{ background: '#ffc107', border: 'none' }}>Add Billboard</button>
                </form>
            </div>
            {/* Custom Message Box CSS - Moved to a separate CSS file for better practice */}
        </div>
    );
}

export default CreateUser;
