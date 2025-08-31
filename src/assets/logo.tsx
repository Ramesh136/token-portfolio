import React from "react";

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <rect width="28" height="28" rx="8" fill="#A9E851" />
    <path d="M6 6L19 9.5L22 22H6V6Z" fill="#18181B" />
  </svg>
);

export default Logo;
