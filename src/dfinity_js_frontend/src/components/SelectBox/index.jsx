import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[15px]",
};
const variants = {
  fill: {
    gray_200: "bg-gray-200 shadow-sm text-gray-900_01",
    gray_100: "bg-gray-100 text-gray-900_01",
  },
};
const sizes = {
  sm: "h-[55px] pl-[26px] pr-[35px] text-lg",
  xs: "h-[35px] pl-3 pr-[35px] text-sm",
};

const SelectBox = React.forwardRef(
  (
    {
      children,
      className = "",
      options = [],
      isSearchable = false,
      isMulti = false,
      indicator,
      shape,
      variant = "fill",
      size = "xs",
      color = "gray_100",
      ...restProps
    },
    ref,
  ) => {
    return (
      <>
        <Select
          ref={ref}
          options={options}
          className={`${className} flex ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
          isSearchable={isSearchable}
          isMulti={isMulti}
          components={{
            IndicatorSeparator: () => null,
            ...(indicator && { DropdownIndicator: () => indicator }),
          }}
          styles={{
            container: (provided) => ({
              ...provided,
              zIndex: 0,
            }),
            control: (provided) => ({
              ...provided,
              backgroundColor: "transparent",
              border: "0 !important",
              boxShadow: "0 !important",
              minHeight: "auto",
              width: "100%",
              "&:hover": {
                border: "0 !important",
              },
            }),
            input: (provided) => ({
              ...provided,
              color: "inherit",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? "#ffffff" : "transparent",
              color: state.isSelected ? "#171a1f" : "inherit",
              "&:hover": {
                backgroundColor: "#ffffff",
                color: "#171a1f",
              },
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: 0,
            }),
            placeholder: (provided) => ({
              ...provided,
              margin: 0,
            }),
            menuPortal: (base) => ({ ...base, zIndex: 999999 }),
          }}
          menuPortalTarget={document.body}
          closeMenuOnScroll={(event) => {
            return event.target.id === "scrollContainer";
          }}
          {...restProps}
        />
        {children}
      </>
    );
  },
);

SelectBox.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  isSearchable: PropTypes.bool,
  isMulti: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  indicator: PropTypes.node,
  shape: PropTypes.oneOf(["round"]),
  size: PropTypes.oneOf(["sm", "xs"]),
  variant: PropTypes.oneOf(["fill"]),
  color: PropTypes.oneOf(["gray_200", "gray_100"]),
};

export { SelectBox };
