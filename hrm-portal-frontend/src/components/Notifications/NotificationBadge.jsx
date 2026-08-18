import {
  Badge
} from "@mui/material";


const NotificationBadge = ({
  count = 0,
  children
}) => {

  const safeCount =
    Math.max(
      0,
      Number(count) || 0
    );


  return (
    <Badge
      badgeContent={
        safeCount > 99
          ? "99+"
          : safeCount
      }
      color="error"
      invisible={
        safeCount === 0
      }
      sx={{
        "& .MuiBadge-badge": {
          fontWeight: 900,
          minWidth: 18,
          height: 18,
          fontSize: 10
        }
      }}
    >
      {children}
    </Badge>
  );
};


export default NotificationBadge;