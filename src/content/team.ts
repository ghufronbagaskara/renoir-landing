// Placeholder copy from the Averix template. Phase 2 replaces it with Renoir's team.
import { site } from "../data/site";

const detail = {
  role: "Web Developer",
  detailImage: "team-details/team-d-1.jpg",
  bio: "Alex is the visionary force behind our agency's bold creative direction With over 12 bold years in branding and campaign design, Alex has led projects glo grassroots startups alike. He thrives on pushing boundaries and turning ideas immersive,bold unforgettable experiences Superpower chaos into concept.",
  quote:
    "We're not just a creative agency we're your brand’s creative growth partner From first impression to lasting impact we build brands that connect, campaigns convert, and content that moves people Our team blends strategy.",
  email: "hello@gmail.com",
  phone: "208-6666-0112 308",
  socials: {
    x: site.socials.x,
    instagram: site.socials.instagram,
    linkedin: site.socials.linkedin,
    behance: site.socials.behance,
    pinterest: site.socials.pinterest,
    dribbble: "https://dribbble.com/",
  },
};

export const team = [
  ["abu-talha", "Abu Talha"],
  ["jinnira-alam", "Jinnira Alam"],
  ["saad-alam", "Saad Alam"],
  ["shirin-sultana", "Shirin Sultana"],
  ["mahi-alam", "Mahi Alam"],
  ["nashid-alam", "Nashid Alam"],
  ["joyriya", "Joyriya"],
  ["murshed-alam", "Murshed Alam"],
].map(([id, name], i) => ({ id, name, order: i + 1, image: `team/team${i + 1}.jpg`, ...detail }));
