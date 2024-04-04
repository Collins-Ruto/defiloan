import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[15px]",
};
const variants = {
  fill: {
    gray_200: "bg-gray-200 shadow-sm",
    gray_100: "bg-gray-100 text-gray-900_01",
  },
};
const sizes = {
  sm: "h-[65px] pl-[26px] pr-[35px] text-sm",
  xs: "h-[35px] pl-3 pr-[35px] text-sm",
};

const Input = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      label = "",
      prefix,
      suffix,
      onChange,
      shape,
      variant = "fill",
      size = "xs",
      color = "gray_100",
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (e) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <>
        <div
          className={`${className} flex items-center justify-center text-sm  ${(shape && shapes[shape]) || ""} ${variants[variant]?.[color] || variants[variant] || ""} ${sizes[size] || ""}`}
        >
          {!!label && label}
          {!!prefix && prefix}
          <input ref={ref} type={type} name={name} onChange={handleChange} placeholder={placeholder} {...restProps} />
          {!!suffix && suffix}
        </div>
      </>
    );
  },
);

Input.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["sm", "xs"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["gray_200", "gray_100"]),
};

export { Input };
