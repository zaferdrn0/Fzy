import React, { useState } from "react";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { MenuItem } from "@/navbar/navbarMenu";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  menuItems: MenuItem[];
}

const drawerWidth = 240;
const miniDrawerWidth = 50;

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [drawerOpen, setDrawerOpen] = useState(isMdUp);

  const { currentUser } = useAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        justifyContent: "space-between",
      }}
    >
      <Box>
        {/* Logo Bölümü */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: drawerOpen ? "space-between" : "center",
            borderBottom: 1,
            borderColor: "divider",
            position: "relative",
          }}
        >
          {drawerOpen ? (
            <>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                  }}
                >
                  L
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  Logo
                </Typography>
              </Stack>
              {/* Kapatma Butonu */}
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <Icon icon="mdi:close" />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={handleDrawerToggle}>
              <Icon icon="mdi:menu" />
            </IconButton>
          )}
        </Box>

        {/* Navigation List */}
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                sx={{
                  justifyContent: drawerOpen ? "flex-start" : "center",
                  px: 2,
                }}
                onClick={() => {
                  router.push(item.pathname);
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                >
                  <Icon icon={item.icon} width={24} height={24} />
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText
                    primary={item.title}
                    sx={{ ml: 2, whiteSpace: "nowrap" }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Kullanıcı Profili Bölümü */}
      <Divider sx={{ borderStyle: "dashed" }} />
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "primary.lighter",
          },
          borderRadius: 1,
        }}
      >
        {drawerOpen ? (
          <Stack spacing={0.5} direction="row" alignItems="center">
            <Avatar
              sx={{
                width: 40,
                height: 40,
              }}
              alt="User Name"
              src="/path-to-avatar.jpg"
            />
            {currentUser !== "loading" && (
              <Typography
                variant="subtitle2"
                noWrap
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                {currentUser?.firstName} {currentUser?.lastName}
              </Typography>
            )}
          </Stack>
        ) : (
          <Avatar
            sx={{
              width: 40,
              height: 40,
            }}
            alt="User Name"
            src="/path-to-avatar.jpg"
          />
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Drawer */}
      <Drawer
        variant={isMdUp ? "persistent" : "temporary"}
        open={drawerOpen || isMdUp}
        PaperProps={{
          sx: {
            width: isMdUp && !drawerOpen ? miniDrawerWidth : drawerWidth,
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Küçük ekran için hamburger buton */}
      {!isMdUp && !drawerOpen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Icon icon="mdi:menu" />
        </IconButton>
      )}

      {/* İçerik alanını yana iten boşluk */}
      {isMdUp && (
        <Box
          sx={{
            marginLeft: isMdUp && !drawerOpen
              ? `${miniDrawerWidth}px`
              : `${drawerWidth}px`,
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
