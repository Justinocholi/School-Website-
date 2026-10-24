'use client';

import React, { useEffect, useRef } from 'react';

export interface PublicAnnouncementItem {
  slug: string;
  title: string;
  category: string;
  date: string;
  dateDisplay: string;
  image: string;
  excerpt: string;
  body: string[];
}

export interface TeacherHomeWebsiteProps {
  initialPage?:
    | 'home'
    | 'about'
    | 'academics'
    | 'admissions'
    | 'management'
    | 'bulletin'
    | 'bulletin-detail'
    | 'facilities'
    | 'contact'
    | 'portal';
  initialSlug?: string;
  liveAnnouncements?: PublicAnnouncementItem[];
}

const DEFAULT_BULLETIN_POSTS: PublicAnnouncementItem[] = [
  {
    slug: 'admissions-open-2026-2027',
    title: 'Admissions Open for 2026/2027 Session',
    category: 'Admissions',
    date: '2026-10-15',
    dateDisplay: 'Oct 2026',
    image: '/assets/news-admissions.jpg',
    excerpt:
      "Applications are now being accepted for JSS1 to SSS2. Begin your child's journey with us today.",
    body: [
      'We are delighted to announce that admissions for the 2026/2027 academic session are now open at Teacher Home Secondary School. Families seeking a disciplined, caring and technology-forward learning environment are warmly invited to apply.',
      'Applications are currently being accepted for JSS1 through SSS2, subject to available places and the outcome of our entrance assessment. Each applicant completes an age-appropriate academic assessment that helps us understand their current level and the support they may need.',
      'To begin the process, complete the online application form and bring the required documents to the admissions office. Our team will guide you through every step, from document review to the final admission decision.',
      'We look forward to welcoming new families into our learning community and supporting every child to do their best work and become their best self.',
    ],
  },
  {
    slug: 'students-excel-inter-school',
    title: 'Students Excel in Inter-School Competition',
    category: 'Achievements',
    date: '2026-09-28',
    dateDisplay: 'Sep 2026',
    image: '/assets/news-achievement.jpg',
    excerpt:
      'Our learners brought home medals in science, mathematics and sports at the Kogi State finals.',
    body: [
      'Teacher Home Secondary School students have once again demonstrated excellence beyond the classroom, bringing home multiple medals at the Kogi State Inter-School Competition finals.',
      'Our learners competed across science, mathematics and sporting events, demonstrating both academic rigour and outstanding teamwork. The results reflect the dedication of our students and the commitment of our teaching staff.',
      'We are particularly proud of the students who balanced preparation for their regular studies with competition training, showing the kind of discipline and resilience we seek to develop in every learner.',
      'Congratulations to all participants and to the teachers who guided them. We look forward to continuing this tradition of excellence in future competitions.',
    ],
  },
  {
    slug: 'annual-cultural-day',
    title: 'Annual Cultural Day Celebrated',
    category: 'Events',
    date: '2026-09-15',
    dateDisplay: 'Sep 2026',
    image: '/assets/news-cultural.jpg',
    excerpt:
      "Students showcased Nigeria's rich heritage through dance, drama and traditional attire.",
    body: [
      "Our annual Cultural Day was a vibrant celebration of Nigeria's rich heritage, with students from every class participating in dance, drama, music and traditional attire displays.",
      'The event gave learners the opportunity to explore the diverse cultures of Nigeria, develop confidence in public performance and appreciate the values that unite us as a nation.',
      'Parents, guardians and community members joined us for the celebrations, making it a true community event that strengthened the bonds between the school and the families we serve.',
      'Cultural Day is one of the highlights of our school calendar and an important part of the character formation we pursue alongside academic excellence.',
    ],
  },
  {
    slug: 'new-ict-lab-commissioned',
    title: 'New ICT Lab Commissioned',
    category: 'Announcements',
    date: '2026-08-20',
    dateDisplay: 'Aug 2026',
    image: '/assets/news-ict-lab.jpg',
    excerpt:
      'State-of-the-art computer laboratory now available to all students for enhanced digital learning.',
    body: [
      'We are pleased to announce the commissioning of our new ICT laboratory, equipped with modern computers and reliable internet access for all students.',
      'The new lab supports our commitment to technology-integrated learning, giving every learner hands-on experience with digital tools across all subjects.',
      'Students will use the facility for computer studies, research projects and guided digital literacy sessions led by our ICT team.',
      'This investment reflects our belief that technology, used thoughtfully, is an essential part of preparing young people for the world they will inherit.',
    ],
  },
  {
    slug: 'outstanding-waec-results',
    title: 'Outstanding WAEC Results',
    category: 'Achievements',
    date: '2026-07-10',
    dateDisplay: 'Jul 2026',
    image: '/assets/news-waec.jpg',
    excerpt:
      '95% of our SSS3 graduates achieved credit passes in five or more subjects including English and Mathematics.',
    body: [
      'We are proud to share that 95% of our SSS3 graduates achieved credit passes in five or more subjects, including English Language and Mathematics, in the most recent WAEC examinations.',
      'These results reflect the hard work of our students, the dedication of our teaching staff and the supportive learning environment we have built together with families.',
      'We congratulate every graduate and wish them success as they move on to tertiary education, vocational training or other next steps in their journey.',
      'Results like these reinforce our commitment to academic excellence and to preparing every learner for the opportunities and responsibilities ahead.',
    ],
  },
  {
    slug: 'inter-house-sports',
    title: 'Inter-House Sports Competition',
    category: 'Events',
    date: '2026-06-18',
    dateDisplay: 'Jun 2026',
    image: '/assets/news-sports.jpg',
    excerpt:
      'Four houses competed in athletics, football and relay races in a display of teamwork and sportsmanship.',
    body: [
      'Our annual Inter-House Sports Competition brought together all four houses for a day of athletics, football and relay races, showcasing teamwork, fitness and sportsmanship.',
      'Students competed with enthusiasm and respect for their opponents, demonstrating the values of discipline and fair play that we emphasise across school life.',
      'The event was supported by staff, parents and community members who came to cheer on the competitors and celebrate the spirit of healthy competition.',
      'Sports remain an important part of the Teacher Home experience, helping students build confidence, resilience and a lifelong appreciation for physical wellbeing.',
    ],
  },
];

