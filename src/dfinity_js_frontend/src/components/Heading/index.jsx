import React from "react";

const sizes = {
  "3xl": "text-[34px] font-bold md:text-[32px] sm:text-3xl",
  "2xl": "text-[32px] font-bold md:text-3xl sm:text-[28px]",
  xl: "text-2xl font-bold md:text-[22px]",
  "4xl": "text-[40px] font-bold md:text-[38px] sm:text-4xl",
  s: "text-base font-bold",
  md: "text-lg font-bold",
  xs: "text-sm font-bold",
  lg: "text-xl font-bold",
};

const Heading = ({ children, className = "", size = "xs", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-gray-900_01 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
