import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom"; // 👈 'useSearchParams' added here
import { Form, Button, Spinner, Alert, Dropdown, Modal, Pagination } from "react-bootstrap";
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import FilterSidebar from './FilterSidebar';
import BillboardControls from './BillboardControls';
import DownloadFileNameModal from './DownloadFileNameModal';
import './Users.css';

const calculateSqftForDisplay = (size, customLength, customWidth, storedSqft) => {
    if (storedSqft !== null && storedSqft !== undefined && storedSqft !== '') {
        const numSqft = parseFloat(storedSqft);
        if (!isNaN(numSqft)) {
            return numSqft;
        }
    }
    if (size === 'Custom' && customLength && customWidth) {
        const length = parseFloat(customLength);
        const width = parseFloat(customWidth);
        if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
            return (length * width);
        }
    } else if (size && size !== 'Custom') {
        const dimensions = size.split('x').map(Number);
        if (dimensions.length === 2 && !isNaN(dimensions[0]) && !isNaN(dimensions[1])) {
            return (dimensions[0] * dimensions[1]);
        }
    }
    return 'N/A';
};
function Users() {
    const [searchParams] = useSearchParams(); 
    const [users, setUsers] = useState([]);
const handleShowCompare = () => {
    localStorage.setItem("compareList", JSON.stringify(compareList));
    setShowCompareOnly(true);
    setShowCampaignOnly(false);
};
const handleShowCampaign = () => {
    localStorage.setItem("campaignList", JSON.stringify(campaignList));
    setShowCampaignOnly(true);
    setShowCompareOnly(false);
};
    const [compareList, setCompareList] = useState([]);
const [showCompareOnly, setShowCompareOnly] = useState(false);
const [showCampaignOnly, setShowCampaignOnly] = useState(false);
const [campaignList, setCampaignList] = useState([]);
    const [availableCities, setAvailableCities] = useState([]);
    const [customField, setCustomField] = useState('');
    const [customValue, setCustomValue] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        displayId: '',
        keyword: '',
        province: [],
        city: [],
        area: '',
        location: '',
        displayType: '',
        displaySubType: [],
        minPrice: '',
        maxPrice: '',
        priceRange: '',
        size: [],
        minSqft: '',
        maxSqft: '',
        installedAt: [],
        lights: '',
        availability: '',
        trafficComingFrom: '',
        trafficGoingToward: '',
        environment: [],
        minImpression: '',
        maxImpression: '',
        minReach: '',
        maxReach: '',
        customFilters: [],
    });
    const [sortOption, setSortOption] = useState('');
    const [currentSortLabel, setCurrentSortLabel] = useState('Sort By');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [downloadButtonsEnabled, setDownloadButtonsEnabled] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [billboardToDelete, setBillboardToDelete] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [billboardToUpdate, setBillboardToUpdate] = useState(null);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadFileType, setDownloadFileType] = useState(null);
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
    const staticSubTypes = [
        { value: 'Billboard', label: 'Billboard' },
        { value: 'Bridge Panel', label: 'Bridge Panel' },
        { value: 'Under Passes', label: 'Under Passes' },
        { value: 'Streamers', label: 'Streamers' },
        { value: 'Mopi', label: 'Mopi' },
        { value: 'Gantry', label: 'Gantry' },
        { value: 'Bus Shelter', label: 'Bus Shelter' },
        { value: 'T Sign', label: 'T Sign' },
        { value: 'Floats', label: 'Floats' }
    ];
    const digitalSubTypes = [
        { value: 'SMD', label: 'SMD' },
        { value: '3D SMD', label: '3D SMD' },
        { value: 'Digital Streamers', label: 'Digital Streamers' },
        { value: 'Digital Mopies', label: 'Digital Mopies' },
        { value: 'Digital Floats', label: 'Digital Floats' }
    ];
    const displayTypeOptions = ['Static', 'Digital'];
    const installedAtOptions = ['Ground', 'Wall', 'Pole', 'Rooftop'];
    
    const buildQueryParams = (currentFilters, currentSortOption, page, limit) => {
        const params = {};
        console.log("FILTERS sent to buildQueryParams:", currentFilters);
        const arrayFilterKeys = [
            'province', 'city', 'displaySubType', 'size', 'installedAt', 'environment'
        ];
        for (const key in currentFilters) {
            if (key !== 'customFilters' && currentFilters[key] !== '' && currentFilters[key] !== null) {
                if (arrayFilterKeys.includes(key) && Array.isArray(currentFilters[key])) {
                    if (currentFilters[key].length > 0) {
                        params[key] = currentFilters[key].join(',');
                    }
                } else {
                    params[key] = currentFilters[key];
                }
            }
        }
        if (currentFilters.customFilters.length > 0) {
            params.customFilters = JSON.stringify(currentFilters.customFilters);
        }
        if (currentSortOption) {
            params.sortOption = currentSortOption;
        }
        params.page = page;
        params.limit = limit;

        return params;
    };
    const displayedUsers = showCompareOnly 
    ? compareList 
    : showCampaignOnly 
        ? campaignList 
        : users;
