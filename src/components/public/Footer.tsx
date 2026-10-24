import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <div className="thss-site">
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link
                href="/"
                className="logo"
                style={{ color: 'var(--white)' }}
              >
                <div
                  className="logo-crest"
                  style={{
                    background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                  }}
                >
                  <img
                    src="/assets/logo.png"
                    alt="Teacher Home Secondary School crest"
                  />
                </div>
                <div className="logo-text">
                  <span className="logo-name" style={{ color: 'var(--white)' }}>
                    Teacher Home
                  </span>
                  <span
                    className="logo-sub"
                    style={{ color: 'var(--blue-accent)' }}
                  >
                    Secondary School
                  </span>
                </div>
              </Link>
              <p>
                Building capable, principled and future-ready young people
                through excellent secondary education in Lokoja.
              </p>
              <div className="footer-socials">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social"
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social"
                >
                  <i className="fab fa-instagram" />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social"
                >
                  <i className="fab fa-whatsapp" />
                </a>
              </div>
            </div>
            <div>
              <div className="footer-title">Explore</div>
              <div className="footer-links">
                <Link href="/#about" className="footer-link">
                  About Us
                </Link>
                <Link href="/#academics" className="footer-link">
                  Academics
                </Link>
                <Link href="/#facilities" className="footer-link">
                  Facilities
                </Link>
                <Link href="/#management" className="footer-link">
                  Management
                </Link>
              </div>
            </div>
            <div>
              <div className="footer-title">Portals &amp; Parents</div>
              <div className="footer-links">
                <Link href="/#admissions" className="footer-link">
                  Admissions
                </Link>
                <Link href="/#bulletin" className="footer-link">
                  School Bulletin
                </Link>
                <a
                  href="/student-login"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Student &amp; Parents Portal
                </a>
                <a
                  href="/admin-login"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Staff Portal
                </a>
                <Link href="/#contact" className="footer-link">
                  Schedule a Visit
                </Link>
              </div>
            </div>
            <div>
              <div className="footer-title">Contact</div>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <i className="fas fa-map-marker-alt" />
                  <span>
                    Teacher Home Secondary School, Peace Community, Lokoja, Kogi
                    State
                  </span>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-phone" />
                  <a href="tel:+2348031234567">+234 803 123 4567</a>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-envelope" />
                  <a href="mailto:info@teacherhomeschool.com">
                    info@teacherhomeschool.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>
              &copy; 2026 Teacher Home Secondary School. All rights reserved.
            </div>
            <div>
              Built by{' '}
              <a
                href="https://delversetech.com"
                target="_blank"
                rel="noreferrer"
              >
                Delverse Technologies Limited
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
