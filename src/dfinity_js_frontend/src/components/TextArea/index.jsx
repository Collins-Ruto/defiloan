import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[15px]",
};
const variants = {
  tarFillGray100: "bg-gray-100",
};
const sizes = {
  xs: "h-[110px] p-5",
};

const TextArea = React.forwardRef(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      shape,
      size = "xs",
      variant = "tarFillGray100",
      onChange,
      ...restProps
    },
    ref,
  ) => {
    const handleChange = (e) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <textarea
        ref={ref}
        className={`${className} ${(shape && shapes[shape]) || ""} ${sizes[size] || ""} ${variants[variant] || ""}`}
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        {...restProps}
      />
    );
  },
);

TextArea.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["xs"]),
  variant: PropTypes.oneOf(["tarFillGray100"]),
};

export { TextArea };
