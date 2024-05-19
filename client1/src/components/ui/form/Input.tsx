import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { forwardRef, FC } from "react";
import { useFormContext } from "react-hook-form";
import { InputProps } from "./types";

export const Input: FC<InputProps> = ({name, noRegister, ...props}) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]
  const message = error?.message?.toString() || ""
  return (
    <TextField
      {...props}
      {...(noRegister ? {} : register(name))}
      onChange={(e) => {
        props?.onChange?.(e)
      }}
      error={!!error}
      helperText={message}
      variant="standard"
    />
  );
};