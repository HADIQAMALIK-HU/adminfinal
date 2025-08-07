import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./MediaFooter.css"; 
import logo from '../images/a-logo-black.png';
import footerBg from '../images/bg-footer1.jpg'; 
const MediaFooter = () => {
  return (
    <>
      <footer id="colophon" className="site-footer-custom" >
        <div className="footer-custom-inner"
             style={{
                 backgroundImage: `url(${footerBg})`,
                 backgroundSize: 'cover',            
                 backgroundRepeat: 'no-repeat',      
                 backgroundPosition: 'center',        
             }}
        >
          <div className="gray-box">
            <div className="cta-wrapper" >
              <div className="cta-box">
                <h2 className="cta-headline">Get Started to Grow Your Business!</h2>
                <div className="cta-actions">
                  <Link to="/contact"><button className="cta-button primary">Contact us</button></Link>
                  <Link to="/about"><button className="cta-button secondary">About us <span className="arrow">→</span></button></Link>
                </div>
              </div>
              <div className="cta-underline"></div>
            </div>
          </div>
          <Container style={{ background: 'transparent' }} > 
            <Row>
              <Col md={12} className="text-center mb-4">
              </Col>
            </Row>
            <Row className="footer-columns">
              {/* Logo & Info */}
              <Col md={3} className="text-start " >
                <a href="https://interadww.com/">
                  <img
                    src={logo}
                    alt="Interad Logo"
                    className="footer-logo"
                  />
                </a>
                <p className="footer-desc">
                  Leading full service media agency specialized in OOH advertising with extensive
                  network of over 10,000 displays in 100 plus cities of Pakistan.
                </p>
                <div className="services-button-container" style={{marginBottom:'30px'}}>
                  <Link to="/about" className="services-btn-link">
                    <button className="services-btn">
                      <span className="services-btn-text">More Info</span>
                      <span className="services-btn-circle"></span>
                    </button>
                  </Link>
                </div>
              </Col>

              {/* Company Links */}
              <Col md={3} className="text-start companysec">
                <h5 className="footer-subheading">Company</h5>
                <ul className="footer-links">
                  <li><a href="https://interadww.com/service/ooh/www.interadww.com/services">Services</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Blogs</a></li>
                  <li><a href="#">News</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms and Conditions</a></li>
                </ul>
              </Col>

              {/* Contact Info */}
              <Col md={3} className="text-start">
                <h5 className="footer-subheading">Contact Us</h5>
                <ul className="footer-contact">
                  <li>
                    <i className="fas fa-map-marker-alt" ></i>
                    12 P Siddiq Trade Center,Main
                  </li>
                  <li style={{marginLeft:'25px'}}>
                      Boulevard Gulberg Lahore, Pakistan
                  </li>
                  <li>
                    <i className="fas fa-phone-alt"></i>
                    +92-3311-345-345
                  </li>
                  <li>
                    <i className="far fa-envelope"></i>
                    info@interadww.com
                  </li>
                </ul>
              </Col>

              {/* Social Media */}
              <Col md={3} className="text-start">
                <h5 className="footer-subheading">Connect on Social Media</h5>
                <div className="social-icons" >
                  <a href="http://www.facebook.com/interadww" target="_blank" rel="noreferrer">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="http://www.linkedin.com/company/interadww" target="_blank" rel="noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="http://www.instagram.com/interadww" target="_blank" rel="noreferrer">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </Col>
            </Row>

          </Container>
            <Row className="footer-bottom" >
              <p>2025 © All Rights Reserved by interAd Worldwide Pvt. Ltd.</p>
            </Row>
        </div>

      </footer>
    </>
  );
};

export default MediaFooter;