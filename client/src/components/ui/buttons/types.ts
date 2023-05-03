import {LoadingButtonProps} from "@mui/lab/LoadingButton";
import {SystemStyleObject} from "@mui/system";
import {Theme} from "@mui/material/styles"
export type AppButtonProps = LoadingButtonProps & {sx?: SystemStyleObject<Theme>, noMargin?: boolean}