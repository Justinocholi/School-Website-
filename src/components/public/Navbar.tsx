'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="thss-site">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <a href="tel:+2348031234567">
              <i className="fas fa-phone" /> +234 803 123 4567
            </a>
            <a href="mailto:info@teacherhomeschool.com">
              <i className="fas fa-envelope" /> info@teacherhomeschool.com
            </a>
          </div>
          <div className="top-bar-right">
            <span>
              <i className="fas fa-map-marker-alt" /> Peace Community, Lokoja,
              Kogi State
            </span>
            <a
              href="/student-login"
              target="_blank"
              rel="noreferrer"
              className="staff-link"
              style={{ marginRight: '8px' }}
            >
              Student Portal
            </a>
            <a
              href="/admin-login"
              target="_blank"
              rel="noreferrer"
              className="staff-link"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <Link href="/" className="logo">
            <div className="logo-crest">
              <img
                src="/assets/logo.png"
                alt="Teacher Home Secondary School crest"
              />
            </div>
            <div className="logo-text">
              <span className="logo-name">Teacher Home</span>
              <span className="logo-sub">Secondary School</span>
            </div>
          </Link>

          <nav className="nav">
            <Link href="/#home" className="nav-link">
              Home
            </Link>
            <Link href="/#about" className="nav-link">
              About
            </Link>
            <Link href="/#academics" className="nav-link">
              Academics
            </Link>
            <Link href="/#admissions" className="nav-link">
              Admissions
            </Link>
            <Link href="/#management" className="nav-link">
              Management
            </Link>
            <Link href="/#contact" className="nav-link">
              Contact
            </Link>
          </nav>

          <div className="header-actions">
            <a
              href="https://forms.google.com"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Enroll Now
            </a>
            <a
              href="/student-login"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              Check Results
            </a>
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            <i className={mobileOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link
            href="/#home"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/#about"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <Link
            href="/#academics"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Academics
          </Link>
          <Link
            href="/#admissions"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Admissions
          </Link>
          <Link
            href="/#management"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Management
          </Link>
          <Link
            href="/#contact"
            className="mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
          <a
            href="/student-login"
            target="_blank"
            rel="noreferrer"
            className="mobile-nav-link"
          >
            Student Portal{' '}
            <i
              className="fas fa-external-link-alt"
              style={{ fontSize: '12px', marginLeft: '6px' }}
            />
          </a>
          <a
            href="/admin-login"
            target="_blank"
            rel="noreferrer"
            className="mobile-nav-link"
          >
            Staff Portal{' '}
            <i
              className="fas fa-external-link-alt"
              style={{ fontSize: '12px', marginLeft: '6px' }}
            />
          </a>
        </nav>
        <div className="mobile-actions">
          <a
            href="https://forms.google.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
          >
            Enroll Now
          </a>
          <a
            href="/student-login"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Check Results
          </a>
        </div>
      </div>
    </div>
  );
}
