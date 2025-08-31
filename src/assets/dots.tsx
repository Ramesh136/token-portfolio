import React from "react";

const DotsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.80566 8C6.80566 7.34033 7.34044 6.80556 8.00011 6.80556C8.65978 6.80556 9.19455 7.34033 9.19455 8C9.19455 8.65967 8.65978 9.19444 8.00011 9.19444C7.34044 9.19444 6.80566 8.65967 6.80566 8Z"
      fill="#A1A1AA"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.69434 8C1.69434 7.34033 2.22911 6.80556 2.88878 6.80556C3.54845 6.80556 4.08322 7.34033 4.08322 8C4.08322 8.65967 3.54845 9.19444 2.88878 9.19444C2.22911 9.19444 1.69434 8.65967 1.69434 8Z"
      fill="#A1A1AA"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9167 8C11.9167 7.34033 12.4515 6.80556 13.1112 6.80556C13.7709 6.80556 14.3056 7.34033 14.3056 8C14.3056 8.65967 13.7709 9.19444 13.1112 9.19444C12.4515 9.19444 11.9167 8.65967 11.9167 8Z"
      fill="#A1A1AA"
    />
  </svg>
);

export default DotsIcon;
