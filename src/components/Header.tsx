import { useState } from 'react';
import {
  AppBar, Toolbar, Box, IconButton, Badge, Avatar, Typography,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import BarChartIcon from '@mui/icons-material/BarChart';
import { kit } from '../theme';

const NAV_ITEMS = [
  { label: 'Заявки',      ActiveIcon: ConfirmationNumberIcon,         InactiveIcon: ConfirmationNumberOutlinedIcon },
  { label: 'Справочники', ActiveIcon: FolderIcon,                     InactiveIcon: FolderOpenIcon                 },
  { label: 'Отчёты',      ActiveIcon: BarChartIcon,                   InactiveIcon: BarChartIcon                   },
];

export default function Header() {
  const [tab, setTab] = useState(0);

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 1.5, minHeight: 56, px: { xs: 2, sm: 3 } }}>

        {/* Logo */}
        <Box
          sx={{
            width: 36, height: 36, borderRadius: '10px',
            bgcolor: kit.purple6, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1 }}>
            SD
          </Typography>
        </Box>

        {/* M3 Navigation tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1, ml: 1 }}>
          {NAV_ITEMS.map(({ label, ActiveIcon, InactiveIcon }, i) => {
            const active = tab === i;
            return (
              <Box
                key={label}
                onClick={() => setTab(i)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: active ? 2 : 1.25,
                  height: 36,
                  borderRadius: '18px',
                  bgcolor: active ? kit.purple1 : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s, padding 0.2s',
                  userSelect: 'none',
                  '&:hover': {
                    bgcolor: active ? kit.purple2 : kit.gray3,
                  },
                }}
              >
                {/* Active: filled icon; Inactive: outlined icon in circle container */}
                {active ? (
                  <ActiveIcon sx={{ fontSize: 20, color: kit.purple8 }} />
                ) : (
                  <Box
                    sx={{
                      width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%',
                      border: `1.5px solid ${kit.gray5}`,
                    }}
                  >
                    <InactiveIcon sx={{ fontSize: 16, color: kit.gray7 }} />
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: active ? 500 : 400,
                    color: active ? kit.purple8 : kit.gray7,
                    lineHeight: 1,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Create ticket — waltech split-pill */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', bgcolor: kit.purple2, borderRadius: '50px', p: '3px' }}>
          <Box
            role="button"
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 2, height: 34,
              bgcolor: kit.purple2, color: kit.purple8,
              borderRadius: '50px',
              cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.9375rem', fontWeight: 400,
              transition: 'background 0.2s',
              '&:hover': { bgcolor: kit.purple3 },
            }}
          >
            <AddIcon sx={{ fontSize: 18, color: kit.purple8 }} />
            Создать обращение
          </Box>
          <Box
            sx={{
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: kit.purple2, color: kit.purple8,
              borderRadius: '50%', cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': { bgcolor: kit.purple3 },
            }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        {/* Notifications */}
        <IconButton size="small" sx={{ color: kit.gray7 }}>
          <Badge
            badgeContent={3}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: kit.red6, color: '#fff',
                minWidth: 16, height: 16, fontSize: '0.6rem',
              },
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        {/* User avatar */}
        <Avatar
          sx={{
            width: 34, height: 34,
            bgcolor: kit.purple6, color: '#fff',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          MA
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
