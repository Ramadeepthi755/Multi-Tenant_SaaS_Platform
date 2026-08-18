import {
  Box
} from "@mui/material";


import PictureAsPdfOutlinedIcon
  from "@mui/icons-material/PictureAsPdfOutlined";


import ImageOutlinedIcon
  from "@mui/icons-material/ImageOutlined";


import DescriptionOutlinedIcon
  from "@mui/icons-material/DescriptionOutlined";


import TableChartOutlinedIcon
  from "@mui/icons-material/TableChartOutlined";


import InsertDriveFileOutlinedIcon
  from "@mui/icons-material/InsertDriveFileOutlined";


import {
  getFileExtension
} from "../../utils/documentUtils";


const DocumentFileIcon = ({
  fileName = "",
  size = 42
}) => {

  const extension =
    getFileExtension(
      fileName
    );


  let icon;


  if (
    extension === ".pdf"
  ) {

    icon = (
      <PictureAsPdfOutlinedIcon />
    );

  } else if (
    [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp"
    ].includes(
      extension
    )
  ) {

    icon = (
      <ImageOutlinedIcon />
    );

  } else if (
    [
      ".xls",
      ".xlsx"
    ].includes(
      extension
    )
  ) {

    icon = (
      <TableChartOutlinedIcon />
    );

  } else if (
    [
      ".doc",
      ".docx",
      ".txt"
    ].includes(
      extension
    )
  ) {

    icon = (
      <DescriptionOutlinedIcon />
    );

  } else {

    icon = (
      <InsertDriveFileOutlinedIcon />
    );

  }


  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "action.hover",
        color: "primary.main",
        flexShrink: 0
      }}
    >
      {icon}
    </Box>
  );
};


export default DocumentFileIcon;