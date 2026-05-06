import { useState, useEffect } from 'react';
import {
  Box, Drawer, Typography, Accordion, AccordionSummary,
  AccordionDetails, Checkbox, FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PhoneIcon from '@mui/icons-material/Phone';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { kit } from '../theme';
import type { ActiveFilter } from './FilterBar';

// ── Filter groups definition ──────────────────────────────────
const GROUPS = [
  {
    key:     'Assignee',
    label:   'Исполнитель',
    icon:    <PersonOutlinedIcon sx={{ fontSize: 15 }} />,
    options: [
      { value: 'Мария Ананьева',   color: '#7C5CBF', bg: '#f3effc' },
      { value: 'Иван Иванов',      color: '#3B82F6', bg: '#eff6ff' },
      { value: 'Елена Ковалёва',   color: '#22C55E', bg: '#f0fdf4' },
      { value: 'Айша Белова',      color: '#14B8A6', bg: '#f0fdfa' },
      { value: 'Дмитрий Орлов',    color: '#EC4899', bg: '#fdf2f8' },
      { value: 'Ольга Дмитриева',  color: '#F59E0B', bg: '#fffbeb' },
    ],
  },
  {
    key:     'Team',
    label:   'Команда',
    icon:    <GroupsOutlinedIcon sx={{ fontSize: 15 }} />,
    options: [
      { value: 'Support 1', color: '#845cdd', bg: '#f3effc' },
      { value: 'Support 2', color: '#039855', bg: '#eefbf1' },
    ],
  },
  {
    key:     'Type',
    label:   'Тип',
    icon:    <LayersOutlinedIcon sx={{ fontSize: 15 }} />,
    options: [
      { value: 'Problem',   color: '#b91e5a', bg: '#f8e9ef' },
      { value: 'Complaint', color: '#f79009', bg: '#fffaef' },
      { value: 'Request',   color: '#845cdd', bg: '#f3effc' },
      { value: 'Appeal',    color: '#039855', bg: '#eefbf1' },
    ],
  },
  {
    key:     'Status',
    label:   'Статус',
    icon:    <ShowChartIcon sx={{ fontSize: 15 }} />,
    options: [
      { value: 'In progress', color: '#039855', bg: '#eefbf1' },
      { value: 'Assigned',    color: '#845cdd', bg: '#f3effc' },
      { value: 'Overdue',     color: '#b91e5a', bg: '#f8e9ef' },
      { value: 'New',         color: '#575859', bg: '#f3f4f5' },
      { value: 'Closed',      color: '#8c8c8c', bg: '#f3f4f5' },
    ],
  },
  {
    key:     'Channel',
    label:   'Канал',
    icon:    <PhoneIcon sx={{ fontSize: 15 }} />,
    options: [
      { value: 'Phone', color: '#845cdd', bg: '#f3effc' },
      { value: 'Email', color: '#845cdd', bg: '#f3effc' },
      { value: 'Chat',  color: '#845cdd', bg: '#f3effc' },
    ],
  },
  {
    key:     'Priority',
    label:   'Приоритет',
    icon:    <FlagOutlinedIcon sx={{ fontSize: 15 }} />,
    options: [
      { value: 'High',   color: '#b91e5a', bg: '#f8e9ef' },
      { value: 'Medium', color: '#f79009', bg: '#fffaef' },
      { value: 'Low',    color: '#575859', bg: '#f3f4f5' },
    ],
  },
] as const;

// ── Props ─────────────────────────────────────────────────────
interface Props {
  open: boolean;
  appliedFilters: ActiveFilter[];
  onClose: () => void;
  onApply: (filters: ActiveFilter[]) => void;
  onReset: () => void;
}

export default function FiltersPanel({ open, appliedFilters, onClose, onApply, onReset }: Props) {
  // Draft — local state while panel is open
  const [draft, setDraft] = useState<ActiveFilter[]>([]);
  // Which accordions are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Assignee: true, Team: true, Type: false, Status: false, Channel: false, Priority: false,
  });

  // Sync draft from applied filters when panel opens
  useEffect(() => {
    if (open) setDraft(appliedFilters);
  }, [open, appliedFilters]);

  const isChecked = (key: string, value: string) =>
    draft.some((f) => f.key === key && f.value === value);

  const toggle = (key: string, value: string) => {
    setDraft((prev) => {
      const exists = prev.some((f) => f.key === key && f.value === value);
      if (exists) return prev.filter((f) => !(f.key === key && f.value === value));
      return [...prev, { key, label: key, value }];
    });
  };

  const hasChanged =
    draft.length !== appliedFilters.length ||
    draft.some((d) => !appliedFilters.some((a) => a.key === d.key && a.value === d.value));
  const canReset = draft.length > 0 || appliedFilters.length > 0;

  const handleApply = () => { onApply(draft); onClose(); };
  const handleReset = () => { setDraft([]); onReset(); };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: 320,
          border: 'none',
          borderLeft: `1px solid ${kit.gray4}`,
          boxShadow: '0px 8px 24px -4px rgb(16 24 40 / 12%)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
      sx={{ '& .MuiBackdrop-root': { bgcolor: 'rgba(0,0,0,0.15)' } }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 1.5,
          borderBottom: `1px solid ${kit.gray4}`,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: kit.gray10 }}>
          Фильтры
        </Typography>
        <Box
          onClick={onClose}
          sx={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '8px', cursor: 'pointer', color: kit.gray7,
            '&:hover': { bgcolor: kit.gray3, color: kit.gray10 },
            transition: 'all 0.15s',
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      {/* ── Scrollable content ── */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>


        {/* Accordion sections */}
        {GROUPS.map((group) => {
          const selectedCount = draft.filter((d) => d.key === group.key).length;
          return (
            <Accordion
              key={group.key}
              expanded={expanded[group.key] ?? false}
              onChange={() => setExpanded((prev) => ({ ...prev, [group.key]: !prev[group.key] }))}
              disableGutters
              elevation={0}
              sx={{
                '&:before': { display: 'none' },
                borderBottom: `1px solid ${kit.gray4}`,
                '&.MuiAccordion-root': { borderRadius: 0, bgcolor: 'transparent' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: kit.gray7 }} />}
                sx={{
                  px: 2.5, minHeight: 48,
                  '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', gap: 1, my: 0 },
                  '&:hover': { bgcolor: kit.gray3 },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', color: kit.gray7, flexShrink: 0 }}>
                  {group.icon}
                </Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: kit.gray10, flexGrow: 1 }}>
                  {group.label}
                </Typography>
                {selectedCount > 0 && (
                  <Box
                    sx={{
                      minWidth: 20, height: 20, px: 0.5, borderRadius: '6px',
                      bgcolor: kit.purple6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                      {selectedCount}
                    </Typography>
                  </Box>
                )}
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 1.5 }}>
                {group.options.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    control={
                      <Checkbox
                        checked={isChecked(group.key, opt.value)}
                        onChange={() => toggle(group.key, opt.value)}
                        size="small"
                        sx={{
                          p: '5px',
                          color: kit.gray5,
                          '&.Mui-checked': { color: kit.purple6 },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 8, height: 8, borderRadius: '50%',
                            bgcolor: opt.color, flexShrink: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: '0.875rem', color: kit.gray10 }}>
                          {opt.value}
                        </Typography>
                      </Box>
                    }
                    sx={{ mx: 0, width: '100%', '& .MuiFormControlLabel-label': { flexGrow: 1 } }}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* ── Footer ── */}
      {(hasChanged || canReset) && (
        <Box
          sx={{
            flexShrink: 0, px: 2.5, py: 2,
            borderTop: `1px solid ${kit.gray4}`,
            display: 'flex', gap: 1.5,
          }}
        >
          <Box
            onClick={canReset ? handleReset : undefined}
            sx={{
              flex: 1, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '16px', border: `1px solid ${kit.gray4}`,
              cursor: canReset ? 'pointer' : 'default',
              color: canReset ? kit.gray9 : kit.gray6,
              fontSize: '0.875rem', fontWeight: 400,
              '&:hover': canReset ? { bgcolor: kit.gray3, borderColor: kit.gray5 } : {},
              transition: 'all 0.15s',
            }}
          >
            Сбросить
          </Box>
          <Box
            onClick={hasChanged ? handleApply : undefined}
            sx={{
              flex: 1, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '16px',
              bgcolor: hasChanged ? kit.purple6 : kit.gray4,
              color: hasChanged ? '#fff' : kit.gray6,
              cursor: hasChanged ? 'pointer' : 'default',
              fontSize: '0.875rem', fontWeight: 600,
              '&:hover': hasChanged ? { bgcolor: kit.purple7 } : {},
              transition: 'all 0.15s',
            }}
          >
            Применить
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