const BODY_HTML = "<!-- Top Bar -->\r\n<div class=\"top-bar\">\r\n  <div class=\"container top-bar-inner\">\r\n    <div class=\"top-bar-left\">\r\n      <a href=\"tel:+2348031234567\"><i class=\"fas fa-phone\"></i> +234 803 123 4567</a>\r\n      <a href=\"mailto:info@teacherhomeschool.com\"><i class=\"fas fa-envelope\"></i> info@teacherhomeschool.com</a>\r\n    </div>\r\n    <div class=\"top-bar-right\">\r\n      <span><i class=\"fas fa-map-marker-alt\"></i> Peace Community, Lokoja, Kogi State</span>\r\n      <a href=\"/student-login\" target=\"_blank\" rel=\"noreferrer\" class=\"staff-link\" style=\"margin-right: 8px;\">Student Portal</a>\n      <a href=\"/admin-login\" target=\"_blank\" rel=\"noreferrer\" class=\"staff-link\">Staff Portal</a>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<!-- Header -->\r\n<header class=\"header\">\r\n  <div class=\"container header-inner\">\r\n    <a href=\"#home\" class=\"logo\" data-page=\"home\">\r\n      <div class=\"logo-crest\">\r\n        <img src=\"/assets/logo.png\" alt=\"Teacher Home Secondary School crest\" />\r\n      </div>\r\n      <div class=\"logo-text\">\r\n        <span class=\"logo-name\">Teacher Home</span>\r\n        <span class=\"logo-sub\">Secondary School</span>\r\n      </div>\r\n    </a>\r\n    <nav class=\"nav\">\r\n      <a href=\"#home\" class=\"nav-link active\" data-page=\"home\">Home</a>\r\n      <a href=\"#about\" class=\"nav-link\" data-page=\"about\">About</a>\r\n      <a href=\"#academics\" class=\"nav-link\" data-page=\"academics\">Academics</a>\r\n      <a href=\"#admissions\" class=\"nav-link\" data-page=\"admissions\">Admissions</a>\r\n      <a href=\"#management\" class=\"nav-link\" data-page=\"management\">Management</a>\r\n      <a href=\"#contact\" class=\"nav-link\" data-page=\"contact\">Contact</a>\r\n    </nav>\r\n    <div class=\"header-actions\">\r\n      <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-secondary\">Enroll Now</a>\r\n      <a href=\"/student-login\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-primary\">Check Results</a>\r\n    </div>\r\n    <button class=\"menu-toggle\" id=\"menuToggle\"><i class=\"fas fa-bars\"></i></button>\r\n  </div>\r\n</header>\r\n\r\n<!-- Mobile Menu -->\r\n<div class=\"mobile-menu\" id=\"mobileMenu\">\r\n  <nav class=\"mobile-nav\">\r\n    <a href=\"#home\" class=\"mobile-nav-link active\" data-page=\"home\">Home</a>\r\n    <a href=\"#about\" class=\"mobile-nav-link\" data-page=\"about\">About</a>\r\n    <a href=\"#academics\" class=\"mobile-nav-link\" data-page=\"academics\">Academics</a>\r\n    <a href=\"#admissions\" class=\"mobile-nav-link\" data-page=\"admissions\">Admissions</a>\r\n    <a href=\"#management\" class=\"mobile-nav-link\" data-page=\"management\">Management</a>\r\n    <a href=\"#contact\" class=\"mobile-nav-link\" data-page=\"contact\">Contact</a>\r\n    <a href=\"/student-login\" target=\"_blank\" rel=\"noreferrer\" class=\"mobile-nav-link\">Student Portal <i class=\"fas fa-external-link-alt\" style=\"font-size: 12px; margin-left: 6px;\"></i></a>\n    <a href=\"/admin-login\" target=\"_blank\" rel=\"noreferrer\" class=\"mobile-nav-link\">Staff Portal <i class=\"fas fa-external-link-alt\" style=\"font-size: 12px; margin-left: 6px;\"></i></a>\r\n  </nav>\r\n  <div class=\"mobile-actions\">\r\n    <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-secondary\">Enroll Now</a>\r\n    <a href=\"/student-login\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-primary\">Check Results</a>\r\n  </div>\r\n</div>\r\n\r\n<main>\r\n  <!-- HOME PAGE -->\r\n  <div class=\"page active\" id=\"page-home\">\r\n    <!-- Hero -->\r\n    <section class=\"hero\">\r\n      <div class=\"hero-bg-image\"></div>\r\n      <div class=\"hero-bg\"></div>\r\n      <div class=\"container\">\r\n        <div class=\"hero-content\">\r\n          <div class=\"hero-eyebrow\">Peace Community, Lokoja</div>\r\n          <h1 class=\"hero-title font-display\">\r\n            Teacher Home\r\n            <span>Secondary School</span>\r\n          </h1>\r\n          <p class=\"hero-motto\">Educate A Child &amp; Build A Virile Nation</p>\r\n          <p class=\"hero-desc\">A warm, disciplined and technology-forward learning community preparing every child for life beyond the classroom.</p>\r\n          <div class=\"hero-buttons\">\r\n            <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-primary\">Apply for Admission <i class=\"fas fa-arrow-right\"></i></a>\r\n            <a href=\"#about\" class=\"btn btn-outline\" data-page=\"about\">Explore Our School</a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"hero-stats\">\r\n        <div class=\"container hero-stats-inner\">\r\n          <div class=\"hero-stat\">\r\n            <div class=\"hero-stat-value\">180-200</div>\r\n            <div class=\"hero-stat-label\">Active Learners</div>\r\n          </div>\r\n          <div class=\"hero-stat\">\r\n            <div class=\"hero-stat-value\">JSS1-SSS3</div>\r\n            <div class=\"hero-stat-label\">Class Levels</div>\r\n          </div>\r\n          <div class=\"hero-stat\">\r\n            <div class=\"hero-stat-value\">Nigerian</div>\r\n            <div class=\"hero-stat-label\">Curriculum</div>\r\n          </div>\r\n          <div class=\"hero-stat\">\r\n            <div class=\"hero-stat-value\">ICT</div>\r\n            <div class=\"hero-stat-label\">Integrated</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- Welcome -->\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"welcome-grid\">\r\n          <div class=\"welcome-image reveal\">\r\n            <img src=\"/assets/logo.png\" alt=\"Teacher Home school building\" />\r\n          </div>\r\n          <div class=\"welcome-text reveal\">\r\n            <span class=\"eyebrow\">Welcome to Teacher Home</span>\r\n            <h2 class=\"section-title font-display\">Strong foundations. Wider possibilities.</h2>\r\n            <p>We combine excellent teaching, purposeful technology and genuine pastoral care so every learner can grow in knowledge, confidence and character.</p>\r\n            <div class=\"welcome-features\">\r\n              <div class=\"welcome-feature\"><div class=\"welcome-feature-icon\"><i class=\"fas fa-check\"></i></div>Small class attention</div>\r\n              <div class=\"welcome-feature\"><div class=\"welcome-feature-icon\"><i class=\"fas fa-check\"></i></div>Qualified, caring teachers</div>\r\n              <div class=\"welcome-feature\"><div class=\"welcome-feature-icon\"><i class=\"fas fa-check\"></i></div>Values-led discipline</div>\r\n              <div class=\"welcome-feature\"><div class=\"welcome-feature-icon\"><i class=\"fas fa-check\"></i></div>Practical digital skills</div>\r\n            </div>\r\n            <a href=\"#about\" class=\"btn btn-secondary\" style=\"margin-top: 32px;\" data-page=\"about\">Discover our story <i class=\"fas fa-arrow-right\"></i></a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- Why Choose -->\r\n    <section class=\"section section-light\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header center reveal\">\r\n          <span class=\"eyebrow\">Why Teacher Home</span>\r\n          <h2 class=\"section-title font-display\">The advantage your child deserves</h2>\r\n          <p class=\"section-subtitle\">A complete learning experience designed for ambitious families in Lokoja.</p>\r\n        </div>\r\n        <div class=\"why-grid reveal\">\r\n          <div class=\"why-card\">\r\n            <div class=\"why-icon\"><i class=\"fas fa-graduation-cap\"></i></div>\r\n            <div class=\"why-title\">International Standard Education</div>\r\n            <div class=\"why-text\">Rigorous learning built for a changing world.</div>\r\n          </div>\r\n          <div class=\"why-card\">\r\n            <div class=\"why-icon\"><i class=\"fas fa-users\"></i></div>\r\n            <div class=\"why-title\">Professional Team of Staff</div>\r\n            <div class=\"why-text\">Committed educators who know every learner.</div>\r\n          </div>\r\n          <div class=\"why-card\">\r\n            <div class=\"why-icon\"><i class=\"fas fa-laptop\"></i></div>\r\n            <div class=\"why-title\">ICT-Integrated Learning</div>\r\n            <div class=\"why-text\">Technology used thoughtfully across subjects.</div>\r\n          </div>\r\n          <div class=\"why-card\">\r\n            <div class=\"why-icon\"><i class=\"fas fa-trophy\"></i></div>\r\n            <div class=\"why-title\">Beyond the Classroom</div>\r\n            <div class=\"why-text\">Sport, clubs and leadership shape confident students.</div>\r\n          </div>\r\n          <div class=\"why-card\">\r\n            <div class=\"why-icon\"><i class=\"fas fa-shield-alt\"></i></div>\r\n            <div class=\"why-title\">Health &amp; Safety Standards</div>\r\n            <div class=\"why-text\">A secure, caring environment for daily learning.</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- Bulletin Preview -->\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div style=\"display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap;\" class=\"reveal\">\r\n          <div class=\"section-header\" style=\"margin-bottom: 0;\">\r\n            <span class=\"eyebrow\">School Bulletin</span>\r\n            <h2 class=\"section-title font-display\">What is happening at Teacher Home</h2>\r\n            <p class=\"section-subtitle\">News, notices and proud moments from our school community.</p>\r\n          </div>\r\n          <a href=\"#bulletin\" class=\"btn btn-secondary\" data-page=\"bulletin\">View all updates <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n        <div class=\"news-grid\" style=\"margin-top: 48px;\" id=\"homeNewsGrid\">\r\n          <!-- Populated by JS with latest 3 -->\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- Testimonial -->\r\n    <section class=\"testimonial-section\">\r\n      <div class=\"testimonial-grid\">\r\n        <div class=\"testimonial-image\">\r\n          <img src=\"/assets/classroom.png\" alt=\"Students learning together\" />\r\n        </div>\r\n        <div class=\"testimonial-content\">\r\n          <i class=\"fas fa-quote-left testimonial-quote-icon\"></i>\r\n          <blockquote class=\"testimonial-text font-display\" id=\"testimonialText\">\"Teacher Home has helped our daughter become more focused, confident and eager to learn. We value the communication and genuine care.\"</blockquote>\r\n          <div class=\"testimonial-author\" id=\"testimonialAuthor\">Mrs. A. Okene</div>\r\n          <div class=\"testimonial-role\" id=\"testimonialRole\">Parent, JSS2</div>\r\n          <div class=\"testimonial-nav\">\r\n            <button class=\"testimonial-btn\" id=\"prevTestimonial\"><i class=\"fas fa-chevron-left\"></i></button>\r\n            <button class=\"testimonial-btn\" id=\"nextTestimonial\"><i class=\"fas fa-chevron-right\"></i></button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- CTA -->\r\n    <section class=\"cta-band\">\r\n      <div class=\"container cta-inner\">\r\n        <div class=\"cta-text\">\r\n          <p>Admissions 2026/2027</p>\r\n          <h2 class=\"font-display\">Give your child room to thrive.</h2>\r\n        </div>\r\n        <div class=\"cta-buttons\">\r\n          <a href=\"#contact\" class=\"btn btn-white\" data-page=\"contact\">Schedule a Visit</a>\r\n          <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-dark\">Apply Now <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- ABOUT PAGE -->\r\n  <div class=\"page\" id=\"page-about\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">About Us</span></nav>\r\n        <h1 class=\"font-display\">A school built around every learner</h1>\r\n        <p>Rooted in Lokoja and focused on the future, we help young people build knowledge, character and courage.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"welcome-grid\">\r\n          <div class=\"reveal\">\r\n            <span class=\"eyebrow\">Our Story</span>\r\n            <h2 class=\"section-title font-display\">Purposeful education in the heart of Lokoja</h2>\r\n            <p style=\"font-size: 17px; color: var(--text-light); line-height: 1.8; margin-bottom: 16px;\">Teacher Home Secondary School was established to give families a trusted environment where strong academics and sound values grow together. From JSS1 to SSS3, our students receive clear instruction, individual guidance and opportunities to discover their strengths.</p>\r\n            <p style=\"font-size: 17px; color: var(--text-light); line-height: 1.8;\">Today, our community serves approximately 180 to 200 learners through the Nigerian Educational Curriculum, enriched with practical technology, co-curricular experiences and intentional character formation.</p>\r\n          </div>\r\n          <div class=\"welcome-image reveal\">\r\n            <img src=\"/assets/logo.png\" alt=\"Teacher Home school facilities\" />\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"mv-grid\">\r\n      <div class=\"mv-card mission reveal\">\r\n        <i class=\"fas fa-sparkles mv-icon\"></i>\r\n        <div class=\"mv-label\">Our Mission</div>\r\n        <h2 class=\"mv-title font-display\">To provide quality education that develops well-rounded individuals.</h2>\r\n      </div>\r\n      <div class=\"mv-card vision reveal\">\r\n        <i class=\"fas fa-graduation-cap mv-icon\"></i>\r\n        <div class=\"mv-label\">Our Vision</div>\r\n        <h2 class=\"mv-title font-display\">To be a leading secondary school in Kogi State producing future leaders.</h2>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header center reveal\">\r\n          <span class=\"eyebrow\">What Guides Us</span>\r\n          <h2 class=\"section-title font-display\">Values lived every day</h2>\r\n        </div>\r\n        <div class=\"values-grid reveal\">\r\n          <div class=\"value-card\"><i class=\"fas fa-graduation-cap value-icon\"></i><div class=\"value-title\">Academic Excellence</div></div>\r\n          <div class=\"value-card\"><i class=\"fas fa-heart value-icon\"></i><div class=\"value-title\">Character Development</div></div>\r\n          <div class=\"value-card\"><i class=\"fas fa-shield-alt value-icon\"></i><div class=\"value-title\">Discipline</div></div>\r\n          <div class=\"value-card\"><i class=\"fas fa-lightbulb value-icon\"></i><div class=\"value-title\">Innovation</div></div>\r\n          <div class=\"value-card\"><i class=\"fas fa-check-circle value-icon\"></i><div class=\"value-title\">Integrity</div></div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section section-light\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header reveal\">\r\n          <span class=\"eyebrow\">Life at Teacher Home</span>\r\n          <h2 class=\"section-title font-display\">A place to learn, belong and grow</h2>\r\n          <p class=\"section-subtitle\">Every space supports curiosity, friendship and confident participation.</p>\r\n        </div>\r\n        <div class=\"gallery-grid reveal\">\r\n            <div class=\"gallery-item large\"><img src=\"/assets/class-students.png\" alt=\"Students in a classroom\" /></div>\r\n          <div class=\"gallery-item\"><img src=\"/assets/sports.png\" alt=\"Students enjoying sport\" /></div>\r\n          <div class=\"gallery-item\"><img src=\"/assets/science-lab.jpg\" alt=\"Practical science activity\" /></div>\r\n          <div class=\"gallery-item wide\"><img src=\"/assets/students-outdoors.jpg\" alt=\"Students learning outdoors\" /></div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div style=\"display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: center;\" class=\"reveal\">\r\n          <div>\r\n            <span class=\"eyebrow\">Quality Assurance</span>\r\n            <h2 class=\"section-title font-display\">Accreditation &amp; affiliations</h2>\r\n          </div>\r\n          <div style=\"border-left: 4px solid var(--blue-accent); padding-left: 32px;\">\r\n            <p style=\"font-size: 17px; color: var(--text-light); line-height: 1.8;\">Teacher Home delivers the Nigerian Educational Curriculum and prepares students for recognised junior and senior secondary examinations. Our programmes follow the guidance of relevant education authorities in Kogi State and national examination bodies.</p>\r\n            <p style=\"font-size: 15px; font-weight: 700; color: var(--navy); margin-top: 16px;\">Documentation and current approvals are available to parents through the school office.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"cta-band\">\r\n      <div class=\"container cta-inner\">\r\n        <div class=\"cta-text\">\r\n          <p>Admissions 2026/2027</p>\r\n          <h2 class=\"font-display\">Give your child room to thrive.</h2>\r\n        </div>\r\n        <div class=\"cta-buttons\">\r\n          <a href=\"#contact\" class=\"btn btn-white\" data-page=\"contact\">Schedule a Visit</a>\r\n          <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-dark\">Apply Now <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- ACADEMICS PAGE -->\r\n  <div class=\"page\" id=\"page-academics\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Academics</span></nav>\r\n        <h1 class=\"font-display\">Learning that builds momentum</h1>\r\n        <p>A clear academic journey from junior secondary foundations to confident senior secondary specialisation.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header center reveal\">\r\n          <span class=\"eyebrow\">Class Levels</span>\r\n          <h2 class=\"section-title font-display\">Six years of purposeful growth</h2>\r\n          <p class=\"section-subtitle\">Our programme follows the Nigerian Educational Curriculum with teaching that connects knowledge to practical life.</p>\r\n        </div>\r\n        <div class=\"academics-grid reveal\">\r\n          <div class=\"academic-card junior\">\r\n            <div class=\"academic-label\">Years 7-9</div>\r\n            <h3 class=\"academic-title font-display\">Junior Secondary</h3>\r\n            <p class=\"academic-text\">JSS1 to JSS3 establish strong literacy, numeracy, scientific thinking, digital awareness and broad subject confidence.</p>\r\n            <div class=\"level-tags\"><span class=\"level-tag\">JSS1</span><span class=\"level-tag\">JSS2</span><span class=\"level-tag\">JSS3</span></div>\r\n          </div>\r\n          <div class=\"academic-card senior\">\r\n            <div class=\"academic-label\">Years 10-12</div>\r\n            <h3 class=\"academic-title font-display\">Senior Secondary</h3>\r\n            <p class=\"academic-text\">SSS1 to SSS3 deepen subject knowledge and prepare learners for WAEC/NECO, tertiary education and responsible adulthood.</p>\r\n            <div class=\"level-tags\"><span class=\"level-tag\">SSS1</span><span class=\"level-tag\">SSS2</span><span class=\"level-tag\">SSS3</span></div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section section-dark\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header reveal\">\r\n          <span class=\"eyebrow\">Subjects Offered</span>\r\n          <h2 class=\"section-title font-display\">Pathways for every ambition</h2>\r\n          <p class=\"section-subtitle\">Students receive a balanced core before developing greater depth in their chosen senior pathway.</p>\r\n        </div>\r\n        <div class=\"subjects-grid reveal\">\r\n          <div class=\"subject-card\">\r\n            <div class=\"subject-number\">01</div>\r\n            <h3 class=\"subject-title\">Core Subjects</h3>\r\n            <p class=\"subject-text\">English Language, Mathematics, Basic Science, Social Studies, Civic Education, Computer Studies, and Agricultural Science form the foundation for every learner.</p>\r\n          </div>\r\n          <div class=\"subject-card\">\r\n            <div class=\"subject-number\">02</div>\r\n            <h3 class=\"subject-title\">Sciences &amp; Technology</h3>\r\n            <p class=\"subject-text\">Physics, Chemistry, Biology, Further Mathematics, Technical Drawing and Computer Science for students pursuing STEM pathways.</p>\r\n          </div>\r\n          <div class=\"subject-card\">\r\n            <div class=\"subject-number\">03</div>\r\n            <h3 class=\"subject-title\">Arts &amp; Commercial</h3>\r\n            <p class=\"subject-text\">Literature, Government, Economics, Accounting, Commerce, Christian Religious Studies and Fine Arts for humanities and business-minded learners.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 60px;\" class=\"reveal\">\r\n          <div>\r\n            <span class=\"eyebrow\">Assessment</span>\r\n            <h2 class=\"section-title font-display\">Consistent feedback, not last-minute surprises</h2>\r\n            <p class=\"section-subtitle\" style=\"margin-bottom: 28px;\">Continuous assessment works alongside mid-term and end-of-term examinations to measure understanding, skills and progress.</p>\r\n            <div style=\"display: flex; flex-direction: column; gap: 16px;\">\r\n              <div style=\"display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: var(--text);\"><i class=\"fas fa-check-circle\" style=\"color: var(--navy-light); font-size: 18px;\"></i>Classwork, projects and practical activities</div>\r\n              <div style=\"display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: var(--text);\"><i class=\"fas fa-check-circle\" style=\"color: var(--navy-light); font-size: 18px;\"></i>Periodic tests and continuous assessment</div>\r\n              <div style=\"display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: var(--text);\"><i class=\"fas fa-check-circle\" style=\"color: var(--navy-light); font-size: 18px;\"></i>Term examinations and progress reports</div>\r\n              <div style=\"display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: var(--text);\"><i class=\"fas fa-check-circle\" style=\"color: var(--navy-light); font-size: 18px;\"></i>Parent-teacher review and learner support</div>\r\n            </div>\r\n          </div>\r\n          <div style=\"background: var(--blue-pale); padding: 40px; border-radius: var(--radius-lg);\">\r\n            <i class=\"fas fa-calendar-alt\" style=\"font-size: 32px; color: var(--maroon); margin-bottom: 20px;\"></i>\r\n            <h3 class=\"font-display\" style=\"font-size: 28px; font-weight: 700; color: var(--navy); margin-bottom: 24px;\">Academic Calendar</h3>\r\n            <div style=\"display: flex; flex-direction: column; gap: 0;\">\r\n              <div style=\"display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid rgba(0,51,102,0.1);\"><strong style=\"font-size: 14px; color: var(--navy);\">First Term</strong><span style=\"font-size: 14px; color: var(--text-light);\">September - December</span></div>\r\n              <div style=\"display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid rgba(0,51,102,0.1);\"><strong style=\"font-size: 14px; color: var(--navy);\">Second Term</strong><span style=\"font-size: 14px; color: var(--text-light);\">January - April</span></div>\r\n              <div style=\"display: flex; justify-content: space-between; padding: 16px 0;\"><strong style=\"font-size: 14px; color: var(--navy);\">Third Term</strong><span style=\"font-size: 14px; color: var(--text-light);\">April - July</span></div>\r\n            </div>\r\n            <p style=\"font-size: 13px; color: var(--text-light); margin-top: 20px; line-height: 1.6;\">Exact resumption, assessment and holiday dates are shared with families before each term.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"cta-band\">\r\n      <div class=\"container cta-inner\">\r\n        <div class=\"cta-text\">\r\n          <p>Admissions 2026/2027</p>\r\n          <h2 class=\"font-display\">Give your child room to thrive.</h2>\r\n        </div>\r\n        <div class=\"cta-buttons\">\r\n          <a href=\"#contact\" class=\"btn btn-white\" data-page=\"contact\">Schedule a Visit</a>\r\n          <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-dark\">Apply Now <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- ADMISSIONS PAGE -->\r\n  <div class=\"page\" id=\"page-admissions\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Admissions</span></nav>\r\n        <h1 class=\"font-display\">Admissions are open for 2026/2027</h1>\r\n        <p>Take the first step towards a confident, caring and future-ready secondary education.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <div class=\"banner-strip\">\r\n      <div class=\"container banner-inner\">\r\n        <div class=\"banner-text\">Applications are welcome for JSS1 to SSS2, subject to available places.</div>\r\n        <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-primary\">Start Your Application <i class=\"fas fa-external-link-alt\"></i></a>\r\n      </div>\r\n    </div>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header center reveal\">\r\n          <span class=\"eyebrow\">How to Apply</span>\r\n          <h2 class=\"section-title font-display\">A clear four-step process</h2>\r\n          <p class=\"section-subtitle\">Our admissions team will guide your family from first enquiry to resumption.</p>\r\n        </div>\r\n        <div class=\"steps-grid reveal\">\r\n          <div class=\"step-card\">\r\n            <div class=\"step-icon\"><i class=\"fas fa-file-alt\"></i></div>\r\n            <div class=\"step-label\">Step 1</div>\r\n            <h3 class=\"step-title\">Submit an application</h3>\r\n            <p class=\"step-text\">Complete the online form with parent and student details.</p>\r\n          </div>\r\n          <div class=\"step-card\">\r\n            <div class=\"step-icon\"><i class=\"fas fa-clipboard-check\"></i></div>\r\n            <div class=\"step-label\">Step 2</div>\r\n            <h3 class=\"step-title\">Bring your documents</h3>\r\n            <p class=\"step-text\">Visit the admissions office with the required records.</p>\r\n          </div>\r\n          <div class=\"step-card\">\r\n            <div class=\"step-icon\"><i class=\"fas fa-book-open\"></i></div>\r\n            <div class=\"step-label\">Step 3</div>\r\n            <h3 class=\"step-title\">Entrance assessment</h3>\r\n            <p class=\"step-text\">Your child completes an age-appropriate academic assessment.</p>\r\n          </div>\r\n          <div class=\"step-card\">\r\n            <div class=\"step-icon\"><i class=\"fas fa-check-circle\"></i></div>\r\n            <div class=\"step-label\">Step 4</div>\r\n            <h3 class=\"step-title\">Admission decision</h3>\r\n            <p class=\"step-text\">Successful families receive an offer and resumption guide.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section section-dark\">\r\n      <div class=\"container\">\r\n        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 80px;\" class=\"reveal\">\r\n          <div>\r\n            <span class=\"eyebrow\">Eligibility</span>\r\n            <h2 class=\"section-title font-display\">Age requirements</h2>\r\n            <p style=\"font-size: 17px; color: rgba(255,255,255,0.85); line-height: 1.8; margin-top: 20px;\">Applicants should meet the appropriate age and prior-class requirements for the level they are entering. JSS1 candidates should normally be at least 10 years old by the resumption date.</p>\r\n            <p style=\"font-size: 14px; color: var(--blue-accent); margin-top: 16px;\">Placement is confirmed after document review and assessment.</p>\r\n          </div>\r\n          <div>\r\n            <span class=\"eyebrow\">What to bring</span>\r\n            <h2 class=\"section-title font-display\">Required documents</h2>\r\n            <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px;\">\r\n              <div style=\"display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85);\"><i class=\"fas fa-check\" style=\"color: var(--blue-accent); margin-top: 4px;\"></i>Birth certificate or age declaration</div>\r\n              <div style=\"display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85);\"><i class=\"fas fa-check\" style=\"color: var(--blue-accent); margin-top: 4px;\"></i>Two recent passport photographs</div>\r\n              <div style=\"display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85);\"><i class=\"fas fa-check\" style=\"color: var(--blue-accent); margin-top: 4px;\"></i>Most recent school report</div>\r\n              <div style=\"display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85);\"><i class=\"fas fa-check\" style=\"color: var(--blue-accent); margin-top: 4px;\"></i>Transfer certificate where applicable</div>\r\n              <div style=\"display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85);\"><i class=\"fas fa-check\" style=\"color: var(--blue-accent); margin-top: 4px;\"></i>Parent/guardian identification</div>\r\n              <div style=\"display: flex; gap: 12px; font-size: 14px; color: rgba(255,255,255,0.85);\"><i class=\"fas fa-check\" style=\"color: var(--blue-accent); margin-top: 4px;\"></i>Medical information form</div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div style=\"display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px;\" class=\"reveal\">\r\n          <div>\r\n            <span class=\"eyebrow\">Frequently Asked Questions</span>\r\n            <h2 class=\"section-title font-display\">Answers for parents</h2>\r\n            <p class=\"section-subtitle\" style=\"margin-bottom: 24px;\">If you need anything else, our admissions office will be happy to help.</p>\r\n            <a href=\"#contact\" class=\"btn btn-secondary\" data-page=\"contact\">Contact admissions <i class=\"fas fa-arrow-right\"></i></a>\r\n          </div>\r\n          <div class=\"faq-list\" id=\"faqList\">\r\n            <div class=\"faq-item open\">\r\n              <button class=\"faq-question\">Which classes are currently accepting applications?<i class=\"fas fa-chevron-down faq-icon\"></i></button>\r\n              <div class=\"faq-answer\"><p>Applications are accepted for JSS1 to SSS2, subject to available places and the outcome of the entrance assessment.</p></div>\r\n            </div>\r\n            <div class=\"faq-item\">\r\n              <button class=\"faq-question\">Does my child need to sit an entrance assessment?<i class=\"fas fa-chevron-down faq-icon\"></i></button>\r\n              <div class=\"faq-answer\"><p>Yes. The short assessment helps us understand each learner's current level and the support they may need.</p></div>\r\n            </div>\r\n            <div class=\"faq-item\">\r\n              <button class=\"faq-question\">Can we visit the school before applying?<i class=\"fas fa-chevron-down faq-icon\"></i></button>\r\n              <div class=\"faq-answer\"><p>Yes. Families are encouraged to schedule a weekday tour so they can meet the team and see the learning environment.</p></div>\r\n            </div>\r\n            <div class=\"faq-item\">\r\n              <button class=\"faq-question\">Is transport available within Lokoja?<i class=\"fas fa-chevron-down faq-icon\"></i></button>\r\n              <div class=\"faq-answer\"><p>Transport is available on selected routes. The admissions office can confirm current stops and availability.</p></div>\r\n            </div>\r\n            <div class=\"faq-item\">\r\n              <button class=\"faq-question\">How will I know if my child is admitted?<i class=\"fas fa-chevron-down faq-icon\"></i></button>\r\n              <div class=\"faq-answer\"><p>Successful families receive an admission notice with payment, resumption and uniform guidance after the assessment process.</p></div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"cta-band\">\r\n      <div class=\"container cta-inner\">\r\n        <div class=\"cta-text\">\r\n          <p>Admissions 2026/2027</p>\r\n          <h2 class=\"font-display\">Give your child room to thrive.</h2>\r\n        </div>\r\n        <div class=\"cta-buttons\">\r\n          <a href=\"#contact\" class=\"btn btn-white\" data-page=\"contact\">Schedule a Visit</a>\r\n          <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-dark\">Apply Now <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- MANAGEMENT PAGE -->\r\n  <div class=\"page\" id=\"page-management\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Management</span></nav>\r\n        <h1 class=\"font-display\">Leadership with purpose</h1>\r\n        <p>Meet the team creating a focused, safe and ambitious learning culture for every student.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header center reveal\">\r\n          <span class=\"eyebrow\">Our Leadership</span>\r\n          <h2 class=\"section-title font-display\">Meet our management</h2>\r\n          <p class=\"section-subtitle\">Experienced professionals united by one responsibility: helping every learner do their best work and become their best self.</p>\r\n        </div>\r\n        <div class=\"management-grid reveal\">\r\n          <div class=\"management-card\">\r\n            <div class=\"management-image\">\r\n              <img src=\"/assets/proprietor.jpg\" alt=\"Mr. James Okene, Proprietor\" />\r\n            </div>\r\n            <div class=\"management-content\">\r\n              <div class=\"management-role\">Proprietor</div>\r\n              <h3 class=\"management-name\">Mr. James Okene</h3>\r\n              <p class=\"management-bio\">Visionary education leader with over 20 years of experience in school administration and community development across Kogi State.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"management-card\">\r\n            <div class=\"management-image\">\r\n              <img src=\"/assets/principal.jpg\" alt=\"Mrs. Aisha Musa, Principal\" />\r\n            </div>\r\n            <div class=\"management-content\">\r\n              <div class=\"management-role\">Principal</div>\r\n              <h3 class=\"management-name\">Mrs. Aisha Musa</h3>\r\n              <p class=\"management-bio\">Dedicated educator committed to academic excellence, character formation and creating a nurturing environment for every learner.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"management-card\">\r\n            <div class=\"management-image\">\r\n              <img src=\"/assets/vice-principal-academics.jpg\" alt=\"Mr. Daniel Ibrahim, Vice Principal Academics\" />\r\n            </div>\r\n            <div class=\"management-content\">\r\n              <div class=\"management-role\">Vice Principal (Academics)</div>\r\n              <h3 class=\"management-name\">Mr. Daniel Ibrahim</h3>\r\n              <p class=\"management-bio\">Experienced curriculum specialist ensuring teaching quality, assessment standards and continuous academic improvement.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"management-card\">\r\n            <div class=\"management-image\">\r\n              <img src=\"/assets/vice-principal-admin.jpg\" alt=\"Mrs. Grace Ojo, Vice Principal Administration\" />\r\n            </div>\r\n            <div class=\"management-content\">\r\n              <div class=\"management-role\">Vice Principal (Administration)</div>\r\n              <h3 class=\"management-name\">Mrs. Grace Ojo</h3>\r\n              <p class=\"management-bio\">Organised administrator overseeing staff welfare, school operations and parent communication with warmth and efficiency.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"management-card\">\r\n            <div class=\"management-image\">\r\n              <img src=\"/assets/head-ict.jpg\" alt=\"Mr. Samuel Adeyemi, Head of ICT\" />\r\n            </div>\r\n            <div class=\"management-content\">\r\n              <div class=\"management-role\">Head of ICT</div>\r\n              <h3 class=\"management-name\">Mr. Samuel Adeyemi</h3>\r\n              <p class=\"management-bio\">Technology enthusiast driving digital literacy, ICT integration and responsible use of technology across all subjects.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"management-card\">\r\n            <div class=\"management-image\">\r\n              <img src=\"/assets/counsellor.jpg\" alt=\"Mrs. Blessing Eze, Guidance & Counselling\" />\r\n            </div>\r\n            <div class=\"management-content\">\r\n              <div class=\"management-role\">Guidance &amp; Counselling</div>\r\n              <h3 class=\"management-name\">Mrs. Blessing Eze</h3>\r\n              <p class=\"management-bio\">Caring counsellor providing age-appropriate academic guidance, emotional support and character development for students.</p>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section section-light\">\r\n      <div class=\"container\">\r\n        <div style=\"display: flex; justify-content: space-between; align-items: center; gap: 40px; flex-wrap: wrap;\" class=\"reveal\">\r\n          <div>\r\n            <h2 class=\"font-display\" style=\"font-size: 28px; font-weight: 700; color: var(--navy);\">Want to meet our team?</h2>\r\n            <p style=\"font-size: 15px; color: var(--text-light); margin-top: 8px;\">Arrange a guided visit and ask the questions that matter to your family.</p>\r\n          </div>\r\n          <a href=\"#contact\" class=\"btn btn-primary\" data-page=\"contact\">Schedule a Visit <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- BULLETIN PAGE -->\r\n  <div class=\"page\" id=\"page-bulletin\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Bulletin</span></nav>\r\n        <h1 class=\"font-display\">News from our school community</h1>\r\n        <p>Stay close to admissions, events, achievements and important announcements.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"filter-bar reveal\" id=\"filterBar\">\r\n          <button class=\"filter-btn active\" data-filter=\"All\">All</button>\r\n          <button class=\"filter-btn\" data-filter=\"Admissions\">Admissions</button>\r\n          <button class=\"filter-btn\" data-filter=\"Events\">Events</button>\r\n          <button class=\"filter-btn\" data-filter=\"Achievements\">Achievements</button>\r\n          <button class=\"filter-btn\" data-filter=\"Announcements\">Announcements</button>\r\n        </div>\r\n        <div class=\"news-grid\" id=\"newsGrid\">\r\n          <!-- Populated by JS -->\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"cta-band\">\r\n      <div class=\"container cta-inner\">\r\n        <div class=\"cta-text\">\r\n          <p>Admissions 2026/2027</p>\r\n          <h2 class=\"font-display\">Give your child room to thrive.</h2>\r\n        </div>\r\n        <div class=\"cta-buttons\">\r\n          <a href=\"#contact\" class=\"btn btn-white\" data-page=\"contact\">Schedule a Visit</a>\r\n          <a href=\"https://forms.google.com\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-dark\">Apply Now <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- BULLETIN DETAIL PAGE -->\r\n  <div class=\"page\" id=\"page-bulletin-detail\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\">\r\n          <a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i>\r\n          <a href=\"#bulletin\" data-page=\"bulletin\">Bulletin</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i>\r\n          <span class=\"breadcrumb-current\" id=\"detailBreadcrumb\">Article</span>\r\n        </nav>\r\n        <h1 class=\"font-display\" id=\"detailTitle\">Bulletin Article</h1>\r\n        <p id=\"detailExcerpt\">Read the full story below.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"bulletin-detail-grid\">\r\n          <div>\r\n            <div class=\"bulletin-detail-image\">\r\n              <img id=\"detailImage\" src=\"/assets/news-admissions.jpg\" alt=\"\" />\r\n            </div>\r\n            <div class=\"bulletin-detail-meta\">\r\n              <span id=\"detailCategory\">Category</span>\r\n              <span class=\"news-meta-dot\"></span>\r\n              <span id=\"detailDate\">Date</span>\r\n            </div>\r\n            <h1 class=\"bulletin-detail-title font-display\" id=\"detailTitle2\">Article Title</h1>\r\n            <div class=\"bulletin-detail-body\" id=\"detailBody\">\r\n              <!-- Populated by JS -->\r\n            </div>\r\n          </div>\r\n          <aside class=\"bulletin-sidebar\">\r\n            <i class=\"fas fa-megaphone bulletin-sidebar-icon\"></i>\r\n            <h3>Stay informed</h3>\r\n            <p>Visit the school bulletin regularly for announcements and upcoming events.</p>\r\n            <a href=\"#bulletin\" class=\"news-link\" data-page=\"bulletin\"><i class=\"fas fa-chevron-left\"></i> Back to bulletin</a>\r\n          </aside>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- FACILITIES PAGE -->\r\n  <div class=\"page\" id=\"page-facilities\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Facilities</span></nav>\r\n        <h1 class=\"font-display\">Spaces designed for active learning</h1>\r\n        <p>Safe, practical and well-supported environments that help students explore ideas with confidence.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"section-header center reveal\">\r\n          <span class=\"eyebrow\">Our Facilities</span>\r\n          <h2 class=\"section-title font-display\">Everything learning needs</h2>\r\n          <p class=\"section-subtitle\">From quiet reading to practical science and team sport, our facilities support the complete school experience.</p>\r\n        </div>\r\n        <div class=\"facilities-grid reveal\">\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/classroom.jpg\" alt=\"Modern Classrooms\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-school\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Modern Classrooms</h3>\r\n              <p class=\"facility-text\">Bright, well-organised spaces for active learning.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/ict-lab.jpg\" alt=\"Computer & ICT Lab\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-laptop\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Computer &amp; ICT Lab</h3>\r\n              <p class=\"facility-text\">Guided digital learning and practical computer skills.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/science-lab.jpg\" alt=\"Science Laboratory\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-flask\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Science Laboratory</h3>\r\n              <p class=\"facility-text\">Hands-on discovery across biology, chemistry and physics.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/library.jpg\" alt=\"School Library\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-book-open\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">School Library</h3>\r\n              <p class=\"facility-text\">A quiet home for reading, research and independent study.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/sports.jpg\" alt=\"Sports Ground\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-running\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Sports Ground</h3>\r\n              <p class=\"facility-text\">Space for fitness, teamwork and healthy competition.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/school-building.jpg\" alt=\"Secure Environment\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-video\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Secure Environment</h3>\r\n              <p class=\"facility-text\">Controlled access, supervision and CCTV coverage.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/hero-students.jpg\" alt=\"Transport Service\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-bus\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Transport Service</h3>\r\n              <p class=\"facility-text\">Planned routes for safe and dependable school travel.</p>\r\n            </div>\r\n          </div>\r\n          <div class=\"facility-card\">\r\n            <div class=\"facility-image\">\r\n              <img src=\"/assets/students-outdoors.jpg\" alt=\"Counselling Unit\" />\r\n              <div class=\"facility-icon\"><i class=\"fas fa-heart\"></i></div>\r\n            </div>\r\n            <div class=\"facility-content\">\r\n              <h3 class=\"facility-title\">Counselling Unit</h3>\r\n              <p class=\"facility-text\">Age-appropriate academic and wellbeing guidance.</p>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section section-light\">\r\n      <div class=\"container\">\r\n        <div style=\"display: flex; justify-content: space-between; align-items: center; gap: 40px; flex-wrap: wrap;\" class=\"reveal\">\r\n          <div>\r\n            <h2 class=\"font-display\" style=\"font-size: 32px; font-weight: 700; color: var(--navy);\">See the school for yourself</h2>\r\n            <p style=\"font-size: 17px; color: var(--text-light); margin-top: 12px; max-width: 600px; line-height: 1.7;\">A campus visit is the best way to understand how our spaces, routines and people come together for your child.</p>\r\n          </div>\r\n          <a href=\"#contact\" class=\"btn btn-primary\" data-page=\"contact\">Book a School Tour <i class=\"fas fa-arrow-right\"></i></a>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- CONTACT PAGE -->\r\n  <div class=\"page\" id=\"page-contact\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Contact</span></nav>\r\n        <h1 class=\"font-display\">We would love to meet your family</h1>\r\n        <p>Ask a question, schedule a tour or speak with our admissions team.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"contact-grid\">\r\n          <div class=\"reveal\">\r\n            <span class=\"eyebrow\">Get in Touch</span>\r\n            <h2 class=\"section-title font-display\">Start a conversation</h2>\r\n            <p class=\"section-subtitle\">Our school office is ready to help with visits, admissions, transport and general enquiries.</p>\r\n            <div class=\"contact-info-list\">\r\n              <div class=\"contact-info-item\">\r\n                <div class=\"contact-info-icon\"><i class=\"fas fa-map-marker-alt\"></i></div>\r\n                <div>\r\n                  <div class=\"contact-info-title\">School Address</div>\r\n                  <div class=\"contact-info-text\">Teacher Home Secondary School,<br>Peace Community, Lokoja, Kogi State, Nigeria</div>\r\n                </div>\r\n              </div>\r\n              <div class=\"contact-info-item\">\r\n                <div class=\"contact-info-icon\"><i class=\"fas fa-phone\"></i></div>\r\n                <div>\r\n                  <div class=\"contact-info-title\">Phone</div>\r\n                  <div class=\"contact-info-text\"><a href=\"tel:+2348031234567\">+234 803 123 4567</a><br><a href=\"tel:+2348067654321\">+234 806 765 4321</a></div>\r\n                </div>\r\n              </div>\r\n              <div class=\"contact-info-item\">\r\n                <div class=\"contact-info-icon\"><i class=\"fas fa-envelope\"></i></div>\r\n                <div>\r\n                  <div class=\"contact-info-title\">Email</div>\r\n                  <div class=\"contact-info-text\"><a href=\"mailto:info@teacherhomeschool.com\">info@teacherhomeschool.com</a></div>\r\n                </div>\r\n              </div>\r\n              <div class=\"contact-info-item\">\r\n                <div class=\"contact-info-icon\"><i class=\"fas fa-clock\"></i></div>\r\n                <div>\r\n                  <div class=\"contact-info-title\">Office Hours</div>\r\n                  <div class=\"contact-info-text\">Monday - Friday, 8:00 AM - 4:00 PM</div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class=\"contact-socials\">\r\n              <a href=\"https://facebook.com\" target=\"_blank\" rel=\"noreferrer\" class=\"contact-social\"><i class=\"fab fa-facebook-f\"></i></a>\r\n              <a href=\"https://instagram.com\" target=\"_blank\" rel=\"noreferrer\" class=\"contact-social\"><i class=\"fab fa-instagram\"></i></a>\r\n              <a href=\"https://wa.me/\" target=\"_blank\" rel=\"noreferrer\" class=\"contact-social\"><i class=\"fab fa-whatsapp\"></i></a>\r\n            </div>\r\n          </div>\r\n          <div class=\"contact-form reveal\">\r\n            <h2 class=\"font-display\">Send us a message</h2>\r\n            <form id=\"contactForm\" class=\"form-grid\">\r\n              <div class=\"form-group\"><label class=\"form-label\">Full name</label><input type=\"text\" class=\"form-input\" placeholder=\"Your name\" required></div>\r\n              <div class=\"form-group\"><label class=\"form-label\">Email address</label><input type=\"email\" class=\"form-input\" placeholder=\"you@example.com\" required></div>\r\n              <div class=\"form-group\"><label class=\"form-label\">Phone number</label><input type=\"tel\" class=\"form-input\" placeholder=\"+234\"></div>\r\n              <div class=\"form-group\"><label class=\"form-label\">Enquiry type</label><input type=\"text\" class=\"form-input\" placeholder=\"Admissions, visit, transport...\"></div>\r\n              <div class=\"form-group full\"><label class=\"form-label\">Message</label><textarea class=\"form-input\" rows=\"5\" placeholder=\"How can we help?\" required></textarea></div>\r\n              <div class=\"form-group full\"><button type=\"submit\" class=\"btn btn-primary\">Send Message <i class=\"fas fa-paper-plane\"></i></button></div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"map-section\">\r\n      <iframe title=\"Map showing Teacher Home Secondary School in Peace Community, Lokoja\" src=\"https://www.google.com/maps?q=Teacher%20Home%20Secondary%20School%20Peace%20Community%20Lokoja%20Kogi%20State&output=embed\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\" allowfullscreen></iframe>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- PORTAL PAGE -->\r\n  <div class=\"page\" id=\"page-portal\">\r\n    <section class=\"page-hero\">\r\n      <div class=\"container page-hero-content\">\r\n        <nav class=\"breadcrumb\"><a href=\"#home\" data-page=\"home\">Home</a><i class=\"fas fa-chevron-right\" style=\"font-size: 10px;\"></i><span class=\"breadcrumb-current\">Portal</span></nav>\r\n        <h1 class=\"font-display\">Results and records, securely online</h1>\r\n        <p>Use the Teacher Home portal to review released results and academic information.</p>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section\">\r\n      <div class=\"container\">\r\n        <div class=\"portal-grid\">\r\n          <div class=\"reveal\">\r\n            <span class=\"eyebrow\">Result Checking</span>\r\n            <h2 class=\"section-title font-display\">Access your child's results</h2>\r\n            <p class=\"section-subtitle\">The portal gives authorised families a simple and secure way to view academic results when they are released.</p>\r\n            <div class=\"portal-steps\">\r\n              <div class=\"portal-step\"><div class=\"portal-step-num\">1</div><div class=\"portal-step-text\">Open the Teacher Home result portal.</div></div>\r\n              <div class=\"portal-step\"><div class=\"portal-step-num\">2</div><div class=\"portal-step-text\">Enter the student ID supplied by the school.</div></div>\r\n              <div class=\"portal-step\"><div class=\"portal-step-num\">3</div><div class=\"portal-step-text\">Enter the password or result-checking PIN.</div></div>\r\n              <div class=\"portal-step\"><div class=\"portal-step-num\">4</div><div class=\"portal-step-text\">Select the session and term, then view or print the result.</div></div>\r\n            </div>\r\n            <div style=\"display: flex; gap: 16px; flex-wrap: wrap; margin-top: 32px;\">\n              <a href=\"/student-login\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-primary\">Open Student Portal <i class=\"fas fa-external-link-alt\"></i></a>\n              <a href=\"/admin-login\" target=\"_blank\" rel=\"noreferrer\" class=\"btn btn-secondary\">Open Staff Portal <i class=\"fas fa-external-link-alt\"></i></a>\n            </div>\r\n          </div>\r\n          <div class=\"portal-card reveal\">\r\n            <i class=\"fas fa-lock portal-card-icon\"></i>\r\n            <h2 class=\"font-display\">Login credentials guide</h2>\r\n            <div class=\"portal-info\">\r\n              <div class=\"portal-info-label\">Student ID</div>\r\n              <div class=\"portal-info-text\">Use the unique ID printed on the student's school identity card or issued by the office.</div>\r\n            </div>\r\n            <div class=\"portal-info\">\r\n              <div class=\"portal-info-label\">Password / PIN</div>\r\n              <div class=\"portal-info-text\">The password/PIN is the student's surname.</div>\r\n            </div>\r\n            <div class=\"portal-card-footer\">\r\n              <p>Need access help? Contact the school office with the student's full name and class.</p>\r\n              <a href=\"#contact\" class=\"portal-link\" data-page=\"contact\">Get portal support <i class=\"fas fa-arrow-right\"></i></a>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <section class=\"section section-light\">\r\n      <div class=\"container\">\r\n        <div style=\"display: flex; gap: 20px; align-items: flex-start;\" class=\"reveal\">\r\n          <i class=\"fas fa-shield-alt\" style=\"font-size: 28px; color: var(--navy-light); margin-top: 4px; flex-shrink: 0;\"></i>\r\n          <div>\r\n            <h2 style=\"font-size: 20px; font-weight: 800; color: var(--navy); margin-bottom: 8px;\">Keep your account secure</h2>\r\n            <p style=\"font-size: 15px; color: var(--text-light); line-height: 1.7; max-width: 800px;\">Teacher Home staff will never ask you to post login credentials publicly. Always confirm that you are on the official Teacher Home portal before entering student details.</p>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n  </div>\r\n\r\n  <!-- 404 PAGE -->\r\n  <div class=\"page\" id=\"page-404\">\r\n    <section class=\"not-found\">\r\n      <div>\r\n        <div class=\"not-found-code font-display\">404</div>\r\n        <h1 class=\"font-display\">This page could not be found</h1>\r\n        <p>The link may have changed. Return home or visit the school bulletin for the latest information.</p>\r\n        <a href=\"#home\" class=\"btn btn-primary\" data-page=\"home\"><i class=\"fas fa-home\"></i> Return Home</a>\r\n      </div>\r\n    </section>\r\n  </div>\r\n</main>\r\n\r\n<!-- Footer -->\r\n<footer class=\"footer\">\r\n  <div class=\"container\">\r\n    <div class=\"footer-grid\">\r\n      <div class=\"footer-brand\">\r\n        <a href=\"#home\" class=\"logo\" data-page=\"home\" style=\"color: var(--white);\">\r\n          <div class=\"logo-crest\" style=\"background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);\">\r\n            <img src=\"/assets/logo.png\" alt=\"Teacher Home Secondary School crest\" />\r\n          </div>\r\n          <div class=\"logo-text\">\r\n            <span class=\"logo-name\" style=\"color: var(--white);\">Teacher Home</span>\r\n            <span class=\"logo-sub\" style=\"color: var(--blue-accent);\">Secondary School</span>\r\n          </div>\r\n        </a>\r\n        <p>Building capable, principled and future-ready young people through excellent secondary education in Lokoja.</p>\r\n        <div class=\"footer-socials\">\r\n          <a href=\"https://facebook.com\" target=\"_blank\" rel=\"noreferrer\" class=\"footer-social\"><i class=\"fab fa-facebook-f\"></i></a>\r\n          <a href=\"https://instagram.com\" target=\"_blank\" rel=\"noreferrer\" class=\"footer-social\"><i class=\"fab fa-instagram\"></i></a>\r\n          <a href=\"https://wa.me/\" target=\"_blank\" rel=\"noreferrer\" class=\"footer-social\"><i class=\"fab fa-whatsapp\"></i></a>\r\n        </div>\r\n      </div>\r\n      <div>\r\n        <div class=\"footer-title\">Explore</div>\r\n        <div class=\"footer-links\">\r\n          <a href=\"#about\" class=\"footer-link\" data-page=\"about\">About Us</a>\r\n          <a href=\"#academics\" class=\"footer-link\" data-page=\"academics\">Academics</a>\r\n          <a href=\"#facilities\" class=\"footer-link\" data-page=\"facilities\">Facilities</a>\r\n          <a href=\"#management\" class=\"footer-link\" data-page=\"management\">Management</a>\r\n        </div>\r\n      </div>\r\n      <div>\r\n        <div class=\"footer-title\">Parents</div>\r\n        <div class=\"footer-links\">\r\n          <a href=\"#admissions\" class=\"footer-link\" data-page=\"admissions\">Admissions</a>\r\n          <a href=\"#bulletin\" class=\"footer-link\" data-page=\"bulletin\">School Bulletin</a>\r\n          <a href=\"/student-login\" target=\"_blank\" rel=\"noreferrer\" class=\"footer-link\">Student &amp; Parents Portal</a>\r\n          <a href=\"/admin-login\" target=\"_blank\" rel=\"noreferrer\" class=\"footer-link\">Staff Portal</a>\r\n          <a href=\"#contact\" class=\"footer-link\" data-page=\"contact\">Schedule a Visit</a>\r\n        </div>\r\n      </div>\r\n      <div>\r\n        <div class=\"footer-title\">Contact</div>\r\n        <div class=\"footer-contact\">\r\n          <div class=\"footer-contact-item\"><i class=\"fas fa-map-marker-alt\"></i><span>Teacher Home Secondary School, Peace Community, Lokoja, Kogi State</span></div>\r\n          <div class=\"footer-contact-item\"><i class=\"fas fa-phone\"></i><a href=\"tel:+2348031234567\">+234 803 123 4567</a></div>\r\n          <div class=\"footer-contact-item\"><i class=\"fas fa-envelope\"></i><a href=\"mailto:info@teacherhomeschool.com\">info@teacherhomeschool.com</a></div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"footer-bottom\">\r\n      <div>&copy; 2026 Teacher Home Secondary School. All rights reserved.</div>\r\n      <div>Built by <a href=\"https://delversetech.com\" target=\"_blank\" rel=\"noreferrer\">Delverse Technologies Limited</a></div>\r\n    </div>\r\n  </div>\r\n</footer>";

