// Placeholder copy from the Averix template. Phase 2 replaces it with Renoir's case studies.
const detail = {
  heroImage: "portfolio-details/portfolio-d-1.jpg",
  gallery: ["portfolio-details/portfolio-d-2.jpg", "portfolio-details/portfolio-d-3.jpg", "portfolio-details/portfolio-d-4.jpg"],
  overview:
    "A s we reflect on this achievement, we look forward to continuing our journe digital innovation, transformative solutions, and shaping the future of the digital landscape. Celebrating a major milestone in digital services is a significan occasion. This milestone is a testament to the hard work, creativity, and dedication of our incredible team and the unwavering support from our clients and partners. We are grateful for the trust placed in us and the collaborative efforts that have fueled our trust placed in us and the collaborative success.",
  challenge:
    "When creating a detailed case study, it’s important to provide comprehensive information that communicates the story of the project, including the challenges faced, the solutions implemented, and the achieved results. When creating a detailed case study, it’s important to provide comprehensive information that communicates the story of the project, including the challenges faced.",
  result:
    "For almost 50 years Leighton Asia, one of the region’s largest and most respected construction companies, has been progressively building for a better future by leveraging international expertise with local intelligence. In that time Leighton has delivered some of Asia’s prestigious.",
  info: { category: "Development", software: "Html, Figma", service: "Development", client: "Eunice Mills", date: "Feb 6, 2026" },
  tags: ["Tagline Creation", "Web desing", "Unique Visual Identity"],
  category: "Web Design",
  subtitle: "Unique Visual Identity",
  year: "2026",
};

// `featured` = position in the home page project slider.
export const portfolio = [
  { id: "brand-refresh-urbanspace", order: 1, title: "Brand Refresh for UrbanSpace", image: "project/img8.jpg", ...detail },
  { id: "new-look-apex-fitness", order: 2, title: "New Look for Apex Fitness", image: "project/img9.jpg", ...detail },
  { id: "digital-revamp-luxe-living", order: 3, title: "Digital Revamp for Luxe Living", image: "project/img10.jpg", featured: 3, featuredImage: "project/img3.jpg", ...detail },
  { id: "digital-printing", order: 4, title: "Digital Printing", image: "project/img11.jpg", featured: 1, featuredImage: "project/img.jpg", ...detail },
  { id: "kinetic-sandscapes", order: 5, title: "Kinetic Sandscapes", image: "project/img12.jpg", featured: 2, featuredImage: "project/img2.jpg", ...detail },
];
