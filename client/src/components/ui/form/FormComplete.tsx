import React, {FC, ReactElement} from "react";
import { Controller, Control, Path, FieldValues, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete, {AutocompleteProps} from "@mui/material/Autocomplete";
import { Input } from "./Input";
import { IComplete } from "src/utils/types/types";

type IProps<T> = {
  name: string,
  label: string,
  options: IComplete<T>[]
} & Omit<AutocompleteProps<any, boolean, boolean, boolean>, "renderInput" | "options">

export const FormComplete = <T,>({name, label, ...props}: IProps<T>): ReactElement<any, any> | null => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <Autocomplete
            value={value || (props.multiple ? [] : null)}
            fullWidth
            onChange={(event: any, newValue) => {
              onChange(newValue ?? null);
            }}
            {...props}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            getOptionLabel={option => option.label}
            renderInput={(params) => (
              <Input
                noRegister
                {...params}
                name={name}
                label={label}
                inputRef={ref}
              />
            )}
          />
        );
      }}
    />
  );
};
