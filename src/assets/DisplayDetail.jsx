import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, NavLink } from "react-router-dom";
import { Container, Row, Col, ListGroup, Spinner, Form, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaFacebookF, FaTwitter, FaPinterestP, FaLinkedinIn, FaHeart, FaExchangeAlt } from 'react-icons/fa';
import { FaUpRightFromSquare } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import './DisplayDetail.css'


function DisplayDetail() {
  const [compareList, setCompareList] = useState(() => {
    return JSON.parse(localStorage.getItem("compareList")) || [];
});
const [campaignList, setCampaignList] = useState(() => {
    return JSON.parse(localStorage.getItem("campaignList")) || [];
});
const [showCompareBar, setShowCompareBar] = useState(() => {
    const savedList = JSON.parse(localStorage.getItem("compareList")) || [];
    const savedShow = JSON.parse(localStorage.getItem("showCompareBar"));
    return savedShow !== null ? savedShow : savedList.length > 0;
});
const [showCampaignItems, setShowCampaignItems] = useState(false);

const [isHovered, setIsHovered] = useState(false);
const [hoverCompare, setHoverCompare] = useState(false);
const [hoverCampaign, setHoverCampaign] = useState(false);
    const navigate = useNavigate();
    // Compare Show button
const handleShowCompare = () => {
    localStorage.setItem("compareList", JSON.stringify(compareList));
    navigate("/users?showCompare=true");
};

// Campaign Show button
const handleShowCampaign = () => {
    localStorage.setItem("campaignList", JSON.stringify(campaignList));
    navigate("/users?showCampaign=true");
};

    const { id } = useParams();
    const [billboard, setBillboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState('N/A');
    const [staticCount, setStaticCount] = useState('N/A');
    const [replyName, setReplyName] = useState('');
    const [replyPhone, setReplyPhone] = useState('');
    const [replyEmail, setReplyEmail] = useState('');
    const [replyMessage, setReplyMessage] = useState('');

    const [messageBoxMessage, setMessageBoxMessage] = useState('');
      
    const showMessageBox = (message) => {
        setMessageBoxMessage(message);
    };
     const formatDateDMY = (dateValue) => {
    if (!dateValue) return 'N/A';

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'N/A';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
 // Save compareList to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem("compareList", JSON.stringify(compareList));
}, [compareList]);

// Save campaignList to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem("campaignList", JSON.stringify(campaignList));
}, [campaignList]);
useEffect(() => {
    localStorage.setItem("showCompareBar", JSON.stringify(showCompareBar));
}, [showCompareBar]);

    useEffect(() => {
        if (!id) {
            setError("No billboard ID provided in the URL.");
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Single billboard details fetch karega
                const billboardResponse = await axios.get(`https://backend-s2hb.vercel.app/getBillboard/${id}`);
                if (billboardResponse.data) {
                    setBillboard(billboardResponse.data);
                } else {
                    setError("Billboard not found with the given ID.");
                }

                // 2. Total billboards count ke liye API call
                const totalResponse = await axios.get('https://backend-s2hb.vercel.app/api/billboards/total-count');
                setTotalCount(totalResponse.data.totalCount);

                // 3. Static billboards count ke liye API call
                const staticResponse = await axios.get('https://backend-s2hb.vercel.app/api/billboards/static-count');
                setStaticCount(staticResponse.data.staticCount);

            } catch (err) {
                console.error("Error fetching billboard details or counts:", err);
                if (err.response) {
                    setError(`Failed to load details: ${err.response.status} - ${err.response.statusText}.`);
                } else if (err.request) {
                    setError("Network error: Server did not respond.");
                } else {
                    setError(`An unexpected error occurred: ${err.message}`);
                }
                setTotalCount('Error');
                setStaticCount('Error');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        showMessageBox('Your message has been sent!');
        setReplyName('');
        setReplyPhone('');
        setReplyEmail('');
        setReplyMessage('');
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" className="mb-3 text-primary">
                    <span className="visually-hidden">Loading billboard details...</span>
                </Spinner>
                <p>Loading billboard details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 text-center text-danger">
                <h4>Error!</h4>
                <p>{error}</p>
                <Link to="/media" className="btn btn-primary">Back to All Billboards</Link>
            </Container>
        );
    }

    if (!billboard) {
        return (
            <Container className="mt-5 text-center">
                <h4>Billboard Not Found</h4>
                <p>The billboard you are looking for does not exist.</p>
                <Link to="/media" className="btn btn-primary">Back to All Billboards</Link>
            </Container>
        );
    }
    // Toggle billboard in Compare list
const toggleCompare = (billboard) => {
    const alreadyInList = compareList.find(item => item._id === billboard._id);
    if (alreadyInList) {
        const newList = compareList.filter(item => item._id !== billboard._id);
        setCompareList(newList);
        if (newList.length === 0) setShowCompareBar(false);
    } else {
        setCompareList([...compareList, billboard]);
        setShowCompareBar(true);
    }
};
const toggleCampaign = (billboard) => {
  const alreadyInList = campaignList.find(item => item._id === billboard._id);
  if (alreadyInList) {
    setCampaignList(campaignList.filter(item => item._id !== billboard._id));
  } else {
    setCampaignList([...campaignList, billboard]);
  }
};

// Clear Compare list
const clearCompare = () => {
    setCompareList([]);
    setShowCompareBar(false);
};

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
                return (length * width).toString();
            }
        } else if (size && size !== 'Custom') {
            const dimensions = size.split('x').map(Number);
            if (dimensions.length === 2 && !isNaN(dimensions[0]) && !isNaN(dimensions[1])) {
                return (dimensions[0] * dimensions[1]).toString();
            }
        }
        return 'N/A';
    };

    const displayedSqft = calculateSqftForDisplay(billboard.size, billboard.customLength, billboard.customWidth, billboard.sqft);

    const DetailRow = ({ label, value }) => {
        const shouldRender = (value !== null && value !== undefined &&
            (typeof value !== 'string' || value.trim() !== '' || label === 'Lights'));

        if (!shouldRender) {
            if (label === "SQFT" && (value === 0 || value === '0')) {
                // Special case for SQFT being 0 if you want to display it
            } else {
                return null;
            }
        }

        let displayValue = value;

        if (label === 'Availability Date') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                displayValue = date.toLocaleDateString('en-PK');
            } else {
                displayValue = 'N/A';
            }
        } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
        } else if (typeof value === 'number') {
            displayValue = value.toLocaleString();
        } else if (Array.isArray(value)) {
            displayValue = value.join(', ');
        }

        return (
            <ListGroup.Item className="d-flex justify-content-between align-items-center detail-item">
                <strong>{label}:</strong>
                <span>{displayValue}</span>
            </ListGroup.Item>
        );
    };

    const renderBulletPoints = (text, filterLabel) => {
        if (!text) return null;

        let items = [];

        if (Array.isArray(text)) {
            items = text;
        } else if (typeof text === 'string' && text.trim().startsWith('[')) {
            try {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed)) {
                    items = parsed;
                } else {
                    items = [text];
                }
            } catch (e) {
                items = [text];
            }
        } else if (typeof text === 'string') {
            items = text.split(',').map(item => item.trim()).filter(item => item !== '');
        }

        if (items.length === 0) return <p className="text-muted">Not specified</p>;

        return (
            <ul className="ps-3">
                {items.map((item, index) => (
                    <li key={index}>
                        <Link 
                            to={`/users?filter=${filterLabel}&value=${item}`} 
                            className="detail-link"
                        >
                            {item}
                            <FaUpRightFromSquare className="square-arrow-icon ms-1" />
                        </Link>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
       
            <div className="billboard-header-section">
                <h1 className="billboard-title">{billboard.title || 'Billboard Details'}</h1>
                <p className="billboard-location-text">
                    <FaMapMarkerAlt className="me-1" />
                    {billboard.location || billboard.area || billboard.city || 'Location Unknown'}
                </p>
            </div>

            <Container className="display-page-container my-5">
                
<Row className="breadcrumb-social-bar align-items-center mb-3">
  <Col md={8} className="d-flex align-items-center breadcrumb-links flex-wrap">
    <strong><Link to="/" className="breadcrumb-link">← Return to Search</Link></strong>
    <span className="breadcrumb-divider">|</span>
   <span className="breadcrumb-text">
  <strong>
    <Link to={`/users`} className="detail-link">
      Displays ({totalCount || 0})
    </Link>
  </strong>
</span>

<span className="breadcrumb-arrow">›</span>

<span className="breadcrumb-text">
  <strong>
    <Link to={`/users?filter=displayType&value=Static`} className="detail-link">
      Static ({staticCount || 0})
    </Link>
  </strong>
</span>
<span className="breadcrumb-arrow">›</span>
    <span className="breadcrumb-current">
       {billboard?.location || billboard?.area || billboard?.city || 'Unknown Location'}
    </span>
  </Col>

  <Col md={4} className="text-end">
    <div className="social-dicons">
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="social-icon facebook"><FaFacebookF /></a>
      <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="social-icon twitter"><FaTwitter /></a>
      <a href={`https://pinterest.com/pin/create/button/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="social-icon pinterest"><FaPinterestP /></a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="social-icon linkedin"><FaLinkedinIn /></a>
    </div>
  </Col>
</Row>


                <Row className="main-content-row">
                    <Col md={8} lg={9} className="mb-4 left-scrollable-column">
                        <div className="main-image-display content-section">
                            {billboard.image ? (
                                <img
                                    src={billboard.image}
                                    alt={billboard.title || 'Billboard Image'}
                                    className="img-fluid billboard-or-logo-img"
                                />
                            ) : (
                                <div className="no-image-placeholder">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        <div className="top-inline-info mb-3">
                            <div className="info-item">
                                <strong>ID:</strong> {billboard.displayId || billboard._id}
                            </div>
                           <div className="info-item">
  <strong>Published:</strong> {formatDateDMY(billboard.availability)}
</div>

<div className="info-item">
  <strong>LastUpdate:</strong> {formatDateDMY(billboard.updatedAt)}
</div>

                            <div className="info-item">
                                <strong>Views:</strong> {typeof billboard.views === 'number' ? billboard.views.toLocaleString() : 'N/A'}
                            </div>
                        </div>
                        <div className="detail-grid mt-4">
                            <div className="detail-column">
                                <DetailRow
                                    label="Province"
                                    value={
                                        <Link to={`/users?filter=province&value=${billboard.province}`} className="detail-link">
                                            {billboard.province}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                                <DetailRow
                                    label="Area"
                                    value={
                                        <Link to={`/users?filter=area&value=${billboard.area}`} className="detail-link">
                                            {billboard.area}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                                <DetailRow
                                    label="Display Type"
                                    value={
                                        <Link to={`/users?filter=displayType&value=${billboard.displayType}`} className="detail-link">
                                            {billboard.displayType}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                                <ListGroup.Item className="detail-item">
                                    <span className="detail-label-link">
                                        <strong>SQFT:</strong>{" "}
                                        <Link
                                            to={`/users?filter=sqft&value=${displayedSqft}`}
                                            className="detail-link"
                                        >
                                            {displayedSqft}
                                            <FaUpRightFromSquare className="square-arrow-icon ms-1" />
                                        </Link>
                                    </span>
                                </ListGroup.Item>
                                <DetailRow
                                    label="Lights"
                                    value={
                                        <Link
                                            to={`/users?filter=lights&value=${billboard.lights}`}
                                            className="detail-link"
                                        >
                                            {billboard.lights ? 'Yes' : 'No'}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                            </div>
                            <div className="detail-column">
                                <DetailRow
                                    label="City"
                                    value={
                                        <Link
                                            to={`/users?filter=city&value=${billboard.city}`}
                                            className="detail-link"
                                        >
                                            {billboard.city}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                                <DetailRow
                                    label="Location"
                                    value={
                                        <Link to={`/users?filter=location&value=${billboard.location}`} className="detail-link">
                                            {billboard.location}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                                <DetailRow
                                    label="Size"
                                    value={
                                        <Link to={`/users?filter=size&value=${billboard.size}`} className="detail-link">
                                            {billboard.size}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                                <DetailRow
                                    label="Installed At"
                                    value={
                                        <Link to={`/users?filter=installedAt&value=${billboard.installedAt}`} className="detail-link">
                                            {billboard.installedAt}
                                            <FaUpRightFromSquare className="square-arrow-icon" />
                                        </Link>
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-4 content-section">
                            <div className="card-header-custom h5">Traffic Coming From</div>
                            <div className="detail-list-body">
                                {renderBulletPoints(billboard.trafficComingFrom, "trafficComingFrom")}
                            </div>
                        </div>

                        <div className="mt-4 content-section">
                            <div className="card-header-custom h5">Traffic Going Towards</div>
                            <div className="detail-list-body">
                                {renderBulletPoints(billboard.trafficGoingToward, "trafficGoingToward")}
                            </div>
                        </div>

                        <div className="mt-4 content-section mb-5">
                            <div className="card-header-custom h5">Environment</div>
                            <div className="detail-list-body environment-grid">
                                {renderBulletPoints(billboard.environment, "environment")}
                            </div>
                        </div>
                        <Link to={`/update/${billboard._id}`} className="btn btn-primary btn-sm update-btn">Update Billboard</Link>
                    </Col>

                    <Col md={4} lg={3} className="sticky-form-column">
                        <div className="price-box-section content-section ">
                            <div className="text-center">
                                <p className="price-tag">
                                    {billboard.price ? `Rs. ${billboard.price.toLocaleString()}` : 'Price N/A'}
                                </p>
                            </div>
                        </div>
                        <div className="content-section mb-4">
                           <div className="p-3 action-container">
    <p
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
            cursor: "pointer",
            fontWeight: "bold",
            color: isHovered ? "#ffc107" : "black",
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
        }}
        className="action-item"
    >
        <FaHeart className="me-2 text-danger" /> Add to Favorite
    </p>

    <button
    onClick={() => toggleCompare(billboard)}
    onMouseEnter={() => setHoverCompare(true)}
    onMouseLeave={() => setHoverCompare(false)}
    style={{
        background: 'none',
        border: 'none',
        color: compareList.find(item => item._id === billboard._id)
            ? 'green'
            : hoverCompare
            ? '#ffc107'
            : 'black',
        cursor: 'pointer',
        marginBottom: "10px",
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: 0,
        margin: 0
    }}
>
    {compareList.find(item => item._id === billboard._id) ? (
        <><FaExchangeAlt /> Added to Compare</>
    ) : (
        <><FaExchangeAlt /> Add to Compare</>
    )}
</button>

   <button
    onClick={() => toggleCampaign(billboard)}
    onMouseEnter={() => setHoverCampaign(true)}
    onMouseLeave={() => setHoverCampaign(false)}
    style={{
        background: 'transparent',
        border: 'none',
        color: campaignList.find(item => item._id === billboard._id)
            ? 'green'
            : hoverCampaign
            ? '#ffc107'
            : 'black',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '0',
        margin: 0
    }}
>
    {campaignList.find(item => item._id === billboard._id) ? (
        <><FaExchangeAlt /> Added to Campaign</>
    ) : (
        <><FaExchangeAlt /> Add to Campaign</>
    )}
</button>


</div>

                        </div>
                        <div className="content-section">
                            <div className="card-header-custom h5">Reply to the listing</div>
                            <div className="p-3">
                                <Form onSubmit={handleReplySubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Your name"
                                            value={replyName}
                                            onChange={(e) => setReplyName(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="tel"
                                            placeholder="Phone"
                                            value={replyPhone}
                                            onChange={(e) => setReplyPhone(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={replyEmail}
                                            onChange={(e) => setReplyEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Your message"
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="send-button w-100">
                                        SEND
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {messageBoxMessage && (
                <div className="custom-message-box">
                    <div className="custom-message-content">
                        <p>{messageBoxMessage}</p>
                        <button className="custom-message-button" onClick={() => setMessageBoxMessage('')}>OK</button>
                    </div>
                </div>
            )}
          {compareList.length > 0 && (
    <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '8px solid #ffc107',
        backgroundColor: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 9999,
        gap: '10px',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
        color: 'black'
    }}>
        <div style={{ marginLeft: '50px' }}>
            <strong>Compare ({compareList.length})</strong>
        </div>

        {/* SHOW button */}
<button
  onClick={handleShowCompare}
  disabled={compareList.length === 0}
  style={{
    background: 'transparent',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'black',
    cursor: compareList.length === 0 ? 'not-allowed' : 'pointer',
  }}
  onMouseOver={e => {
    if (compareList.length !== 0)
      e.target.style.backgroundColor = '#ffc107';
  }}
  onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
>
  Show
</button>

        {/* CLEAR button */}
        <button
            onClick={clearCompare}
            style={{
                background: 'transparent',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                color: 'black',
                cursor: 'pointer',
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#ffc107'}
            onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
        >
            Clear
        </button>
    </div>
)}
{campaignList.length > 0 && (
  <div style={{
    position: 'fixed',
    bottom: compareList.length > 0 ? '60px' : '0px',
    left: 0,
    right: 0,
    borderTop: '8px solid #ffc107',
    backgroundColor: 'white',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 9999,
    gap: '10px',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.2)',
    color: 'black'
  }}>
      <div style={{ marginLeft: '50px' }}>
            <strong>Campaign ({campaignList.length})</strong>
        </div>
     <button
    onClick={handleShowCampaign} // Purana: () => setShowCampaignItems(prev => !prev)
    disabled={campaignList.length === 0}
    style={{
        background: 'transparent',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        color: 'black',
        cursor: campaignList.length === 0 ? 'not-allowed' : 'pointer',
    }}
>
    Show
</button>
      {/* Directly show campaign items */}
     {showCampaignItems && (
    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginLeft: '20px' }}>
        {campaignList.map(item => (
            <span
                key={item._id}
                style={{
                    padding: '3px 8px',
                    background: '#28a74533',
                    borderRadius: '5px',
                    fontSize: '0.85rem'
                }}
            >
                {item.title || 'No Title'}
            </span>
        ))}
    </div>
)}
      {/* Clear button */}
      <button
          onClick={() => setCampaignList([])}
          style={{
              background: 'transparent',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              color: 'black',
              cursor: 'pointer',
          }}
      >
          Clear
      </button>
  </div>
)}
        </>
    );
}
export default DisplayDetail;