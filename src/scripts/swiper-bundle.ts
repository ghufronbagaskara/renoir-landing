// Static named imports so Rollup tree-shakes Swiper down to the modules we use;
// sliders.ts imports this file lazily.
export { default as Swiper } from "swiper";
export { A11y, Autoplay, Navigation, Scrollbar } from "swiper/modules";
