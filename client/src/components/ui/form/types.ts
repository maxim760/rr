import { TextFieldProps } from "@mui/material/TextField";

export type InputProps = TextFieldProps & {name: string, noRegister?: boolean}