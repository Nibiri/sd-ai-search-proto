import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { kit } from '../theme';
import {
  Box,
  InputBase,
  Typography,
  Paper,
  Fade,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LayersIcon from '@mui/icons-material/Layers';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PhoneIcon from '@mui/icons-material/Phone';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import DateRangeIcon from '@mui/icons-material/DateRange';

type SearchMode = 'regular' | 'ai';

import type { BadgeColor } from '@logicbpm/logicbpm-ui-kit';

export interface RecognizedFilter {
  type: 'Type' | 'Status' | 'Assignee' | 'Channel' | 'Priority' | 'Period' | 'AIContext';
  value: string;
  color: string;
  bg: string;
  badgeColor: BadgeColor;
  icon: React.ReactElement;
  /** Human-readable label for AIContext chips (overrides type:value display) */
  contextLabel?: string;
}

// ── Russian labels for display ────────────────────────────────
export const TYPE_LABELS: Record<string, string> = {
  Type: 'Тип', Status: 'Статус', Assignee: 'Исполнитель',
  Channel: 'Канал', Priority: 'Приоритет', Period: 'Период',
};

export const VALUE_LABELS: Record<string, string> = {
  Problem: 'Проблема', Complaint: 'Жалоба', Request: 'Запрос', Appeal: 'Обращение',
  'In progress': 'В работе', Overdue: 'Просрочено', Assigned: 'Назначено',
  New: 'Новое', Closed: 'Закрыто',
  Phone: 'Телефон', Chat: 'Чат',
  High: 'Высокий', Medium: 'Средний', Low: 'Низкий',
  maapaneva: 'Мария Ананьева',
};

export function translateFilterLabel(f: RecognizedFilter): string {
  if (f.type === 'AIContext') return f.contextLabel ?? f.value;
  const typeRu  = TYPE_LABELS[f.type]  ?? f.type;
  const valueRu = VALUE_LABELS[f.value] ?? f.value;
  return `${typeRu}: ${valueRu}`;
}

const ICON_SX = { fontSize: 13 };

// ── kit color shortcuts for filter chips ─────────────────────
const C = {
  green:  { color: '#039855', bg: '#eefbf1', badgeColor: 'green'  as BadgeColor },
  red:    { color: '#b91e5a', bg: '#f8e9ef', badgeColor: 'red'    as BadgeColor },
  orange: { color: '#f79009', bg: '#fffaef', badgeColor: 'orange' as BadgeColor },
  purple: { color: '#845cdd', bg: '#f3effc', badgeColor: 'purple' as BadgeColor },
  gray:   { color: '#575859', bg: '#f3f4f5', badgeColor: 'gray'   as BadgeColor },
};

export function parseFilters(query: string): RecognizedFilter[] {
  const q = query.toLowerCase();
  const out: RecognizedFilter[] = [];

  const has = (...words: string[]) => words.some((w) => q.includes(w));

  // ── Type ──────────────────────────────────────────────────
  if (has('request', 'запрос', 'зно'))
    out.push({ type: 'Type', value: 'Request',   ...C.purple, icon: <LayersIcon sx={{ ...ICON_SX, color: C.purple.color }} /> });
  if (has('problem', 'проблема', 'сломал', 'не работ', 'ошибк', 'баг'))
    out.push({ type: 'Type', value: 'Problem',   ...C.red,    icon: <LayersIcon sx={{ ...ICON_SX, color: C.red.color }} /> });
  if (has('complaint', 'жалоб'))
    out.push({ type: 'Type', value: 'Complaint', ...C.orange, icon: <LayersIcon sx={{ ...ICON_SX, color: C.orange.color }} /> });
  if (has('appeal', 'обращени'))
    out.push({ type: 'Type', value: 'Appeal',    ...C.green,  icon: <LayersIcon sx={{ ...ICON_SX, color: C.green.color }} /> });

  // ── Status ────────────────────────────────────────────────
  if (has('in progress', 'в работе', 'в работ', 'работе', 'активн'))
    out.push({ type: 'Status', value: 'In progress', ...C.green,  icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.green.color }} /> });
  if (has('overdue', 'просроч'))
    out.push({ type: 'Status', value: 'Overdue',     ...C.red,    icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.red.color }} /> });
  if (has('assigned', 'назначен') && !has('назначен мне', 'назначены мне', 'assigned to me', 'мои', 'my', 'me '))
    out.push({ type: 'Status', value: 'Assigned',    ...C.purple, icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.purple.color }} /> });
  if (has('new ticket', 'status new', 'новы', 'новое'))
    out.push({ type: 'Status', value: 'New',         ...C.gray,   icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.gray.color }} /> });

  // ── Assignee ──────────────────────────────────────────────
  if (has('мне', 'мои ', 'моих', 'назначен мне', 'назначены мне', 'me ', 'my ', 'assigned to me', 'ананьев', 'maapaneva'))
    out.push({ type: 'Assignee', value: 'maapaneva', ...C.purple, icon: <PersonOutlinedIcon sx={{ ...ICON_SX, color: C.purple.color }} /> });

  // ── Channel ───────────────────────────────────────────────
  if (has('phone', 'телефон', 'атс', 'pbx', 'по телефону'))
    out.push({ type: 'Channel', value: 'Phone', ...C.purple, icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.purple.color }} /> });
  if (has('email', 'почт', 'e-mail'))
    out.push({ type: 'Channel', value: 'Email', ...C.purple, icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.purple.color }} /> });
  if (has('chat', 'чат'))
    out.push({ type: 'Channel', value: 'Chat',  ...C.purple, icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.purple.color }} /> });

  // ── Priority ──────────────────────────────────────────────
  if (has('high priority', 'urgent', 'высокий приоритет', 'высок', 'критич', 'срочн'))
    out.push({ type: 'Priority', value: 'High',   ...C.red,    icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.red.color }} /> });
  if (has('low priority', 'низкий приоритет', 'низк'))
    out.push({ type: 'Priority', value: 'Low',    ...C.gray,   icon: <ShowChartIcon sx={{ ...ICON_SX, color: C.gray.color }} /> });

  // ── Period ────────────────────────────────────────────────
  const periodIcon = (c: typeof C.gray) => <DateRangeIcon sx={{ ...ICON_SX, color: c.color }} />;
  if (has('сегодня', 'today'))
    out.push({ type: 'Period', value: 'Сегодня',        ...C.purple, icon: periodIcon(C.purple) });
  else if (has('вчера', 'yesterday'))
    out.push({ type: 'Period', value: 'Вчера',          ...C.gray,   icon: periodIcon(C.gray) });
  else if (has('неделю', 'неделя', 'за 7', '7 дн', 'this week', 'past week', 'last week', 'week'))
    out.push({ type: 'Period', value: 'За 7 дней',      ...C.purple, icon: periodIcon(C.purple) });
  else if (has('месяц', 'апрел', 'март', 'this month', 'past month', 'last month', 'month'))
    out.push({ type: 'Period', value: 'Этот месяц',     ...C.purple, icon: periodIcon(C.purple) });
  else if (has('квартал', 'this quarter', 'quarter'))
    out.push({ type: 'Period', value: 'Этот квартал',   ...C.purple, icon: periodIcon(C.purple) });

  // ── AI Context tags (concepts without a matching data field) ─
  // Departure date — no date field in tickets, so we add informational AI tag
  if (has('выезд', 'дата выезда', 'departure'))
    out.push({
      type: 'AIContext', value: 'departure_week',
      contextLabel: 'Дата выезда: через неделю',
      ...C.purple,
      icon: <AutoAwesomeIcon sx={{ ...ICON_SX, color: C.purple.color }} />,
    });

  // User complaint context — supplement standard Complaint filter
  if (has('жалуется', 'жаловал', 'пользователь жалу'))
    out.push({
      type: 'AIContext', value: 'user_complaint',
      contextLabel: 'Пользователь жалуется',
      ...C.orange,
      icon: <AutoAwesomeIcon sx={{ ...ICON_SX, color: C.orange.color }} />,
    });

  return out;
}

