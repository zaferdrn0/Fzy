import { MenuItem } from "@/navbar/navbarMenu";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MuiMenuItem,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(isMdUp);
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const { currentUser } = useAuth();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const customSidebar = {
    transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  useEffect(() => {
    if (isMdUp && !open) {
      setOpen(true);
    }
  }, [isMdUp]);

  const handleDrawerToggle = () => {
    if (isMdUp) {
      setOpen(!open);
    }
  };

  const handleSubMenuToggle = (title: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100vh", // Burada height değerini güncelledik
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {open && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
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
              sx={{
                color: "text.primary",
                fontWeight: 600,
              }}
            >
              Logo
            </Typography>
          </Box>
        )}
        {isMdUp && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: "text.primary" }}>
            {open ? (
              <Icon icon="mdi:chevron-left" width={24} height={24} />
            ) : (
              <Icon icon="mdi:menu" width={24} height={24} />
            )}
          </IconButton>
        )}
      </Box>

      {/* Navigation List */}
      <List
        sx={{
          flex: 1,
          px: 2,
          py: 1,
          overflow: "auto",
        }}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.secondaryTitle && open && (
              <Typography
                variant="overline"
                sx={{
                  px: 3,
                  mt: 2,
                  mb: 1,
                  display: "block",
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                {item.secondaryTitle}
              </Typography>
            )}
            <ListItem
              disablePadding
              sx={{
                mb: 0.5,
                display: "block",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Tooltip
                title={!open && isMdUp ? item.title : ""}
                placement="right"
                arrow
                disableHoverListener={!isMdUp}
              >
                <ListItemButton
                  onClick={() => {
                    if (item.children) {
                      handleSubMenuToggle(item.title);
                    } else {
                      router.push(item.pathname);
                    }
                  }}
                  selected={router.pathname === item.pathname}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    justifyContent: open ? "initial" : "center",
                    borderRadius: 1,
                    width: '100%',
                    overflow: 'hidden',
                    "&:hover": {
                      bgcolor: "primary.lighter",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                      justifyContent: "center",
                      color:
                        router.pathname === item.pathname
                          ? "primary.main"
                          : "text.primary",
                    }}
                  >
                    <Icon icon={item.icon} width={24} height={24} />
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight:
                            router.pathname === item.pathname ? 600 : 500,
                          color:
                            router.pathname === item.pathname
                              ? "primary.main"
                              : "text.primary",
                        },
                      }}
                    />
                  )}
                  {item.children && open && (
                    <Box component="span" sx={{ ml: "auto" }}>
                      {openSubMenus[item.title] ? (
                        <Icon
                          icon="mdi:chevron-up"
                          width={24}
                          height={24}
                          style={{
                            color:
                              router.pathname === item.pathname
                                ? "primary.main"
                                : "text.primary",
                          }}
                        />
                      ) : (
                        <Icon
                          icon="mdi:chevron-down"
                          width={24}
                          height={24}
                          style={{
                            color:
                              router.pathname === item.pathname
                                ? "primary.main"
                                : "text.primary",
                          }}
                        />
                      )}
                    </Box>
                  )}
                </ListItemButton>
              </Tooltip>

              {/* Submenu Items */}
              {item.children && (
                <Collapse
                  in={open && openSubMenus[item.title]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => (
                      <ListItemButton
                        key={childIndex}
                        onClick={() => router.push(child.pathname)}
                        selected={router.pathname === child.pathname}
                        sx={{
                          height: 40,
                          pl: open ? 4 : 2.5,
                          py: 0.5,
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor: "primary.lighter",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 2 : 0,
                            justifyContent: "center",
                            color:
                              router.pathname === child.pathname
                                ? "primary.main"
                                : "text.secondary",
                          }}
                        >
                          <Icon icon={child.icon} width={20} height={20} />
                        </ListItemIcon>
                        {open && (
                          <ListItemText
                            primary={child.title}
                            sx={{
                              "& .MuiTypography-root": {
                                fontSize: "0.875rem",
                                fontWeight:
                                  router.pathname === child.pathname ? 600 : 500,
                                color:
                                  router.pathname === child.pathname
                                    ? "primary.main"
                                    : "text.secondary",
                              },
                            }}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {/* User Profile Section */}
      <Divider sx={{ borderStyle: "dashed" }} />
      <Box
        sx={{
          pt: 2,
          pl:1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          cursor: "pointer",
          "&:hover": {
            bgcolor: "primary.lighter",
          },
          borderRadius: 1,
          mx: 2,
          mb: 2,
        }}
        onClick={handleProfileClick}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
          }}
          alt="User Name"
          src="/path-to-avatar.jpg"
        />
        {open && currentUser !==null &&currentUser !== "loading" && (
          <Stack spacing={0.5}>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {currentUser.firstName} {currentUser.lastName}
            </Typography>
            <Typography
              variant="body2"
              noWrap
              sx={{ color: "text.secondary" }}
            >
              {currentUser.email}
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MuiMenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Icon icon="mdi:account-cog-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Ayarlar" />
        </MuiMenuItem>
        <MuiMenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Icon icon="mdi:logout" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Çıkış Yap" />
        </MuiMenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box
      component="nav"
      onMouseEnter={() => {
        if (!isMdUp) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!isMdUp) setOpen(false);
      }}
      sx={{
        flexShrink: 0,
        
        transition: customSidebar.transition,
        position: isMdUp ? 'relative' : !isMdUp && open ? 'absolute' : 'relative', 
        zIndex: !isMdUp && open ? theme.zIndex.drawer + 1 : 'auto',
        height: '100vh', 
        top: 0,
        left: 0,
      }}
    >
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
          
            transition: customSidebar.transition,
            bgcolor: "background.paper",
            borderRight: "1px dashed",
            borderColor: "divider",
            overflowX: "hidden",
            position: isMdUp ? 'relative' : !isMdUp && open ? 'absolute' : 'relative', 
            zIndex: !isMdUp && open ? theme.zIndex.drawer + 1 : 'auto',
            height: '100vh', 
            top: 0,
            left: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
