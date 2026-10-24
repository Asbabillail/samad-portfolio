// Static portfolio information, not a live device or security monitoring feed.
// Figures below are user-supplied working scope as of October 2026.
// No internal network topology, room/door layout, IPs, device serials, or credentials are published.
export const infrastructureTelemetry = [
  {
    category: "ENDPOINTS & DEVICE MANAGEMENT",
    items: [
      { title: "Student iPads", value: "400", subtitle: "Apple School Manager / Jamf for Education", status: "Managed" },
      { title: "Teacher iPads", value: "60", subtitle: "Faculty Apple device support", status: "Managed" },
      { title: "Student BYOD Devices", value: "50+", subtitle: "Student-owned device support", status: "Supported" },
      { title: "ICT Lab Workstations", value: "25 per lab", subtitle: "Microsoft Intune enrollment and shared-device policies", status: "In Progress" },
      { title: "Administrative PCs & Laptops", value: "Managed", subtitle: "Windows endpoint lifecycle support", status: "Supported" }
    ]
  },
  {
    category: "CLOUD IDENTITY & COLLABORATION",
    items: [
      { title: "Microsoft Accounts", value: "800+", subtitle: "Microsoft 365 and integration with Apple/Jamf workflows", status: "Managed" }
    ]
  },
  {
    category: "EDUCATION & INNOVATION PLATFORMS",
    items: [
      { title: "SMART Interactive Boards", value: "52", subtitle: "SMART administrative tools and Lumio", status: "Managed" },
      { title: "Video Walls", value: "2", subtitle: "Presentation and event technology", status: "Supported" },
      { title: "VR Device Management", value: "ArborXR", subtitle: "Vendor-supported headset management", status: "Supported" },
      { title: "Robotics & VR Platforms", value: "SciVR / UBTECH", subtitle: "Platform administration and technical readiness", status: "Supported" }
    ]
  },
  {
    category: "NETWORK & CAMPUS TECHNOLOGY",
    items: [
      { title: "Next-Generation Firewall", value: "FortiGate 200F", subtitle: "High-level operational responsibility", status: "Supported" },
      { title: "Switching & Wireless", value: "Cisco / Hikvision", subtitle: "Enterprise network support; topology not disclosed", status: "Supported" },
      { title: "Physical Security & Telephony", value: "Operational support", subtitle: "Security devices and communication systems", status: "Supported" }
    ]
  }
];