useEffect(() => {
    const showCompare = searchParams.get("showCompare") === "true";
    const showCampaign = searchParams.get("showCampaign") === "true";

    if (showCompare) {
        const list = JSON.parse(localStorage.getItem("compareList")) || [];
        setCompareList(list);
        setTotalItems(list.length);
        setShowCompareOnly(true);
        setShowCampaignOnly(false);
    } else if (showCampaign) {
        const list = JSON.parse(localStorage.getItem("campaignList")) || [];
        setCampaignList(list);
        setTotalItems(list.length);
        setShowCampaignOnly(true);
        setShowCompareOnly(false);
    }
}, [searchParams]);
    const fetchBillboards = useCallback(async () => {
        setLoading(true);
        setError(null);
        setDownloadButtonsEnabled(false);
        try {
            // Your new logic: Check for URL query parameters
            const filterFromUrl = searchParams.get("filter");
            const valueFromUrl = searchParams.get("value");

            let queryParams;
            let url;

            if (filterFromUrl && valueFromUrl) {
                // If URL has filters, use a simplified URL
                url = "https://backend-s2hb.vercel.app/api/billboards";
                queryParams = { filter: filterFromUrl, value: valueFromUrl };
            } else {
                // Otherwise, use the advanced filter URL and logic
                url = 'https://backend-s2hb.vercel.app/filter';
                queryParams = buildQueryParams(filters, sortOption, currentPage, itemsPerPage);
            }

            const result = await axios.get(url, {
                params: queryParams
            });
            setUsers(result.data.billboards || result.data); // handles both formats
            setTotalItems(result.data.totalCount || result.data.length);
            setDownloadButtonsEnabled((result.data.billboards && result.data.billboards.length > 0) || (result.data && result.data.length > 0));
        } catch (err) {
            console.error("Error fetching billboards:", err?.response?.data || err?.message || err);
            if (err.response) {
                setError(`Error: ${err.response.status} - ${err.response.data.error || err.response.statusText}`);
            } else if (err.request) {
                setError("Network error: Backend server might not be running or reachable.");
            } else {
                setError("An unexpected error occurred while fetching billboards.");
            }
        } finally {
            setLoading(false);
        }
    }, [filters, sortOption, currentPage, itemsPerPage, searchParams]); // 👈 Added 'searchParams' as a dependency

    useEffect(() => {
        fetchBillboards();
    }, [fetchBillboards]); // This 'useEffect' will now run whenever 'searchParams' or any other dependency of 'fetchBillboards' changes.

    useEffect(() => {
        let newAvailableCities = [];
        if (filters.province && Array.isArray(filters.province) && filters.province.length > 0) {
            filters.province.forEach(prov => {
                if (citiesByProvince[prov]) {
                    newAvailableCities = newAvailableCities.concat(citiesByProvince[prov]);
                }
            });
            newAvailableCities = [...new Set(newAvailableCities)];
        }
        setAvailableCities(newAvailableCities);
        setFilters(prev => ({ ...prev, city: [] }));
    }, [filters.province]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1);
    };

    const handleSortSelect = (eventKey) => {
        setSortOption(eventKey);
        switch (eventKey) {
            case 'minToMax': setCurrentSortLabel('Price: Low to High'); break;
            case 'maxToMin': setCurrentSortLabel('Price: High to Low'); break;
            case 'recentlyAdded': setCurrentSortLabel('Recently Added Billboard'); break;
            default: setCurrentSortLabel('Sort By'); break;
        }
        setCurrentPage(1);
    };

    const handleReset = () => {
        setFilters({
            displayId: '',
            keyword: '',
            province: [],
            city: [],
            area: '',
            location: '',
            displayType: '',
            priceRange: '',
            size: [],
            minSqft: '',
            maxSqft: '',
            installedAt: [],
            lights: '',
            availability: '',
            trafficComingFrom: '',
            trafficGoingToward: '',
            environment: [],
            minImpression: '',
            maxImpression: '',
            minReach: '',
            maxReach: '',
            customFilters: [],
        });
        setAvailableCities([]);
        setDownloadButtonsEnabled(false);
        setSortOption('');
        setCurrentSortLabel('Sort By');
        setCurrentPage(1);
        setCustomField('');
        setCustomValue('');
    };

    const addCustomFilter = () => {
        if (customField.trim() && customValue.trim()) {
            setFilters(prev => ({
                ...prev,
                customFilters: [...prev.customFilters, { field: customField.trim(), value: customValue.trim() }]
            }));
            setCustomField('');
            setCustomValue('');
            setCurrentPage(1);
        } else {
            setError("Please enter both a field name and a value for the custom filter.");
            setTimeout(() => setError(null), 3000);
        }
    };

    const removeCustomFilter = (indexToRemove) => {
        setFilters(prev => ({
            ...prev,
            customFilters: prev.customFilters.filter((_, index) => index !== indexToRemove)
        }));
        setCurrentPage(1);
    };

    const handleFilter = async (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBillboards();
    };

    const handleDelete = (id) => {
        setBillboardToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setShowDeleteModal(false);
        if (!billboardToDelete) return;
        try {
            const response = await axios.delete(`https://backend-s2hb.vercel.app/deleteUser/${billboardToDelete}`);
            if (response.status === 200 || response.status === 204) {
                fetchBillboards();
                setError("Billboard deleted successfully!");
                setTimeout(() => setError(null), 3000);
            } else {
                setError(`Failed to delete billboard. Server responded with status: ${response.status}.`);
            }
        } catch (err) {
            console.error("Error deleting billboard:", err.response ? err.response.data : err.message || err);
            let errorMessage = "Failed to delete billboard. Please try again.";
            if (err.response) {
                if (err.response.data && err.response.data.error) {
                    errorMessage = `Error: ${err.response.data.error}`;
                } else {
                    errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
                }
            } else if (err.request) {
                errorMessage = "Network error: Could not reach the server. Please check your connection or if the backend is running.";
            } else {
                errorMessage = `An unexpected error occurred: ${err.message}`;
            }
            setError(errorMessage);
        } finally {
            setBillboardToDelete(null);
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleUpdate = (id) => {
        setBillboardToUpdate(id);
        setShowUpdateModal(true);
    };

    const confirmUpdate = () => {
        setShowUpdateModal(false);
        if (billboardToUpdate) {
            window.location.href = `/update/${billboardToUpdate}`;
        }
        setBillboardToUpdate(null);
    };
const toggleCompare = (user) => {
    const exists = compareList.find(item => item._id === user._id);
    if (exists) {
        setCompareList(compareList.filter(item => item._id !== user._id));
    } else {
        setCompareList([...compareList, user]); // No limit now
    }
};
    const triggerExcelDownloadModal = () => {
        setDownloadFileType('excel');
        setShowDownloadModal(true);
    };

    const triggerPPTDownloadModal = () => {
        setDownloadFileType('ppt');
        setShowDownloadModal(true);
    };

    const handleActualDownload = async (fileType, fileName) => {
        setShowDownloadModal(false);
        setLoading(true);
        setError(null);
        try {
            let queryParams = { fileName };

if (showCompareOnly) {
    // ✅ ONLY compare billboards
    queryParams.ids = compareList.map(item => item._id).join(',');
}
else if (showCampaignOnly) {
    // ✅ ONLY campaign billboards
    queryParams.ids = campaignList.map(item => item._id).join(',');
}
else {
    // ✅ NORMAL behaviour (filters)
    queryParams = {
        ...buildQueryParams(filters, sortOption, 1, totalItems),
        fileName
    };
}
            console.log(`[Users.jsx] Initiating download of ${fileType} with filename: "${fileName}"`);
            console.log(`[Users.jsx] Query params for download:`, queryParams);
            const response = await axios.get(`https://backend-s2hb.vercel.app/download-${fileType}`, {
                params: queryParams,
                responseType: 'blob',
            });
            if (response.status !== 200) {
                const errorBlob = await new Blob([response.data]).text();
                let errorMessage = `Failed to download ${fileType} file. Status: ${response.status}.`;
                try {
                    const errorJson = JSON.parse(errorBlob);
                    errorMessage += ` Server message: ${errorJson.error || JSON.stringify(errorJson)}.`;
                } catch (e) {
                    errorMessage += ` Response: ${errorBlob || 'No detailed error message.'}`;
                }
                throw new Error(errorMessage);
            }
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.${fileType === 'excel' ? 'xlsx' : 'pptx'}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setError(`Success: ${fileName}.${fileType === 'excel' ? 'xlsx' : 'pptx'} downloaded.`);
            setTimeout(() => setError(null), 3000);
        } catch (err) {
            console.error(`[Users.jsx] Error downloading ${fileType}:`, err);
            let displayErrorMessage = "An unknown error occurred.";
            if (err.response && err.response.data instanceof Blob) {
                displayErrorMessage = err.message;
            } else if (err.response && err.response.data && err.response.data.error) {
                displayErrorMessage = err.response.data.error;
            } else {
                displayErrorMessage = err.message;
            }
            setError(`Error: Failed to download ${fileType} file. ${displayErrorMessage}`);
        } finally {
            setLoading(false);
            setDownloadFileType(null);
        }
    };

    const timeAgo = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + ' years ago';
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + ' months ago';
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + ' days ago';
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + ' hours ago';
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + ' minutes ago';
        }
        return Math.floor(seconds) + ' seconds ago';
    };

    return (
        <div className="users-page-wrapper bg-white">
            <FilterSidebar
                filters={filters}
                availableCities={availableCities}
                customField={customField}
                customValue={customValue}
                loading={loading}
                citiesByProvince={citiesByProvince}
                environmentOptions={environmentOptions}
                displayTypeOptions={displayTypeOptions}
                installedAtOptions={installedAtOptions}
                handleChange={handleChange}
                handleFilter={handleFilter}
                addCustomFilter={addCustomFilter}
                removeCustomFilter={removeCustomFilter}
                setCustomField={setCustomField}
                setCustomValue={setCustomValue}
                handleReset={handleReset}
                setFilters={setFilters}
                setCurrentPage={setCurrentPage}
                className="filter-sidebar"
            />
            <div className="main-content-area bg-white">
                <BillboardControls
                    loading={loading}
                    downloadButtonsEnabled={downloadButtonsEnabled}
                    sortOption={sortOption}
                    currentSortLabel={currentSortLabel}
                    handleSortSelect={handleSortSelect}
                    handleDownloadExcel={triggerExcelDownloadModal}
                    handleDownloadPPT={triggerPPTDownloadModal}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    totalItems={showCompareOnly || showCampaignOnly ? displayedUsers.length : totalItems}
                    error={error}
                    setError={setError}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
                {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
                {loading && (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}
                {!loading && users.length === 0 && !error && (
                    <Alert variant="info" className="text-center">
                        No billboards found matching your criteria.
                    </Alert>
                )}
                {!loading && users.length > 0 && (
                    <>
                        <div className={viewMode === "grid" ? "row g-4" : "d-flex flex-column gap-3"}>
                           {displayedUsers.map(user => (
                                <div
                                    key={user._id}
                                    className={viewMode === "grid" ? "col-12 col-sm-6 col-md-6 col-lg-6 billboard-card-col" : "w-100"}
                                >
                                    <div
                                        className={`card billboard-card bg-light ${viewMode === "list" ? "flex-row" : ""}`}
                                        style={{ borderRadius: '0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                    >
                                        <div
                                            className={`card-image-wrapper ${viewMode === "list" ? "w-50" : ""}`}
                                            style={{ maxHeight: viewMode === "list" ? '350px' : '250px', overflow: 'hidden' }}
                                        >
                                            <Link to={`/display/${user._id}`}>
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.title || 'Billboard Image'}
                                                        className="card-img-top card-image"
                                                    />
                                                ) : (
                                                    <div className="no-image-placeholder">
                                                        No Image Available
                                                    </div>
                                                )}
                                            </Link>
                                            {user.city && (
                                                <span className="city-tag" style={{
                                                    position: 'absolute', top: '10px', right: '0',
                                                    backgroundColor: '#ffc107', color: 'black', padding: '5px 10px',
                                                    fontSize: '0.8rem', fontWeight: 'bold'
                                                }}>
                                                    {user.city.toUpperCase()}
                                                </span>
                                            )}
                                            <span
                                                className="position-absolute"
                                                style={{ top: '10px', left: '0' }}
                                            >
                                                <span
                                                    style={{
                                                        backgroundColor: '#ffc107',
                                                        width: '25px',
                                                        height: '25px',
                                                        borderRadius: '0px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <FaStar color="white" size="1em" />
                                                </span>
                                            </span>
                                            <span
                                                className="position-absolute"
                                                style={{ bottom: '10px', right: '10px' }}
                                            >
                                                <FaHeart color="white" size="1.5em" />
                                            </span>
                                        </div>
                                        <div
                                            className={`card-body card-body-content ${viewMode === "list" ? "w-50" : ""} d-flex flex-column justify-content-between`}
                                            style={{ backgroundColor: "#F5F5F5" }}
                                        >
                                            <div>
                                                <h5 className="card-title card-title-custom" style={{ color: '#000', lineHeight: '1.2' }}>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                        BILLBOARD AT{' '}
                                                    </span>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                        {user.title || 'N/A'}
                                                    </span>
                                                </h5>
                                                {user.location && (
                                                    <p className="card-text card-text-detail" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                        <FaMapMarkerAlt className="me-1" /> {user.location}
                                                    </p>
                                                )}
                                                <h4 className="card-price" style={{ color: '#ffc107', fontSize: '1.5rem', fontWeight: 'bold', margin: '10px 0' }}>
                                                    Rs. {user.price ? user.price.toLocaleString() : 'N/A'}
                                                </h4>
                                                <p className="card-text card-text-detail" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '5px' }}>
                                                    <span className="fw-bold text-dark">Province:</span> {user.province || 'N/A'}<span className="fw-bold text-dark ms-3">City:</span> {user.city || 'N/A'}
                                                </p>
                                                <p className="card-text card-text-detail" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '5px' }}>
                                                    <span className="fw-bold text-dark">Area:</span> {user.area || 'N/A'}
                                                </p>
                                                <p className="card-text card-text-detail" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '5px' }}>
                                                    <span className="fw-bold text-dark ">Location:</span> {user.location || 'N/A'}
                                                </p>
                                                <p className="card-text card-text-detail" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '5px' }}>
                                                    <span className="fw-bold text-dark">Display Type:</span> {user.displayType || 'N/A'}
                                                    <span className="fw-bold text-dark ms-3">Size:</span> {user.size || 'N/A'}
                                                    <span className="fw-bold text-dark ms-3">SQFT:</span> {calculateSqftForDisplay(user.size, user.customLength, user.customWidth, user.sqft)}
                                                </p>
                                                <p className="card-text card-text-detail" style={{ fontSize: '0.9rem', color: '#555', marginBottom: '5px' }}>
                                                    <span className="fw-bold text-dark ">Installed At:</span> {user.installedAt || 'N/A'}
                                                    <span className="fw-bold text-dark ms-3">Lights:</span> {user.lights ? 'Yes' : 'No'}
                                                </p>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <small className="text-muted">{timeAgo(user.createdAt)}</small>
                                                <div className="d-flex gap-2">
 <Button
  onClick={() => toggleCompare(user)}
  style={{
    backgroundColor: compareList.some(item => item._id === user._id) ? "#ffc107" : "transparent",
    border: compareList.some(item => item._id === user._id) ? "1px solid #ffc107" : "none",
    color: compareList.some(item => item._id === user._id) ? "white" : "black",
  }}
>
  {compareList.some(item => item._id === user._id) ? "Added" : "Compare"}
</Button>
{campaignList.length > 0 && (
    <div style={{
        position: "fixed",
        bottom: showCompareOnly ? "60px" : "0px",
        left: 0,
        right: 0,
        borderTop: "8px solid #ffc107",
        backgroundColor: "white",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        zIndex: 9999,
        gap: "10px",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
        color: "black",
    }}>
        <strong>Campaign ({campaignList.length})</strong>

        <button
            onClick={handleShowCampaign}
            disabled={campaignList.length === 0}
            style={{ background: "transparent", border: "none", padding: "5px 10px", cursor: "pointer" }}
        >
            Show
        </button>

        <button
            onClick={() => { setCampaignList([]); setShowCampaignOnly(false); }}
            style={{ background: "transparent", border: "none", padding: "5px 10px", cursor: "pointer" }}
        >
            Clear
        </button>
    </div>
)}
                                                    <Button onClick={() => handleUpdate(user._id)} variant="primary" size="sm" className="d-flex align-items-center">
                                                        Update
                                                    </Button>
                                                    <Button onClick={() => handleDelete(user._id)} variant="danger" size="sm" className="d-flex align-items-center">
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this billboard? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Update</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to update this billboard? You will be redirected to the update page.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmUpdate}>
                        Proceed to Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <DownloadFileNameModal
                show={showDownloadModal}
                handleClose={() => setShowDownloadModal(false)}
                handleDownload={handleActualDownload}
                fileType={downloadFileType}
            />
           {(compareList.length > 0 || showCompareOnly) && (
    <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "8px solid #ffc107",
        backgroundColor: "white",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        zIndex: 9999,
        gap: "10px",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
        color: "black",
    }}>
        <div style={{ marginLeft: "50px" }}>
            <strong>Compare ({compareList.length})</strong>
        </div>

       <button
  onClick={() => {
    localStorage.setItem("compareList", JSON.stringify(compareList));
    setShowCompareOnly(true);
    setShowCampaignOnly(false);
  }}
>
  Show
</button>
        <button
            onClick={() => { setCompareList([]); setShowCompareOnly(false); }}
            style={{
                background: "transparent",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                color: "black",
                cursor: "pointer",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#ffc107"}
            onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
            Clear
        </button>
    </div>
)}

        </div>
    );
}

export default Users;