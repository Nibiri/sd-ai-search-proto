import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  InputBase,
  Typography,
  Chip,
  Button,
  IconButton,
  Fade,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LayersIcon from '@mui/icons-material/Layers';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

interface RecognizedFilter {
  type: 'Type' | 'Status' | 'Assignee';
  value: string;
  color: string;
  bg: string;
  icon: React.ReactElement;
}

const FILTER_ICON_SX = { fontSize: 14 };

function parseFilters(query: string): RecognizedFilter[] {
  const q = query.toLowerCase();
  const filters: RecognizedFilter[] = [];

  if (
    q.includes('request') ||
    q.includes('service') ||
    q.includes('ticket')
  ) {
    filters.push({
      type: 'Type',
      value: 'Request, Service request',
      color: '#059669',
      bg: '#ECFDF5',
      icon: <LayersIcon sx={{ ...FILTER_ICON_SX, color: '#059669' }} />,
    });
  }

  if (
    q.includes('in progress') ||
    q.includes('progress') ||
    q.includes('assigned') ||
    q.includes('open')
  ) {
    filters.push({
      type: 'Status',
      value: 'In progress, Elma processing +10',
      color: '#2563EB',
      bg: '#EFF6FF',
      icon: <ShowChartIcon sx={{ ...FILTER_ICON_SX, color: '#2563EB' }} />,
    });
  }

  if (
    q.includes('me') ||
    q.includes('my') ||
    q.includes('assigned to me') ||
    q.includes('maapaneva')
  ) {
    filters.push({
      type: 'Assignee',
      value: 'maapaneva',
      color: '#7C5CBF',
      bg: '#F5F0FF',
      icon: <PersonOutlinedIcon sx={{ ...FILTER_ICON_SX, color: '#7C5CBF' }} />,
    });
  }

  if (q.includes('overdue')) {
    filters.push({
      type: 'Status',
      value: 'Overdue',
      color: '#D97706',
      bg: '#FFFBEB',
      icon: <ShowChartIcon sx={{ ...FILTER_ICON_SX, color: '#D97706' }} />,
    });
  }

  if (q.includes('pbx') || q.includes('phone')) {
    filters.push({
      type: 'Type',
      value: 'PBX channel',
      color: '#059669',
      bg: '#ECFDF5',
      icon: <LayersIcon sx={{ ...FILTER_ICON_SX, color: '#059669' }} />,
    });
  }

  return filters;
}

