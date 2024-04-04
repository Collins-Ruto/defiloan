import React from "react";
import PropTypes from "prop-types";

const shapes = {
  square: "rounded-[0px]",
  round: "rounded-[13px]",
};
const variants = {
  fill: {
    purple_A200_c1: "bg-purple-A200_c1 shadow-sm text-gray-900_01",
    purple_A200: "bg-purple-A200 text-white-A700_01",
    pink_300: "bg-pink-300 text-white-A700_01",
    gray_300_e5: "bg-gray-300_e5 shadow-sm text-gray-900_01",
    white_A700_01: "bg-white-A700_01 shadow-sm text-gray-900_01",
    white_A700: "bg-white-A700 shadow-sm text-gray-900_01",
    red_50: "bg-red-50 text-red-600",
    gray_50_01: "bg-gray-50_01 text-purple-A200",
  },
  outline: {
    gray_500: "border-gray-500 border border-solid text-gray-500",
  },
};
const sizes = {
  "3xl": "h-[50px] px-[35px] text-xl",
  xl: "h-[39px]",
  xs: "h-[24px] px-5 text-[9px]",
  "2xl": "h-[42px] px-[35px] text-sm",
  md: "h-[32px] px-2 text-xs",
  lg: "h-[36px] px-2.5 text-sm",
  sm: "h-[26px] px-[17px] text-sm",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "sm",
  color = "gray_50_01",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["square", "round"]),
  size: PropTypes.oneOf(["3xl", "xl", "xs", "2xl", "md", "lg", "sm"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "purple_A200_c1",
    "purple_A200",
    "pink_300",
    "gray_300_e5",
    "white_A700_01",
    "white_A700",
    "red_50",
    "gray_50_01",
    "gray_500",
  ]),
};

export { Button };
