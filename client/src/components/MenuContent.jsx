import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { checkUserRole } from '../services/authService';
import { useAuth } from '../context/AuthContext';
const mainListItems = [
  { text: 'Dashbord', icon: <HomeRoundedIcon />, link: '/dashboard' },
  { text: 'Monthly Budget', icon: <AssignmentRoundedIcon />, link: '/budget' },
  { text: 'Income / Expense', icon: <AnalyticsRoundedIcon />, link: '/transaction' },
  { text: 'Categories', icon: <PeopleRoundedIcon />, link: '/categories' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, link: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, link: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, link: '/feedback' },
];

export default function MenuContent({ selected = 0 }) {
  const navigate = useNavigate();
  const { handleToast, user } = useAuth();
  const handleClick = async (link) => {
    if (link) navigate(link);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => {

          const isBudget = item.link === '/budget';
          const isDisabled = isBudget && user?.role !== 1;
          return (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={index === selected}
                onClick={() => handleClick(item.link)}
                sx={{
                  opacity: isDisabled ? 0.5 : 1,
                  pointerEvents: isDisabled ? 'auto' : 'auto',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <ListItemIcon sx={{ color: isDisabled ? 'text.disabled' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}

                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleClick(item.link)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
