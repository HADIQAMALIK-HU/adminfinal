import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from 'react-select';
import './UpdateUser.css'; // Ensure this CSS file contains styles for .is-invalid, .invalid-feedback, and .error-message-box

function UpdateUser() {
    const { id } = useParams(); // This 'id' is the MongoDB _id of the billboard
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        area: '',
        displayType: '',
        displaySubType: '',
        price: '',
        size: [], // Changed to array for multi-select
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
        currentImage: '', // To display the existing image
        displayId: '',    // The displayId for the billboard
        province: '',
        location: '',
        ownerName: '',
    });
    const [generalErrorMessage, setGeneralErrorMessage] = useState(''); // General error for form submission
    const [displayIdError, setDisplayIdError] = useState(''); // Specific error for displayId field
    const [isCheckingDisplayId, setIsCheckingDisplayId] = useState(false); // Loading state for displayId check
    const [originalDisplayIdValue, setOriginalDisplayIdValue] = useState(''); // To store the displayId fetched from DB
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
        { value: 'Custom', label: 'Custom' }
    ];

    const [availableCities, setAvailableCities] = useState([]);

    // Effect to calculate SQFT based on selected sizes and custom dimensions
    useEffect(() => {
        const calculateTotalSqft = () => {
            let totalSqft = 0;
            const selectedSizes = formData.size;

            if (selectedSizes && selectedSizes.length > 0) {
                selectedSizes.forEach(sizeValue => {
                    if (sizeValue === 'Custom') {
                        const length = parseFloat(formData.customLength);
                        const width = parseFloat(formData.customWidth);
                        if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
                            totalSqft += (length * width);
                        }
                    } else {
                        const dimensions = sizeValue.split('x').map(Number);
                        if (dimensions.length === 2 && !isNaN(dimensions[0]) && !isNaN(dimensions[1])) {
                            totalSqft += (dimensions[0] * dimensions[1]);
                        }
                    }
                });
            }
            setFormData(prev => ({ ...prev, sqft: totalSqft > 0 ? totalSqft.toString() : '' }));
        };
        calculateTotalSqft();
    }, [formData.size, formData.customLength, formData.customWidth]);

    // Effect to fetch billboard data for update
    useEffect(() => {
        axios.get(`https://backend-s2hb.vercel.app/getBillboard/${id}`)
            .then(res => {
                const user = res.data;
                let formattedAvailabilityDate = '';
                if (user.availability) {
                    const date = new Date(user.availability);
                    if (!isNaN(date.getTime())) {
                        formattedAvailabilityDate = date.toISOString().split('T')[0];
                    }
                }
                // Handle size: convert to array if it's a single string, or parse if it's a JSON string
                let initialSize = [];
                if (user.size) {
                    if (Array.isArray(user.size)) {
                        initialSize = user.size;
                    } else if (typeof user.size === 'string') {
                        try {
                            // Try parsing as JSON array first (for backward compatibility if it was stringified)
                            const parsedSize = JSON.parse(user.size);
                            if (Array.isArray(parsedSize)) {
                                initialSize = parsedSize;
                            } else {
                                // If not a JSON array, assume it's a comma-separated string
                                initialSize = user.size.split(',').map(s => s.trim());
                            }
                        } catch (e) {
                            // If JSON parsing fails, assume it's a comma-separated string
                            initialSize = user.size.split(',').map(s => s.trim());
                        }
                    }
                }

                // Initialize customLength and customWidth if 'Custom' size was previously set
                let initialCustomLength = user.customLength || '';
                let initialCustomWidth = user.customWidth || '';
                let calculatedSqft = '';

                // Recalculate sqft based on fetched data
                let fetchedTotalSqft = 0;
                if (initialSize.length > 0) {
                    initialSize.forEach(sizeValue => {
                        if (sizeValue === 'Custom') {
                            const length = parseFloat(initialCustomLength);
                            const width = parseFloat(initialCustomWidth);
                            if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
                                fetchedTotalSqft += (length * width);
                            }
                        } else {
                            const dimensions = sizeValue.split('x').map(Number);
                            if (dimensions.length === 2 && !isNaN(dimensions[0]) && !isNaN(dimensions[1])) {
                                fetchedTotalSqft += (dimensions[0] * dimensions[1]);
                            }
                        }
                    });
                }
                calculatedSqft = fetchedTotalSqft > 0 ? fetchedTotalSqft.toString() : '';


                setFormData({
                    title: user.title || '',
                    city: user.city || '',
                    area: user.area || '',
                    displayType: user.displayType || '',
                    displaySubType: user.displaySubType || '',
                    price: user.price || '',
                    size: initialSize, // Set as array
                    customLength: initialCustomLength,
                    customWidth: initialCustomWidth,
                    sqft: calculatedSqft,
                    lights: user.displayType === 'Digital' ? 'false' : (user.lights !== undefined && user.lights !== null ? String(user.lights) : ''),
                    availability: formattedAvailabilityDate,
                    installedAt: user.installedAt || '',
                    impression: user.impression || '',
                    reach: user.reach || '',
                    trafficComingFrom: user.trafficComingFrom || '',
                    trafficGoingToward: user.trafficGoingToward || '',
                    environment: Array.isArray(user.environment)
                        ? user.environment
                        : typeof user.environment === 'string'
                            ? (() => {
                                try {
                                    const parsed = JSON.parse(user.environment);
                                    return Array.isArray(parsed) ? parsed : []; // Return empty array if not array
                                } catch (e) {
                                    return []; // Return empty array if parsing fails
                                }
                            })()
                            : [],
                    image: null,
                    currentImage: user.image || '',
                    displayId: user.displayId !== undefined && user.displayId !== null ? String(user.displayId) : '',
                    province: user.province || '',
                    location: user.location || '',
                    ownerName: user.ownerName || '',
                });
                setOriginalDisplayIdValue(user.displayId !== undefined && user.displayId !== null ? String(user.displayId) : '');
                if (user.province) {
                    setAvailableCities(citiesByProvince[user.province] || []);
                } else {
                    setAvailableCities([]);
                }
            })
            .catch(err => {
                console.error("Error fetching billboard for update:", err);
                showMessageBox(`Failed to load billboard data: ${err.response?.data?.message || err.message}`);
                navigate('/'); // Redirect home if data can't be loaded
            });
    }, [id, navigate]); // Added navigate to dependencies for useCallback safety

    // Effect to update available cities when province changes
    useEffect(() => {
        if (formData.province) {
            setAvailableCities(citiesByProvince[formData.province] || []);
        } else {
            setAvailableCities([]);
        }
    }, [formData.province]);

    // Effect for debounced displayId uniqueness check
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            const currentDisplayId = formData.displayId.trim();
            if (!currentDisplayId) {
                setDisplayIdError('');
                setIsCheckingDisplayId(false);
                return;
            }
            if (currentDisplayId === originalDisplayIdValue) {
                setDisplayIdError('');
                setIsCheckingDisplayId(false);
                return;
            }
            if (isNaN(Number(currentDisplayId))) {
                setDisplayIdError('Display ID must be a number.');
                setIsCheckingDisplayId(false);
                return;
            }
            setIsCheckingDisplayId(true);
            try {
                const response = await axios.get(`https://backend-s2hb.vercel.app/filter?displayId=${currentDisplayId}`);
                if (response.data.totalCount > 0) {
                    const foundBillboard = response.data.billboards.find(b => String(b.displayId) === currentDisplayId); // Ensure comparison is string to string
                    if (foundBillboard && foundBillboard._id === id) {
                        setDisplayIdError('');
                    } else {
                        setDisplayIdError('This Display ID is already taken by another billboard.');
                    }
                }
                else {
                    setDisplayIdError(''); // No billboard found with this displayId, so it's unique
                }
            } catch (err) {
                console.error('Error checking Display ID uniqueness:', err);
                setDisplayIdError('Failed to check ID. Please try again.');
            } finally {
                setIsCheckingDisplayId(false);
            }
        }, 500); // 500ms debounce time
        return () => clearTimeout(delayDebounceFn); // Cleanup timeout on unmount or re-render
    }, [formData.displayId, id, originalDisplayIdValue]); // Re-run effect when displayId, current billboard ID, or original displayId changes

    // Generic handler for most input fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            let newState = { ...prev };
            if (name === 'displayId') {
                if (value === '' || /^\d*$/.test(value)) {
                    newState[name] = value;
                } else {
                    newState[name] = value; // Still update the state so user sees what they typed
                }
            } else {
                newState[name] = type === 'checkbox' ? checked : value;
            }

            if (name === 'displayType') {
                newState.displaySubType = ''; // Reset subType when displayType changes
                if (value === 'Digital') {
                    newState.lights = 'false'; // Set lights to 'false' (string) for digital
                } else {
                    if (prev.displayType === 'Digital' && prev.lights === 'false') {
                        newState.lights = ''; // Reset to empty for 'Any' if it was forced to 'false'
                    }
                }
            }
            setGeneralErrorMessage(''); // Clear general error message on any input change
            return newState;
        });
    };

    // Handler for React-Select for 'environment'
    const handleEnvironmentChange = (selectedOptions) => {
        setFormData(prev => ({
            ...prev,
            environment: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    // Handler for React-Select for 'size'
    const handleSizeChange = (selectedOptions) => {
        const newSizes = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => {
            const newState = {
                ...prev,
                size: newSizes,
            };

            // If 'Custom' is no longer selected, clear customLength and customWidth
            if (!newSizes.includes('Custom')) {
                newState.customLength = '';
                newState.customWidth = '';
            }
            return newState;
        });
    };

    // Handler for province change (resets city)
    const handleProvinceChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            city: ''
        }));
    };

    // Handler for image file input
    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    // Custom message box display function
    const showMessageBox = (message) => {
        setGeneralErrorMessage(message); // Set the error message to be displayed
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralErrorMessage(''); // Clear any previous general error messages

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
            if (key === 'image' || key === 'currentImage') continue; // Don't append currentImage to FormData

            // Skip customLength, customWidth if 'Custom' size is not selected
            if (!formData.size.includes('Custom') && (key === 'customLength' || key === 'customWidth')) {
                continue;
            }
            // Skip lights if displayType is Digital
            if (key === 'lights' && formData.displayType === 'Digital') {
                continue;
            }

            if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
                if (key === 'environment' && Array.isArray(formData[key])) {
                    // Stringify 'environment' array to JSON
                    data.append(key, JSON.stringify(formData[key]));
                } else if (key === 'size' && Array.isArray(formData[key])) {
                    // Append 'size' array directly (FormData will convert to comma-separated string)
                    data.append(key, formData[key]);
                }
                else if (typeof formData[key] === 'boolean') {
                    data.append(key, String(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            }
        }

        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await axios.put(`https://backend-s2hb.vercel.app/updateBillboard/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Billboard updated successfully:', JSON.stringify(response.data, null, 2));
            showMessageBox('Billboard updated successfully!'); // Use custom message box
            navigate('/');
        } catch (err) {
            console.error('Error updating billboard:', err);
            let clientErrorMessage = 'Failed to update billboard. Check console for details.';
            if (err.response) {
                if (err.response.status === 409 && err.response.data.message) {
                    clientErrorMessage = err.response.data.message; // Use specific message from backend
                } else {
                    clientErrorMessage = `Server error: ${err.response.status} - ${err.response.data.error || err.response.statusText}`;
                }
            } else if (err.request) {
                clientErrorMessage = 'Network error: Backend server might not be running or reachable.';
            } else {
                clientErrorMessage = `An unexpected error occurred: ${err.message}`;
            }
            showMessageBox(clientErrorMessage); // Use custom message box
        }
    };

    // Prepare selected options for React-Select components
    const selectedEnvironmentOptions = Array.isArray(formData.environment)
        ? environmentOptions.filter(opt => formData.environment.includes(opt.value))
        : [];

    const selectedSizeOptions = Array.isArray(formData.size)
        ? sizeOptions.filter(opt => formData.size.includes(opt.value))
        : [];

    return (
        <div className='update-user-page-wrapper'>
            <div className='update-user-form-container'>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <h2 className="mb-4">Update Billboard</h2>
                    <Link to="/" className="btn btn-outline-primary mb-4">← Back to All Billboards</Link>

                    {generalErrorMessage && (
                        <div className="error-message-box">
                            {generalErrorMessage}
                            <button className="close-error" onClick={() => setGeneralErrorMessage('')}>&times;</button>
                        </div>
                    )}
                    <div className="form-field-row">
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Title</label>
                            <input name="title" type="text" className='form-control' value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Display ID</label>
                            <input
                                name="displayId"
                                type="text"
                                className={`form-control ${displayIdError ? 'is-invalid' : ''}`}
                                value={formData.displayId}
                                onChange={handleChange}
                            />
                            {isCheckingDisplayId && <div className="text-muted small mt-1">Checking ID...</div>}
                            {displayIdError && <div className="invalid-feedback">{displayIdError}</div>}
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Media Owner</label>
                            <input name="ownerName" type="text" className='form-control' value={formData.ownerName} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-field-row">
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Province</label>
                            <select name="province" className='form-control' value={formData.province} onChange={handleProvinceChange}>
                                <option value="">Select Province</option>
                                {Object.keys(citiesByProvince).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">City</label>
                            <select name="city" className='form-control' value={formData.city} onChange={handleChange} disabled={!formData.province}>
                                <option value="">Select City</option>
                                {availableCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Area</label>
                            <input name="area" type="text" className='form-control' value={formData.area} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-field-row">
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Location</label>
                            <input name="location" type="text" className='form-control' value={formData.location} onChange={handleChange} />
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Display Type</label>
                            <select name="displayType" className='form-control' value={formData.displayType} onChange={handleChange}>
                                <option value="">Select Type</option>
                                {displayTypeOptions.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        {formData.displayType && (
                            <div className="form-field-col col-md-4">
                                <label className="form-label">{formData.displayType} Type</label>
                                <select
                                    name="displaySubType"
                                    className='form-control'
                                    value={formData.displaySubType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select {formData.displayType} Type</option>
                                    {displaySubTypes[formData.displayType] && displaySubTypes[formData.displayType].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="form-field-row">
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Price</label>
                            <input name="price" type="number" className='form-control' value={formData.price} onChange={handleChange} />
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Size</label>
                            <Select
                                isMulti
                                name="size"
                                options={sizeOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={selectedSizeOptions}
                                onChange={handleSizeChange}
                                placeholder="Select Sizes"
                            />
                        </div>
                        {formData.size.includes('Custom') && (
                            <>
                                <div className="form-field-col col-md-2">
                                    <label className="form-label">Custom Length</label>
                                    <input
                                        name="customLength"
                                        type="number"
                                        className='form-control'
                                        value={formData.customLength}
                                        onChange={handleChange}
                                        placeholder="Length"
                                    />
                                </div>
                                <div className="form-field-col col-md-2">
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
                            </>
                        )}
                        <div className="form-field-col col-md-4">
                            <label className="form-label">SQFT</label>
                            <input
                                name="sqft"
                                type="text"
                                className='form-control'
                                value={formData.sqft}
                                readOnly
                                placeholder="Calculated SQFT"
                            />
                        </div>
                        {formData.displayType === 'Static' && (
                            <div className="form-field-col col-md-4">
                                <label className="form-label">Lights</label>
                                <select
                                    name="lights"
                                    className="form-control"
                                    value={formData.lights}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="form-field-row">
                        <div className="form-field-col col-md-6">
                            <label className="form-label">Availability Date</label>
                            <input
                                name="availability"
                                type="date"
                                className='form-control'
                                value={formData.availability}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-field-row">
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Installed At</label>
                            <select name="installedAt" className='form-control' value={formData.installedAt} onChange={handleChange}>
                                <option value="">Select Location</option>
                                {installedAtOptions.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Impression</label>
                            <input name="impression" type="number" className='form-control' value={formData.impression} onChange={handleChange} />
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Reach</label>
                            <input name="reach" type="number" className='form-control' value={formData.reach} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-field-row">
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Traffic Coming From</label>
                            <input name="trafficComingFrom" type="text" className='form-control' value={formData.trafficComingFrom} onChange={handleChange} />
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Traffic Going Toward</label>
                            <input name="trafficGoingToward" type="text" className='form-control' value={formData.trafficGoingToward} onChange={handleChange} />
                        </div>
                        <div className="form-field-col col-md-4">
                            <label className="form-label">Environment</label>
                            <Select
                                isMulti
                                name="environment"
                                options={environmentOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={selectedEnvironmentOptions}
                                onChange={handleEnvironmentChange}
                                placeholder="Select Environments"
                            />
                        </div>
                    </div>
                    <div className="form-field-row">
                        <label className="form-label">Upload New Image (Optional)</label>
                        <input type="file" name="image" className="form-control" onChange={handleImageChange} accept="image/*" />
                    </div>
                    {formData.currentImage && (
                        <div className='current-image-preview'>
                            <label className="form-label">Current Image:</label><br />
                            <img src={formData.currentImage} alt="current billboard" className="img-thumbnail" />
                        </div>
                    )}
                    <button type="submit" className='btn btn-primary update-button' style={{ background: '#ffc107', border: 'none' }}>Update Billboard</button>
                </form>
            </div>
        </div>
    );
}
export default UpdateUser;
