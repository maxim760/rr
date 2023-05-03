import { Box, Paper, PaperProps, Typography } from '@mui/material'
import { group } from 'console'
import React, {FC} from 'react'

export type IGroup = {
  id: string,
  title?: string,
  items: { label: string, value: string | number }[],
}


const ImgRatios = {
  "horizontal": 16 / 9,
  "vertical": 9 / 16,
  "equal": 1 / 1
}

type IProps = {
  title?: string,
  groups: IGroup[],
  message?: React.ReactNode,
  divider?: boolean,
  render?: "title" | "bottom",
  small?: boolean,
  subTitle?: boolean
  img?: {src: string, alt: string, type: keyof typeof ImgRatios}
}

export const PropertiesCard: FC<IProps & PaperProps> = ({title, subTitle, groups, divider, children, render = "bottom", message, small, img, ...paperProps}) => {
  return (
    <Paper sx={{p: small ? 1.25 : 2, display: "flex", flexDirection: "column", ...paperProps.sx}}>
      {title && <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5}}>
        <Typography fontSize={subTitle ? 16 : 24} fontWeight={700}>{title}</Typography>
        {render === "title" && children}
      </Box>}
      {img && (
        <Box sx={{
          mb: 1,
          "& img": {
            objectFit: "cover",
            width: "100%",
            height: "auto",
            aspectRatio: `${ImgRatios[img.type]}`
          }
        }}>
          <img src={img.src} alt={img.alt} width="100%"  />
        </Box>
      )}
      <Box sx={{mt: message ? "auto" : 0}}>
      {message}
      </Box>
      <Box sx={{mt: !message ? "auto" : 0}}>
        {groups.map((group, groupI, groupArr) => (
          <React.Fragment key={group.id}>
            {!!group.title && <Typography
              fontSize={16}
              fontWeight={700}
              sx={{ pb: small ? 0.5 : 1, pt: !title && !groupI ? 0 : small ? 1 : 2}}
            >{group.title}</Typography>}
            {group.items.map(({ label, value }, i, arr) => {
              const bigMarginTop = !group.title && i === 0
              return (
              <Box
                key={label}
                display="grid"
                className={bigMarginTop ? "property-offset" : ""}
                alignItems="stretch"
                sx={(theme) => ({
                  gridTemplateColumns: "1fr 1fr",
                  position: "relative",
                  ...(bigMarginTop ? { mt: "24px" } : {}),
                  "&::after": {
                    content: "''",
                    position: "absolute",
                    bottom: "-16px",
                    width: "100%",
                    height: "1px",
                    bgcolor: divider && (i === arr.length - 1) && (groupI !== groupArr.length - 1)
                      ? "#d0d0d0"
                      : "transparent"
                  },
                  [theme.breakpoints.down("md")]: {
                    gap: "8px",
                    padding: "9px 12px",
                    "&:nth-of-type(2n)": {
                      bgcolor: "#aaaaaa"
                    }
                  },
                  [theme.breakpoints.up("md")]: {
                    gap: "16px",
                    padding: 0,
                    "& + *:not(.property-offset)": {
                      mt: "8px"
                    },
                  },
                })}
              >
                <Typography sx={{fontSize: "20px", borderBottomStyle: "dashed", borderBottomWidth: { md: "1px" }, borderBottomColor: "primary.main",  color: "text.primary"}}>{label}</Typography>
                <Typography sx={{whiteSpace: "pre-wrap", wordBreak: "break-word", color: "primary.main"}}>{value}</Typography>
              </Box>
              )
            })}
          </React.Fragment>
        ))}
      </Box>
      {!Object.keys(groups).length && (
        <Typography sx={{mt: "12px", textAlign: "center"}} fontSize={18}>Список пуст</Typography>
      )}
      {!!children && render === "bottom" && (
        <Box sx={{mt: small ? 1 : 2, display: "flex", flexDirection: "column"}}>
          {children}
        </Box>
      )}
    </Paper>
  )
}