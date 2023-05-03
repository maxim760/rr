import React, {FC} from "react";
import { AppButton } from "./AppButton";
import { AppButtonProps } from "./types";

export const SaveButton: FC<AppButtonProps> = (props) => {
  return (
    <AppButton {...props}>
      Сохранить
    </AppButton>
  );
};