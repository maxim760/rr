import React, {FC} from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { AppButtonProps } from "./types";

export const AppButton: FC<AppButtonProps> = ({ children, disabled, noMargin, sx, loading = false, ...props }) => {

  return (
    <LoadingButton
      type="submit"
      variant="contained"
      color="primary"
      disabled={disabled || loading}
      sx={{ mt: noMargin ? 0 : 2, ...sx }}
      loading={loading}
      // LinkComponent={}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};