const RECENT = ['tickets assigned to me', 'April PBX tickets'];
const QUICK_PROMPTS = [
  { label: 'Assigned to me', icon: <PersonOutlinedIcon sx={{ fontSize: 13 }} /> },
  { label: 'Past 7 days', icon: <AccessTimeIcon sx={{ fontSize: 13 }} /> },
  { label: 'PBX channel', icon: <LayersIcon sx={{ fontSize: 13 }} /> },
  { label: 'Overdue', icon: <AccessTimeIcon sx={{ fontSize: 13 }} /> },
  { label: 'In progress today', icon: <ShowChartIcon sx={{ fontSize: 13 }} /> },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onApply: (filters: RecognizedFilter[]) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export default function AISearchModal({ open, onClose, onApply, anchorRef }: Props) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState<RecognizedFilter[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSubmitted(false);
      setFilters([]);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    const recognized = parseFilters(query);
    setFilters(recognized);
    setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  const removeFilter = (idx: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuickPrompt = (label: string) => {
    setQuery(label.toLowerCase());
    const recognized = parseFilters(label.toLowerCase());
    setFilters(recognized);
    setSubmitted(true);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1200,
          bgcolor: 'rgba(0,0,0,0.08)',
        }}
      />
      <Fade in={open}>
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            top: anchorRef.current
              ? anchorRef.current.getBoundingClientRect().bottom + 8
              : 72,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 'calc(100vw - 32px)', sm: 560 },
            borderRadius: '16px',
            zIndex: 1300,
            overflow: 'hidden',
            p: 0,
          }}
        >
          {/* Search input row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.25,
              gap: 1,
              borderBottom: submitted ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, flexShrink: 0 }} />

            {/* AI badge */}
            <Chip
              label="✦ AI"
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 24,
                borderRadius: '20px',
                flexShrink: 0,
                '& .MuiChip-label': { px: '8px' },
              }}
            />

            <InputBase
              inputRef={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask AI — e.g. "my in-progress for the past week"'
              sx={{ flexGrow: 1, fontSize: '0.9rem', color: 'text.primary' }}
            />

            <IconButton
              size="small"
              onClick={handleSubmit}
              sx={{
                bgcolor: query ? 'primary.main' : 'grey.200',
                color: query ? '#fff' : 'text.disabled',
                width: 34,
                height: 34,
                flexShrink: 0,
                '&:hover': { bgcolor: query ? 'primary.dark' : 'grey.300' },
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* Body */}
          {!submitted ? (
            <Box sx={{ px: 2.5, py: 2 }}>
              {/* Recent */}
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                RECENT
              </Typography>
              <Box sx={{ mt: 0.75, mb: 2 }}>
                {RECENT.map((r) => (
                  <Box
                    key={r}
                    onClick={() => handleQuickPrompt(r)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 0.6,
                      cursor: 'pointer',
                      borderRadius: 1,
                      px: 1,
                      mx: -1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {r}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Quick prompts */}
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                QUICK PROMPTS
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {QUICK_PROMPTS.map((p) => (
                  <Chip
                    key={p.label}
                    icon={p.icon}
                    label={p.label}
                    size="small"
                    onClick={() => handleQuickPrompt(p.label)}
                    sx={{
                      bgcolor: '#F3F4F6',
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: '0.78rem',
                      height: 28,
                      cursor: 'pointer',
                      '& .MuiChip-icon': { color: 'text.secondary' },
                      '&:hover': { bgcolor: '#E5E7EB' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ px: 2.5, py: 2 }}>
              {/* Recognized filters header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', letterSpacing: '0.05em' }}
                >
                  RECOGNIZED FILTERS
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.4,
                    cursor: 'pointer',
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                  onClick={() => setSubmitted(false)}
                >
                  <RefreshIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.78rem', fontWeight: 500 }}>
                    Edit
                  </Typography>
                </Box>
              </Box>

              {/* Filter chips */}
              {filters.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1.5 }}>
                  No filters recognized. Try a different query.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {filters.map((f, i) => (
                    <Chip
                      key={i}
                      icon={f.icon}
                      label={
                        <Box component="span">
                          <Box
                            component="span"
                            sx={{ color: 'text.secondary', mr: 0.5, fontSize: '0.75rem' }}
                          >
                            {f.type}
                          </Box>
                          <Box component="span" sx={{ fontWeight: 700, fontSize: '0.8rem', color: f.color }}>
                            {f.value}
                          </Box>
                        </Box>
                      }
                      onDelete={() => removeFilter(i)}
                      deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                      sx={{
                        bgcolor: f.bg,
                        height: 30,
                        border: `1px solid ${f.color}22`,
                        '& .MuiChip-icon': { ml: '8px' },
                        '& .MuiChip-deleteIcon': { color: f.color, opacity: 0.7 },
                        '& .MuiChip-label': { display: 'flex', alignItems: 'center' },
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Count + actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  Approximately{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {filters.length > 0 ? 33 : 0}
                  </Box>{' '}
                  tickets found
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={onClose}
                    sx={{
                      color: 'text.secondary',
                      borderColor: 'divider',
                      '&:hover': { borderColor: 'text.secondary' },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    onClick={handleApply}
                    disabled={filters.length === 0}
                    sx={{ bgcolor: 'primary.main', color: '#fff' }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Fade>
    </>
  );
}
