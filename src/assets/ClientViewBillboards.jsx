import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Spinner, Alert, Dropdown, Pagination } from "react-bootstrap"; // Removed Modal as no CRUD actions
import { FaHeart, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

// FilterSidebar and BillboardControls are removed for the client-side view
// import FilterSidebar from './FilterSidebar';
// import BillboardControls from './C_Billboards'; // Example if you had a client-specific control component

function ClientViewBillboards() {
    // State for managing billboard data
    const [billboards, setBillboards] = useState([]); // Renamed 'users' to 'billboards' for clarity
    // ======================
// Compare & Campaign (PERSISTENT)
// ======================
const [compareList, setCompareList] = useState(() =>
  JSON.parse(localStorage.getItem("compareList")) || []
);

const [campaignList, setCampaignList] = useState(() =>
  JSON.parse(localStorage.getItem("campaignList")) || []
);
    // State for filters (simplified for client view, no direct user input in this component)
    // These filters will likely be passed from URL parameters if dynamic filtering is needed on client side
    const [filters, setFilters] = useState({
        displayId: '',
        keyword: '',
        province: '',
        city: '',
        area: '',
        location: '',
        displayType: '',
        priceRange: '',
        size: '',
        installedAt: '',
        lights: '',
        availability: '',
        trafficComingFrom: '',
        trafficGoingToward: '',
        environment: '',
        customFilters: [], 
    });

    // State for sorting options
    const [sortOption, setSortOption] = useState(''); // Stores the selected sort key (e.g., 'minToMax', 'recentlyAdded')
    const [currentSortLabel, setCurrentSortLabel] = useState('Sort By'); // Displays the label of the current sort option

    // State for loading and error (download buttons removed as they are admin-only)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [downloadButtonsEnabled, setDownloadButtonsEnabled] = useState(false); // Not needed for client view

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1); // Current active page
    const [itemsPerPage] = useState(12); // Number of items to show per page (can be adjusted)
    const [totalItems, setTotalItems] = useState(0); // Total number of filtered items
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

    // Data for dropdowns/select inputs (still needed if sorting or display uses these options)
    const sortOptionsMapping = [
        { key: '', label: 'Default' },
        { key: 'minToMax', label: 'Price: Min to Max' },
        { key: 'maxToMin', label: 'Price: Max to Min' },
        { key: 'recentlyAdded', label: 'Recently Added' },
    ];

    /**
     * Helper function to build query parameters for API calls.
     * Includes filters, sorting, and pagination parameters.
     * @param {object} currentFilters - The current filter state.
     * @param {string} currentSortOption - The current sort option.
     * @param {number} page - The current page number for pagination.
     * @param {number} limit - The number of items per page for pagination.
     * @returns {object} An object containing all query parameters.
     */
    const buildQueryParams = (currentFilters, currentSortOption, page, limit) => {
        const params = {};
        // Add all non-empty filter values
        for (const key in currentFilters) {
            if (key !== 'customFilters' && currentFilters[key] !== '' && currentFilters[key] !== null) {
                params[key] = currentFilters[key];
            }
        }

        // Add custom filters if any
        if (currentFilters.customFilters.length > 0) {
            params.customFilters = JSON.stringify(currentFilters.customFilters);
        }

        // Add sorting option if selected
        if (currentSortOption) {
            params.sortOption = currentSortOption;
        }

        // Add pagination parameters
        params.page = page;
        params.limit = limit;

        return params;
    };

    /**
     * Fetches billboards from the backend based on current filters, sorting, and pagination.
     * This function is called on initial load, filter changes, sort changes, and page changes.
     */
    const fetchBillboards = async () => {
        setLoading(true);
        setError(null);
        try {
            // Build query parameters including current page and items per page
            const queryParams = buildQueryParams(filters, sortOption, currentPage, itemsPerPage);
            
            const result = await axios.get('https://backend-s2hb.vercel.app/filter', {
                params: queryParams
            });

            setBillboards(result.data.billboards); // Set billboards from the 'billboards' array in the response
            setTotalItems(result.data.totalCount); // Set total count from the 'totalCount' in the response
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
    };

    // Effect hook to fetch billboards whenever filters, sortOption, or currentPage changes
    useEffect(() => {
        fetchBillboards();
    }, [filters, sortOption, currentPage]);

    /**
     * Handles selection of a sorting option from the dropdown.
     * @param {string} eventKey - The key of the selected dropdown item.
     * @param {object} event - The event object.
     */
    const handleSortSelect = (eventKey, event) => {
        setSortOption(eventKey); // Set the sort option value
        const selectedLabel = event.target.innerText; // Get the text of the selected item
        setCurrentSortLabel(selectedLabel); // Update the button text
        setCurrentPage(1); // Reset to first page on sort change
    };
    useEffect(() => {
  localStorage.setItem("compareList", JSON.stringify(compareList));
}, [compareList]);

useEffect(() => {
  localStorage.setItem("campaignList", JSON.stringify(campaignList));
}, [campaignList]);

    // Helper function to calculate "time ago"
    const timeAgo = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000; // Seconds in a year
        if (interval > 1) {
            return Math.floor(interval) + ' years ago';
        }
        interval = seconds / 2592000; // Seconds in a month
        if (interval > 1) {
            return Math.floor(interval) + ' months ago';
        }
        interval = seconds / 86400; // Seconds in a day
        if (interval > 1) {
            return Math.floor(interval) + ' days ago';
        }
        interval = seconds / 3600; // Seconds in an hour
        if (interval > 1) {
            return Math.floor(interval) + ' hours ago';
        }
        interval = seconds / 60; // Seconds in a minute
        if (interval > 1) {
            return Math.floor(interval) + ' minutes ago';
        }
        return Math.floor(seconds) + ' seconds ago';
    };
  // Helper function to format date as DD-MM-YYYY
const formatDateDMY = (dateValue) => {
  if (!dateValue) return 'N/A';

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return 'N/A';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

    return (
        <div className="d-flex vh-100 flex-column"> {/* Changed to flex-column for better layout without sidebar */}
            <div className="flex-grow-1 overflow-auto p-4 bg-light">
                {/* Controls for sorting and pagination (removed Add Billboard and Download buttons) */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <span className="me-2">Found: {totalItems} Billboards</span>
                        <Dropdown onSelect={handleSortSelect} className="d-inline-block">
                            <Dropdown.Toggle variant="secondary" id="dropdown-sort" size="sm">
                                {currentSortLabel}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {sortOptionsMapping.map(option => (
                                    <Dropdown.Item key={option.key} eventKey={option.key}>
                                        {option.label}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {totalItems > itemsPerPage && (
                        <Pagination className="mb-0">
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    )}
                </div>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                {loading && (
                    <div className="text-center my-5">
                        <Spinner animation="border" role="status" className="text-primary">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-2">Loading billboards...</p>
                    </div>
                )}

                {!loading && billboards.length === 0 && !error && (
                    <Alert variant="info" className="text-center">
                        No billboards found matching your criteria.
                    </Alert>
                )}

                {!loading && billboards.length > 0 && (
                    <>
                        <div className="row g-4">
                            {billboards.map(billboard => ( // Renamed 'user' to 'billboard' for clarity
                                <div key={billboard._id} className="col-12 col-sm-6 col-md-4 col-lg-4 d-flex">
                                    {/* Start of New Card Design */}
                                    <div className="card h-100 w-100" style={{
                                        border: '2px solid #dc3545', // Red Border
                                        borderRadius: '0', // No border radius
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    }}>
                                        <div className="position-relative" style={{ height: '200px', overflow: 'hidden', backgroundColor: '#e9ecef' }}>
                                            <Link to={`/client-billboards/${billboard._id}`}> {/* Link to individual detail page (client specific) */}
                                                {billboard.image ? (
                                                    <img
                                                        src={billboard.image} // Use base64 data URL directly
                                                        alt={billboard.title || 'Billboard Image'}
                                                        className="card-img-top"
                                                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                    />
                                                ) : (
                                                    <div className="d-flex justify-content-center align-items-center bg-secondary text-white-50" style={{ height: '100%' }}>
                                                        No Image Available
                                                    </div>
                                                )}
                                            </Link>
                                            {/* Top-right Dynamic City Tag */}
                                            {billboard.city && (
                                                <span className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {billboard.city.toUpperCase()}
                                                </span>
                                            )}
                                            {/* Top-left Star icon */}
                                            <span className="position-absolute top-0 start-0 p-2">
                                                <FaStar color="#ffc107" size="1.5em" />
                                            </span>
                                            {/* Bottom-right Heart icon */}
                                            <span className="position-absolute bottom-0 end-0 p-2">
                                                <FaHeart color="white" size="1.5em" />
                                            </span>

                                        </div>

                                        <div className="card-body d-flex flex-column justify-content-between p-3">
                                            <div>
                                                <h5 className="card-title text-uppercase mb-2" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
                                                    Billboard at {billboard.title || 'N/A'}
                                                </h5>
                                                {billboard.location && (
                                                    <p className="card-text mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                        <FaMapMarkerAlt className="me-1" /> {billboard.location}
                                                    </p>
                                                )}
                                                <h4 className="fw-bold my-2" style={{ color: '#ffc107' }}>
                                                    Rs. {billboard.price ? billboard.price.toLocaleString() : 'N/A'}
                                                </h4>
                                                <p className="card-text mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    <span className="fw-bold">Province:</span> {billboard.province || 'N/A'} <span className="fw-bold">City:</span> {billboard.city || 'N/A'}
                                                </p>
                                                <p className="card-text mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    <span className="fw-bold">Area:</span> {billboard.area || 'N/A'}
                                                </p>
                                                <p className="card-text mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    <span className="fw-bold">Location:</span> {billboard.location || 'N/A'}
                                                </p>
                                                <p className="card-text mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    <span className="fw-bold">Display Type:</span> {billboard.displayType || 'N/A'} <span className="fw-bold">Size:</span> {billboard.size || 'N/A'} 
                                                </p>
                                                <p className="card-text mb-1 d-flex justify-content-between align-items-center" style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    <span>
                                                        <span className="fw-bold">Installed At:</span> {billboard.installedAt || 'N/A'}
                                                    </span>
                                                    <span>
                                                        <span className="fw-bold">Lights:</span> {billboard.lights ? 'Yes' : 'No'}
                                                    </span>
                                                </p>
                                            </div>

                                            <div style={{ borderTop: '1px solid #eee', margin: '1rem -1rem 0', padding: '1rem 1rem 0' }}>
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <small className="text-muted">
  {formatDateDMY(billboard.createdAt)}
</small>

                                                    {/* REMOVED: Update and Delete buttons for client view */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End of New Card Design */}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {/* REMOVED: Delete and Update Confirmation Modals for client view */}
        </div>
    );
}

export default ClientViewBillboards;