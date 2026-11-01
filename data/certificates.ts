export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  category: 'Certification' | 'Training' | 'Courses' | 'Recognition';
  date: string;
  note?: string;
};

// Transcribed from the original certificates, reviewed 1 November 2026.
// The duplicate Computer Networks certificate is represented once.
export const certificates: Certificate[] = [
  { id: '01', title: 'Google Certified Educator — Level 1', issuer: 'Google for Education', category: 'Certification', date: '19 Feb 2026', note: 'Valid through 19 February 2029' },
  { id: '02', title: 'Active Learning on the SMART MX-V5 Display with iQ 4', issuer: 'SMART Technologies', category: 'Training', date: '3 Jan 2026', note: '1 professional development hour' },
  { id: '19', title: 'STEM Training Sessions', issuer: 'DOME PDS · STEM Nexus Arabia & SKOOL21', category: 'Training', date: 'Sep 2025', note: '18 hours of professional development; assessments completed' },
  { id: '18', title: 'Empowering Educators with Technology', issuer: 'SMART Education', category: 'Recognition', date: '8 Nov 2025', note: 'Certificate of appreciation' },
  { id: '20', title: 'Commitment to Educational Excellence', issuer: 'Yenepoya International School — KSA', category: 'Recognition', date: '2025', note: 'Certificate of appreciation' },
  { id: '00', title: 'AI MasterClass', issuer: 'Dhruv Rathee Academy', category: 'Training', date: '15 Feb 2026', note: 'Certificate of participation' },
  { id: '15', title: 'Data Science with Python', issuer: 'SkillUp by Simplilearn', category: 'Courses', date: '20 Aug 2023' },
  { id: '16', title: 'Introduction to Data Visualization', issuer: 'SkillUp by Simplilearn', category: 'Courses', date: '20 Sep 2023' },
  { id: '08', title: 'Microsoft Excel — Learn MS Excel for Data Analysis', issuer: 'Udemy · Yassin Marco', category: 'Courses', date: '4 Feb 2024' },
  { id: '17', title: 'Learn CCNA 200-301 Network Fundamentals Online', issuer: 'SkillUp by Simplilearn', category: 'Courses', date: '3 Sep 2023', note: 'Course completion' },
  { id: '12', title: 'Computer Networks Fundamentals', issuer: 'Udemy · Cyber Quince', category: 'Courses', date: '20 Aug 2023' },
  { id: '05', title: 'IP Addressing and Subnetting — Zero to Hero', issuer: 'Udemy · Cyber Quince', category: 'Courses', date: '23 Aug 2023' },
  { id: '03', title: 'Windows 10 Complete Course: From Zero to Professional!', issuer: 'Udemy · Abdul Rahman Niazi', category: 'Courses', date: '4 Feb 2024' },
  { id: '06', title: 'Technical Consulting Virtual Internship', issuer: 'SAP · Forage', category: 'Training', date: '21 Aug 2023', note: 'Virtual job simulation: data assembly, analysis and presentation' },
  { id: '07', title: "Primavera P6 Unveiled: Step-by-Step Beginner’s Training", issuer: 'Udemy · Basharat Bhatti', category: 'Courses', date: '14 Sep 2023' },
  { id: '10', title: 'HCSA-Alarm', issuer: 'Hikvision', category: 'Certification', date: 'Valid through Apr 2026', note: 'Expired · retained as part of my learning history' },
  { id: '11', title: 'CSS Complete Course for Beginners', issuer: 'Udemy · PROPER DOT INSTITUTE', category: 'Courses', date: '19 Jun 2023' },
  { id: '13', title: 'C++ Complete Training Course for Beginners 2022', issuer: 'Udemy · Krish Valley', category: 'Courses', date: '10 Jun 2023' },
  { id: '14', title: 'Amazon SEO Guide: Building Sales Funnels for Amazon', issuer: 'Udemy · Tareq Hajj', category: 'Courses', date: '20 Jun 2023' },
  { id: '09', title: 'Instagram Marketing 2023: How to Promote Your Business!', issuer: 'Udemy · Anton Voroniuk & Vlad Bogutskiy', category: 'Courses', date: '29 Jun 2023' },
];
