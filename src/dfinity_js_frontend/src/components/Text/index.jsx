import React from "react";

const sizes = {
  xs: "text-xs font-normal",
  lg: "text-lg font-normal",
  s: "text-sm font-normal",
  xl: "text-[32px] font-normal md:text-3xl sm:text-[28px]",
  md: "text-base font-medium",
};

const Text = ({ children, className = "", as, size = "s", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-gray-900_01 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
