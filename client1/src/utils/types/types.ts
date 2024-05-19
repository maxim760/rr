import React, { PropsWithChildren } from "react";

export type FCWithChildren<T = unknown> = React.FC<PropsWithChildren<T>>

export type DialogProps = { onClose: () => void, open: boolean }

export type IComplete<TId = string, TLabel = string> = {id: TId, label: TLabel}