export function TeacherHomeWebsite({
  initialPage = 'home',
  initialSlug,
  liveAnnouncements = [],
}: TeacherHomeWebsiteProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Merge live Supabase announcements with default bulletin posts (deduplicated by slug)
    const mergedMap = new Map<string, PublicAnnouncementItem>();
    for (const item of liveAnnouncements) {
      mergedMap.set(item.slug, item);
    }
    for (const item of DEFAULT_BULLETIN_POSTS) {
      if (!mergedMap.has(item.slug)) {
        mergedMap.set(item.slug, item);
      }
    }
    const bulletinPosts = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const renderNewsCard = (post: PublicAnnouncementItem) => `
      <article class="news-card reveal visible" data-category="${post.category}">
        <div class="news-image">
          <img src="${post.image}" alt="${post.title}" />
        </div>
        <div class="news-content">
          <div class="news-meta"><span>${post.category}</span><span class="news-meta-dot"></span><span class="news-meta-date">${post.dateDisplay}</span></div>
          <h3 class="news-title">${post.title}</h3>
          <p class="news-excerpt">${post.excerpt}</p>
          <a href="#bulletin/${post.slug}" class="news-link" data-page="bulletin-detail" data-slug="${post.slug}">Read more <i class="fas fa-arrow-right"></i></a>
        </div>
      </article>
    `;

    const initReveal = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      root.querySelectorAll('.reveal').forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el);
      });
    };

    const populateHomeNews = () => {
      const grid = root.querySelector('#homeNewsGrid');
      if (!grid) return;
      grid.innerHTML = bulletinPosts.slice(0, 3).map(renderNewsCard).join('');
    };

    const populateBulletinNews = (filter = 'All') => {
      const grid = root.querySelector('#newsGrid');
      if (!grid) return;
      const filtered =
        filter === 'All'
          ? bulletinPosts
          : bulletinPosts.filter(
              (p) => p.category.toLowerCase() === filter.toLowerCase()
            );
      grid.innerHTML = filtered.map(renderNewsCard).join('');
      setTimeout(initReveal, 50);
    };

    const populateBulletinDetail = (slug: string) => {
      const post = bulletinPosts.find((p) => p.slug === slug) || bulletinPosts[0];
      if (!post) return false;
      const breadcrumb = root.querySelector('#detailBreadcrumb');
      const title = root.querySelector('#detailTitle');
      const excerpt = root.querySelector('#detailExcerpt');
      const image = root.querySelector('#detailImage') as HTMLImageElement | null;
      const category = root.querySelector('#detailCategory');
      const date = root.querySelector('#detailDate');
      const title2 = root.querySelector('#detailTitle2');
      const body = root.querySelector('#detailBody');

      if (breadcrumb) breadcrumb.textContent = post.category;
      if (title) title.textContent = post.title;
      if (excerpt) excerpt.textContent = post.excerpt;
      if (image) {
        image.src = post.image;
        image.alt = post.title;
      }
      if (category) category.textContent = post.category;
      if (date) date.textContent = post.dateDisplay;
      if (title2) title2.textContent = post.title;
      if (body) body.innerHTML = post.body.map((p) => `<p>${p}</p>`).join('');
      document.title = `${post.title} | Teacher Home Secondary School`;
      return true;
    };

    const pages = [
      'home',
      'about',
      'academics',
      'admissions',
      'management',
      'bulletin',
      'bulletin-detail',
      'facilities',
      'contact',
      'portal',
    ];

    const navigateTo = (pageId: string, extra?: { slug?: string }) => {
      let targetId = pages.includes(pageId) ? pageId : '404';
      root.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));

      const targetPage = root.querySelector('#page-' + targetId);
      if (targetPage) {
        targetPage.classList.add('active');
      } else {
        root.querySelector('#page-404')?.classList.add('active');
      }

      root.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
        const htmlLink = link as HTMLElement;
        htmlLink.classList.remove('active');
        if (htmlLink.dataset.page === targetId) htmlLink.classList.add('active');
      });

      if (targetId === 'bulletin-detail' && extra?.slug) {
        populateBulletinDetail(extra.slug);
      }

      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      const mobileMenu = root.querySelector('#mobileMenu');
      mobileMenu?.classList.remove('open');
      const menuIcon = root.querySelector('#menuToggle i');
      if (menuIcon) menuIcon.className = 'fas fa-bars';
      setTimeout(initReveal, 80);
    };

    const handleRootClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Page navigation links
      const link = target.closest('[data-page]') as HTMLElement | null;
      if (link) {
        e.preventDefault();
        const pageId = link.dataset.page || 'home';
        const slug = link.dataset.slug;
        if (pageId === 'bulletin-detail' && slug) {
          navigateTo(pageId, { slug });
          window.history.pushState(null, '', '#bulletin/' + slug);
        } else {
          navigateTo(pageId);
          window.history.pushState(null, '', '#' + pageId);
        }
        return;
      }

      // Mobile menu toggle
      const toggleBtn = target.closest('#menuToggle');
      if (toggleBtn) {
        const mobileMenu = root.querySelector('#mobileMenu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('open');
          const icon = toggleBtn.querySelector('i');
          if (icon) {
            icon.className = mobileMenu.classList.contains('open')
              ? 'fas fa-times'
              : 'fas fa-bars';
          }
        }
        return;
      }

      // FAQ accordion
      const faqBtn = target.closest('.faq-question');
      if (faqBtn && faqBtn.parentElement) {
        const item = faqBtn.parentElement;
        const isOpen = item.classList.contains('open');
        root.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
        return;
      }

      // Bulletin filter buttons
      const filterBtn = target.closest('.filter-btn') as HTMLElement | null;
      if (filterBtn) {
        root.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        filterBtn.classList.add('active');
        populateBulletinNews(filterBtn.dataset.filter || 'All');
        return;
      }
    };

    // Testimonials
    const testimonials = [
      {
        quote:
          'Teacher Home has helped our daughter become more focused, confident and eager to learn. We value the communication and genuine care.',
        name: 'Mrs. A. Okene',
        role: 'Parent, JSS2',
      },
      {
        quote:
          'The balance of discipline, academics and technology is exactly what we wanted. Our son feels known and supported by his teachers.',
        name: 'Mr. J. Musa',
        role: 'Parent, SSS1',
      },
    ];
    let currentTestimonial = 0;
    const updateTestimonial = () => {
      const t = testimonials[currentTestimonial];
      const textEl = root.querySelector('#testimonialText');
      const authorEl = root.querySelector('#testimonialAuthor');
      const roleEl = root.querySelector('#testimonialRole');
      if (textEl) textEl.textContent = '"' + t.quote + '"';
      if (authorEl) authorEl.textContent = t.name;
      if (roleEl) roleEl.textContent = t.role;
    };

    const prevBtn = root.querySelector('#prevTestimonial');
    const nextBtn = root.querySelector('#nextTestimonial');
    const onPrev = () => {
      currentTestimonial =
        (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      updateTestimonial();
    };
    const onNext = () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      updateTestimonial();
    };
    prevBtn?.addEventListener('click', onPrev);
    nextBtn?.addEventListener('click', onNext);

    // Contact form
    const contactForm = root.querySelector('#contactForm') as HTMLFormElement | null;
    const onContactSubmit = (e: Event) => {
      e.preventDefault();
      if (!contactForm) return;
      const inputs = contactForm.querySelectorAll('.form-input') as NodeListOf<
        HTMLInputElement | HTMLTextAreaElement
      >;
      const name = inputs[0]?.value || '';
      const email = inputs[1]?.value || '';
      const phone = inputs[2]?.value || '';
      const subjectInput = inputs[3]?.value || 'General Enquiry';
      const message = inputs[4]?.value || '';
      const subject = encodeURIComponent('Website enquiry: ' + subjectInput);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
      );
      window.location.href = `mailto:info@teacherhomeschool.com?subject=${subject}&body=${body}`;
      contactForm.reset();
    };
    contactForm?.addEventListener('submit', onContactSubmit);

    // Hash change listener
    const handleHash = () => {
      const rawHash = window.location.hash.slice(1);
      if (rawHash) {
        if (rawHash.startsWith('bulletin/')) {
          const slug = rawHash.split('/')[1];
          navigateTo('bulletin-detail', { slug });
        } else {
          navigateTo(rawHash);
        }
      } else if (initialPage === 'bulletin-detail' && initialSlug) {
        navigateTo('bulletin-detail', { slug: initialSlug });
      } else {
        navigateTo(initialPage);
      }
    };

    root.addEventListener('click', handleRootClick);
    window.addEventListener('hashchange', handleHash);

    populateHomeNews();
    populateBulletinNews();
    handleHash();
    initReveal();

    return () => {
      root.removeEventListener('click', handleRootClick);
      window.removeEventListener('hashchange', handleHash);
      prevBtn?.removeEventListener('click', onPrev);
      nextBtn?.removeEventListener('click', onNext);
      contactForm?.removeEventListener('submit', onContactSubmit);
    };
  }, [initialPage, initialSlug, liveAnnouncements]);

  return (
    <div
      ref={rootRef}
      className="thss-site"
      dangerouslySetInnerHTML={{ __html: BODY_HTML }}
    />
  );
}
