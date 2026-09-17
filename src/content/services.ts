// Placeholder copy from the Averix template. Phase 2 replaces it with Renoir's services.
import { faq } from "../data/faq";

const detail = {
  tagline: "RELAS TOOLS ANYTime",
  heading: "Designing Digital Experiences with Impact",
  intro: [
    'In the realm of digital innovation, the demand for creative and immersive experiences extends far beyond the confines of the screen. At Rethink, we are excited to unveil our latest project, the "Beyond the Screen Digital Products Marketplace," a platform where the boundaries of digital design are transcended. In this blog post, we delve into the intricate process of crafting the design for this groundbreaking marketplace that takes users on a journey beyond conventional digital experiences.',
    'The vision behind the "Beyond the Screen" marketplace was clear from the start – to redefine the way users interact with digital products. We envisioned a space where users could not only browse and purchase digital goods but also immerse themselves in an interactive and visually captivating environment.',
  ],
  summary:
    'In the realm of digital innovation, the demand for creative and immersive experiences extends far beyond the confines of the screen. At Rethink, we are excited to unveil our latest project, the "Beyond the Screen Digital Products Marketplace," a platform where the boundaries of digital design are transcended. In this blog post, we delve into the intricate process of crafting the design for this groundbreaking marketplace.',
  benefitsTitle: "Benefits of this service",
  benefitsIntro:
    "The UI/UX & Product Innovation Service Package offers a multitude of tangible and strategic benefits that help businesses enhance user satisfaction, achieve measurable outcomes, and stay ahead of the competition. Here's a detailed breakdown:",
  benefits: [
    ["Custom Website Design", "Responsive Web Development", "E-Commerce Solutions", "JavaScript", "API Integration", "Front End Development"],
    ["Front End Development", "Content Management Systems", "Website Maintenance and", "SEO Optimization", "Performance Optimization"],
  ],
  images: ["service-details/service-d-1.jpg", "service-details/service-d-2.jpg", "service-details/service-d-3.jpg"],
  faq,
};

const excerpt =
  "We are digital agency that helps businesses develop immersive and engaging user experiences that drive top level engaging user develop experiences. We are digital agency";

export const services = [
  { id: "digital-marketing-strategy", order: 1, title: "Digital Marketing Strategy", excerpt, thumb: "service/img.jpg", ...detail },
  { id: "web-design-development", order: 2, title: "Web Design & Development", excerpt, thumb: "service/img2.jpg", ...detail },
  { id: "branding-identity", order: 3, title: "Branding & Identity", excerpt, thumb: "service/img3.jpg", ...detail },
  { id: "motion-3d-modeling", order: 4, title: "Motion & 3d modeling", excerpt, thumb: "service/img4.jpg", ...detail },
];
