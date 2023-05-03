import React, {FC} from "react";
import { AppButton } from "./AppButton";
import { FCWithChildren } from "src/utils/types/types";
import { AppButtonProps } from "./types";


export const CloseButton: FC<AppButtonProps> = ({children = "Закрыть", ...props}) => {
  return (
    <AppButton {...props} variant="outlined" color="error" type="button">
      {children}
    </AppButton>
  );
};