const AI_RECENT = [
  'заявки за вчера по которым жаловались пользователи',
  'зно с датой выезда через неделю',
  'мои просроченные заявки этот месяц',
];
const QUICK_PROMPTS: { label: string; icon: React.ReactElement }[] = [
  { label: 'Этот месяц',        icon: <DateRangeIcon      sx={{ fontSize: 14 }} /> },
  { label: 'Просроченные',      icon: <AccessTimeIcon     sx={{ fontSize: 14 }} /> },
  { label: 'В работе сегодня',  icon: <ShowChartIcon      sx={{ fontSize: 14 }} /> },
  { label: 'Канал телефон',     icon: <PhoneIcon          sx={{ fontSize: 14 }} /> },
  { label: 'Высокий приоритет', icon: <LayersIcon         sx={{ fontSize: 14 }} /> },
];

import { TICKETS } from '../data/tickets';
import { countMatchingTickets } from '../utils/filterUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: RecognizedFilter[]) => void;
  onSearch: (query: string) => void;
}

export default function SearchBar({ open, onClose, onApplyFilters, onSearch }: Props) {
  const [mode, setMode] = useState<SearchMode>('ai');
  const [query, setQuery] = useState('');
  const [aiSubmitted, setAiSubmitted] = useState(false);
  const [filters, setFilters] = useState<RecognizedFilter[]>([]);

  const matchCount = useMemo(
    () => countMatchingTickets(TICKETS, filters),
    [filters]
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'regular' ? 'ai' : 'regular'));
    setQuery('');
    setAiSubmitted(false);
    setFilters([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); inputRef.current?.blur(); }
    if (e.key === 'Enter') handleSubmit();
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (mode === 'ai') {
      setFilters(parseFilters(query));
      setAiSubmitted(true);
    } else {
      onSearch(query);
      onClose();
    }
  };

  const handleQuickPrompt = (label: string) => {
    setQuery(label.toLowerCase());
    setFilters(parseFilters(label.toLowerCase()));
    setAiSubmitted(true);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
    setQuery('');
    setAiSubmitted(false);
    setFilters([]);
  };

  const handleCancel = () => {
    onClose();
    setAiSubmitted(false);
    setFilters([]);
  };

  const removeFilter = (idx: number) =>
    setFilters((prev) => prev.filter((_, i) => i !== idx));

  const isAI = mode === 'ai';

  if (!open) return null;

  return (
    <Box
      ref={rootRef}
      sx={{
        position: 'fixed',
        top: 106,          // header (56) + toolbar (50)
        right: 24,         // matches FilterBar px:3
        width: { xs: 'calc(100vw - 48px)', sm: 640 },
        zIndex: 1400,
      }}
    >
      <Fade in={open}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: `1px solid ${kit.gray4}`,
            boxShadow: kit.shadowLg,
            overflow: 'hidden',
          }}
        >
          {/* ── Input bar at top of panel ── */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center',
              px: 1.5, py: 1.25,
              borderBottom: `1px solid ${kit.gray4}`,
            }}
          >
            {/* Single input row — pill switcher inside as left adornment */}
            <Box
              sx={{
                flexGrow: 1, display: 'flex', alignItems: 'center',
                height: 48, borderRadius: '100px',
                border: `1.5px solid ${isAI ? kit.purple5 : kit.gray4}`,
                bgcolor: '#fff',
                boxShadow: isAI ? `0 0 0 3px ${kit.purple2}` : 'none',
                pl: '4px', pr: '6px',
                gap: 0,
                transition: 'box-shadow 0.2s, border-color 0.2s',
                cursor: 'text',
              }}
              onClick={() => inputRef.current?.focus()}
            >
              {/* ── Pill switcher (left adornment) ── */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                height: 40,
                bgcolor: kit.gray3,
                borderRadius: '100px',
                p: '3px',
                gap: '2px',
                mr: 1,
                }}
              >
                {/* 🔍 Search segment */}
                <Box
                  onClick={(e) => { e.stopPropagation(); if (isAI) switchMode(); }}
                  sx={{
                    width: 34, height: 34,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: !isAI ? '#fff' : 'transparent',
                    boxShadow: !isAI ? '0 1px 3px rgba(0,0,0,0.14)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    '&:hover': { bgcolor: !isAI ? '#fff' : kit.gray4 },
                  }}
                >
                  <SearchIcon sx={{ fontSize: 16, color: !isAI ? kit.gray9 : kit.gray6 }} />
                </Box>

                {/* ✦ AI segment */}
                <Box
                  onClick={(e) => { e.stopPropagation(); if (!isAI) switchMode(); }}
                  sx={{
                    height: 34, px: 1.1,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    borderRadius: '50px',
                    bgcolor: isAI ? kit.purple6 : 'transparent',
                    boxShadow: isAI ? '0 1px 3px rgba(0,0,0,0.14)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    '&:hover': { bgcolor: isAI ? kit.purple7 : kit.purple2 },
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 13, color: isAI ? '#fff' : kit.purple6 }} />
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: isAI ? '#fff' : kit.purple6, lineHeight: 1 }}>
                    AI
                  </Typography>
                </Box>
              </Box>

              {/* Text input */}
              <InputBase
                inputRef={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (aiSubmitted) setAiSubmitted(false); }}
                onKeyDown={handleKeyDown}
                placeholder={isAI ? 'напр. "мои просроченные заявки этот месяц"' : 'Поиск по заявкам, клиентам, ID…'}
                sx={{
                  flexGrow: 1, fontSize: '0.875rem', color: kit.gray10,
                  '& input::placeholder': { color: kit.gray6, opacity: 1 },
                  '& input': { p: 0 },
                }}
              />

              {/* Send button (right adornment) */}
              {query && (
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                  sx={{ width: 34, height: 34, flexShrink: 0, bgcolor: isAI ? kit.purple6 : kit.gray3, color: isAI ? '#fff' : kit.gray7, borderRadius: '50%', '&:hover': { bgcolor: isAI ? kit.purple7 : kit.gray4 } }}
                >
                  <SendIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          </Box>
          {/* REGULAR MODE */}
          {!isAI && (
            <Box sx={{ px: 2, py: 1.75 }}>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.06em', mb: 0.75 }}>
                БЫСТРЫЙ ПОИСК
              </Typography>
              {['SD-21786', 'SD-21811', 'SD-21841'].map((id) => (
                <Box key={id} onClick={() => { onSearch(id); onClose(); }}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.65, px: 1, mx: -1, borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: kit.gray3 } }}
                >
                  <SearchIcon sx={{ fontSize: 14, color: kit.gray6 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: kit.gray10 }}>{id}</Typography>
                </Box>
              ))}
              <Box sx={{ borderTop: `1px solid ${kit.gray4}`, mt: 1, pt: 1 }}>
                <Box onClick={(e) => { e.stopPropagation(); switchMode(); inputRef.current?.focus(); }}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.65, px: 1, mx: -1, borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: kit.gray3 } }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 14, color: kit.purple6 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: kit.gray7 }}>
                    Переключиться на{' '}
                    <Box component="span" sx={{ color: kit.purple6, fontWeight: 600 }}>AI-поиск</Box>
                    {' '}для фильтрации на естественном языке
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* AI MODE: initial */}
          {isAI && !aiSubmitted && (
            <Box sx={{ px: 2, py: 1.75 }}>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.06em', mb: 0.75 }}>
                НЕДАВНИЕ
              </Typography>
              {AI_RECENT.map((r) => (
                <Box key={r} onClick={() => handleQuickPrompt(r)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.65, px: 1, mx: -1, borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: kit.gray3 } }}
                >
                  <AccessTimeIcon sx={{ fontSize: 14, color: kit.gray6 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: kit.gray10 }}>{r}</Typography>
                </Box>
              ))}
              <Box sx={{ borderTop: `1px solid ${kit.gray4}`, mt: 1, pt: 1 }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.06em', mb: 0.75 }}>
                  БЫСТРЫЕ ЗАПРОСЫ
                </Typography>
                {/* M3 Assist chips with icon */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {QUICK_PROMPTS.map((p) => (
                    <Chip
                      key={p.label}
                      label={p.label}
                      variant="outlined"
                      size="medium"
                      icon={p.icon}
                      onClick={() => handleQuickPrompt(p.label)}
                      sx={{
                        height: 32,
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: kit.gray9,
                        borderColor: kit.gray4,
                        cursor: 'pointer',
                        '& .MuiChip-icon': { color: kit.gray7, ml: '10px', mr: '-4px' },
                        '&:hover': { bgcolor: kit.purple1, borderColor: `${kit.purple6}40`, color: kit.purple8, '& .MuiChip-icon': { color: kit.purple6 } },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}

          {/* AI MODE: results */}
          {isAI && aiSubmitted && (
            <Box sx={{ px: 2, py: 1.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.06em' }}>
                  РАСПОЗНАННЫЕ ФИЛЬТРЫ
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, cursor: 'pointer', color: kit.gray7, '&:hover': { color: kit.purple6 } }}
                  onClick={() => setAiSubmitted(false)}
                >
                  <RefreshIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>Изменить</Typography>
                </Box>
              </Box>

              {filters.length === 0 ? (
                <Typography sx={{ fontSize: '0.875rem', color: kit.gray7, mb: 1.5 }}>
                  Фильтры не распознаны — попробуйте другой запрос.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                  {filters.map((f, i) => (
                    <Box key={i}
                      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, height: 32, pl: 1, pr: 0.75, bgcolor: f.bg, border: `1px solid ${f.color}40`, borderRadius: '8px' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', color: f.color, flexShrink: 0 }}>{f.icon}</Box>
                      <Typography sx={{ fontSize: '0.8125rem', color: kit.gray7 }}>{TYPE_LABELS[f.type] ?? f.type}</Typography>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: f.color }}>{VALUE_LABELS[f.value] ?? f.value}</Typography>
                      <Box onClick={() => removeFilter(i)} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: kit.gray5, ml: 0.25, '&:hover': { color: kit.red6 }, transition: 'color 0.15s' }}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.875rem', color: kit.gray7 }}>
                  {filters.length > 0 ? 'Примерно ' : ''}
                  <Box component="span" sx={{ fontWeight: 600, color: kit.gray10 }}>{matchCount}</Box>{' '}
                  {filters.length === 0 ? 'обращений — фильтры не активны' : 'обращений найдено'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={handleCancel}
                    sx={{ color: kit.gray7, borderColor: kit.gray4, height: 32, '&:hover': { borderColor: kit.gray5, bgcolor: kit.gray3 } }}
                  >
                    Отмена
                  </Button>
                  <Button variant="contained" size="small" disableElevation disabled={filters.length === 0} onClick={handleApply}
                    sx={{ bgcolor: kit.purple6, height: 32, '&:hover': { bgcolor: kit.purple7 } }}
                  >
                    Применить
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}

