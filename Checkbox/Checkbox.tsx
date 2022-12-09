import type { InputHTMLAttributes } from "react";

import styles from "./checkbox.module.scss";

interface CheckboxProps {
  checked?: InputHTMLAttributes<HTMLInputElement>["checked"];
  disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const Checkbox = ({ checked, disabled, onChange, label }: CheckboxProps) => {
  return (
    <label
      className={`${styles.checkbox} ${disabled ? styles.unavailable : ""} ${
        checked ? styles.selected : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e)}
        disabled={disabled}
      />
      <span />
      {label}
    </label>
  );
};

export default Checkbox;
