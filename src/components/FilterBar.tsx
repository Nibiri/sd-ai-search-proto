import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Chip, InputBase, Paper, Fade } from '@mui/material';
import { kit } from '../theme';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TICKETS } from '../data/tickets';
import { countMatchingTickets } from '../utils/filterUtils';
import { Badge as KitBadge, Button as KitButton, Icon as KitIcon, Tabs as KitTabs } from '@logicbpm/logicbpm-ui-kit';
import type { RecognizedFilter } from './SearchBar';
import { parseFilters, translateFilterLabel } from './SearchBar';
import FiltersPanel from './FiltersPanel';

export type { RecognizedFilter };

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

export function getFilterAccent(key: string, value: string): { color: string; bg: string } {
  const map: Record<string, Record<string, { color: string; bg: string }>> = {
    Assignee: {
      'Мария Ананьева':  { color: '#7C5CBF', bg: '#f3effc' },
      'Иван Иванов':     { color: '#3B82F6', bg: '#eff6ff' },
      'Елена Ковалёва':  { color: '#22C55E', bg: '#f0fdf4' },
      'Айша Белова':     { color: '#14B8A6', bg: '#f0fdfa' },
      'Дмитрий Орлов':   { color: '#EC4899', bg: '#fdf2f8' },
      'Ольга Дмитриева': { color: '#F59E0B', bg: '#fffbeb' },
    },
    Team:     { 'Support 1': { color: '#845cdd', bg: '#f3effc' }, 'Support 2': { color: '#039855', bg: '#eefbf1' } },
    Type:     { Problem: { color: '#b91e5a', bg: '#f8e9ef' }, Complaint: { color: '#f79009', bg: '#fffaef' }, Request: { color: '#845cdd', bg: '#f3effc' }, Appeal: { color: '#039855', bg: '#eefbf1' } },
    Status:   { 'In progress': { color: '#039855', bg: '#eefbf1' }, Assigned: { color: '#845cdd', bg: '#f3effc' }, Overdue: { color: '#b91e5a', bg: '#f8e9ef' }, New: { color: '#575859', bg: '#f3f4f5' }, Closed: { color: '#8c8c8c', bg: '#f3f4f5' } },
    Channel:  { Phone: { color: '#845cdd', bg: '#f3effc' }, Email: { color: '#845cdd', bg: '#f3effc' }, Chat: { color: '#845cdd', bg: '#f3effc' } },
    Priority: { High: { color: '#b91e5a', bg: '#f8e9ef' }, Medium: { color: '#f79009', bg: '#fffaef' }, Low: { color: '#575859', bg: '#f3f4f5' } },
  };
  return map[key]?.[value] ?? { color: '#845cdd', bg: '#f3effc' };
}

// ── AI quick prompts ──────────────────────────────────────────
const AI_RECENT = [
  'заявки за вчера по которым жаловались пользователи',
  'зно с датой выезда через неделю',
  'мои просроченные заявки этот месяц',
];

const QUICK_PROMPTS: { label: string; icon: React.ReactElement }[] = [
  { label: 'Этот месяц',       icon: <DateRangeIcon      sx={{ fontSize: 14 }} /> },
  { label: 'Просроченные',     icon: <AccessTimeIcon     sx={{ fontSize: 14 }} /> },
  { label: 'В работе сегодня', icon: <ShowChartIcon      sx={{ fontSize: 14 }} /> },
  { label: 'По телефону',      icon: <PhoneIcon          sx={{ fontSize: 14 }} /> },
  { label: 'Высокий приоритет',icon: <FlagOutlinedIcon   sx={{ fontSize: 14 }} /> },
];

const QUICK_PROMPTS_V3: { label: string; icon: React.ReactElement }[] = [
  { label: 'Назначены на меня',   icon: <PersonOutlinedIcon sx={{ fontSize: 13 }} /> },
  { label: 'За последнюю неделю', icon: <DateRangeIcon      sx={{ fontSize: 13 }} /> },
  { label: 'Канал АТС',           icon: <PhoneIcon          sx={{ fontSize: 13 }} /> },
  { label: 'Просроченные',        icon: <AccessTimeIcon     sx={{ fontSize: 13 }} /> },
  { label: 'В работе сегодня',    icon: <ShowChartIcon      sx={{ fontSize: 13 }} /> },
];

// ── Panel filter keys ─────────────────────────────────────────
const PANEL_KEYS = new Set(['Assignee', 'Team', 'Type', 'Status', 'Channel', 'Priority']);

// ── Props ─────────────────────────────────────────────────────
interface Props {
  filters: ActiveFilter[];
  searchQuery: string;
  scopeTab: 'all' | 'mine' | 'team';
  onScopeChange: (tab: 'all' | 'mine' | 'team') => void;
  onRemoveFilter: (key: string, value: string) => void;
  onClearSearch: () => void;
  onResetAll: () => void;
  onApplyFilters: (filters: RecognizedFilter[]) => void;
  onApplyPanel: (filters: ActiveFilter[]) => void;
  onResetPanel: () => void;
  onSearch: (query: string) => void;
  variant?: 1 | 2 | 3;
}

export default function FilterBar({
  filters,
  searchQuery,
  scopeTab,
  onScopeChange,
  onRemoveFilter,
  onClearSearch,
  onResetAll,
  onApplyFilters,
  onApplyPanel,
  onResetPanel,
  onSearch,
  variant = 1,
}: Props) {
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false);

  // ── Inline AI search state ─────────────────────────────────
  const [mode, setMode]                 = useState<'regular' | 'ai'>('ai');
  const [query, setQuery]               = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aiSubmitted, setAiSubmitted]   = useState(false);
  const [aiFilters, setAiFilters]       = useState<RecognizedFilter[]>([]);

  const inputRef  = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [v3SearchOpen, setV3SearchOpen] = useState(false);

  const matchCount = useMemo(
    () => countMatchingTickets(TICKETS, aiFilters),
    [aiFilters]
  );

  const isAI = mode === 'ai';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'regular' ? 'ai' : 'regular'));
    setQuery('');
    setAiSubmitted(false);
    setAiFilters([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = () => {
    if (!query.trim()) return;
    if (isAI) {
      setAiFilters(parseFilters(query));
      setAiSubmitted(true);
    } else {
      onSearch(query);
      setDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setDropdownOpen(false); inputRef.current?.blur(); }
    if (e.key === 'Enter')  handleSubmit();
  };

  const handleQuickPrompt = (label: string) => {
    setQuery(label.toLowerCase());
    setAiFilters(parseFilters(label.toLowerCase()));
    setAiSubmitted(true);
  };

  const handleApplyAI = () => {
    onApplyFilters(aiFilters);
    setDropdownOpen(false);
    setQuery('');
    setAiSubmitted(false);
    setAiFilters([]);
  };

  const handleCancelAI = () => {
    setDropdownOpen(false);
    setAiSubmitted(false);
    setAiFilters([]);
  };

  // Count only panel-type filters (from Drawer)
  const panelCount = filters.filter((f) => PANEL_KEYS.has(f.key)).length;

  // Panel filters (only Type/Status/Channel/Priority) to pass into FiltersPanel
  const panelFilters = filters.filter((f) => PANEL_KEYS.has(f.key));

  // Filters to show as chips:
  // Variant 1 — scope is shown as persistent tabs, hide redundant Assignee/Team chips
  // Variant 2 — no scope tabs in chip row, show Assignee/Team as regular chips
  const chipFilters = filters.filter((f) => {
    if (variant === 1 || variant === 3) {
      if (f.key === 'Assignee' && scopeTab === 'mine') return false;
      if (f.key === 'Team'     && scopeTab === 'team') return false;
    }
    return true;
  });

  const hasExtras = chipFilters.length > 0 || searchQuery.trim() !== '';

  // "Сбросить всё" скрыт, если активен только скоп (Мои / Команда) без других фильтров и поиска
  const scopeOnlyActive = filters.length > 0 && filters.every(
    (f) =>
      (f.key === 'Assignee' && scopeTab === 'mine') ||
      (f.key === 'Team'     && scopeTab === 'team')
  );
  const showResetAll = (!scopeOnlyActive && filters.length > 0) || searchQuery.trim() !== '';

  const SCOPE_TABS: { key: 'all' | 'mine' | 'team'; label: string }[] = [
    { key: 'all',  label: 'Все' },
    { key: 'mine', label: 'Мои' },
    { key: 'team', label: 'Команда' },
  ];

  return (
    <>
      {/* ── Filters side panel ── */}
      <FiltersPanel
        open={filtersPanelOpen}
        appliedFilters={panelFilters}
        onClose={() => setFiltersPanelOpen(false)}
        onApply={(draft) => { onApplyPanel(draft); setFiltersPanelOpen(false); }}
        onReset={onResetPanel}
      />

      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', px: { xs: 2, sm: 3 }, position: 'relative' }}>

        {/* ══ Variant 3 toolbar + search panel ══════════════════ */}
        {variant === 3 && (
          <>
            {/* Inject style to suppress empty tab-content panels */}
            <style>{`.v3-scope-tabs-content { display: none !important; }`}</style>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', py: 1 }}>

              {/* Left spacer — intentionally empty */}
              <Box />

              {/* Centre — kit deep tabs */}
              <KitTabs
                view="deep"
                activeTab={scopeTab}
                tabs={[
                  {
                    id: 'all' as const,
                    label: 'Все заявки',
                    icon: <LayersOutlinedIcon sx={{ fontSize: 18 }} />,
                  },
                  {
                    id: 'mine' as const,
                    label: 'Мои заявки',
                    icon: <DesktopWindowsOutlinedIcon sx={{ fontSize: 18 }} />,
                  },
                  {
                    id: 'team' as const,
                    label: 'Команда',
                    icon: <PersonOutlinedIcon sx={{ fontSize: 18 }} />,
                  },
                ]}
                onChange={(id) => onScopeChange(id as 'all' | 'mine' | 'team')}
                classNameContentWrapper="v3-scope-tabs-content"
              />

              {/* Right — icon buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75 }}>

                {/* Search toggle */}
                <Box
                  component="button"
                  onClick={() => {
                    setV3SearchOpen((o) => {
                      if (!o) setTimeout(() => inputRef.current?.focus(), 80);
                      return !o;
                    });
                    setDropdownOpen(false);
                    setQuery('');
                    setAiSubmitted(false);
                    setAiFilters([]);
                  }}
                  sx={{
                    all: 'unset',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, borderRadius: '16px',
                    bgcolor: v3SearchOpen ? kit.purple1 : 'var(--button-operation)',
                    color: v3SearchOpen ? kit.purple6 : 'var(--text-primary)',
                    cursor: 'pointer', transition: 'background-color 0.15s',
                    '&:hover': { bgcolor: v3SearchOpen ? kit.purple2 : 'var(--button-operation-hover)' },
                  }}
                >
                  <SearchIcon sx={{ fontSize: 20 }} />
                </Box>

                {/* Filter button */}
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Box
                    component="button"
                    onClick={() => setFiltersPanelOpen(true)}
                    sx={{
                      all: 'unset',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: '16px',
                      bgcolor: filtersPanelOpen || panelCount > 0 ? kit.purple1 : 'var(--button-operation)',
                      color: filtersPanelOpen || panelCount > 0 ? kit.purple6 : 'var(--text-primary)',
                      cursor: 'pointer', transition: 'background-color 0.3s ease',
                      '&:hover': { bgcolor: filtersPanelOpen || panelCount > 0 ? kit.purple2 : 'var(--button-operation-hover)' },
                      boxSizing: 'border-box',
                    }}
                  >
                    <KitIcon name="Filter" size={20} />
                  </Box>
                  {panelCount > 0 && (
                    <Box sx={{
                      position: 'absolute', top: -5, right: -5,
                      width: 18, height: 18, borderRadius: '50%',
                      bgcolor: kit.purple6, color: '#fff',
                      fontSize: '0.625rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none', fontFamily: 'Inter, sans-serif',
                    }}>
                      {panelCount}
                    </Box>
                  )}
                </Box>

                {/* View toggle */}
                <Box
                  component="button"
                  onClick={() => {}}
                  sx={{
                    all: 'unset',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    height: 40, px: '16px', borderRadius: '16px',
                    bgcolor: 'var(--button-operation)', color: 'var(--text-primary)',
                    fontFamily: 'var(--inter-display), sans-serif',
                    cursor: 'pointer', transition: 'background-color 0.3s ease',
                    '&:hover': { bgcolor: 'var(--button-operation-hover)' },
                    boxSizing: 'border-box',
                  }}
                >
                  <KitIcon name="Grid" size={20} />
                  <KitIcon name="ChevronDown" size={16} />
                </Box>
              </Box>
            </Box>

            {/* ── V3 Search panel (slides open) ── */}
            {v3SearchOpen && (
              <Box ref={searchRef} sx={{ pb: 1.5 }}>
                <Box sx={{ position: 'relative' }}>
                  {/* Input row */}
                  <Box
                    sx={{
                      display: 'flex', alignItems: 'center',
                      height: 44, borderRadius: '14px',
                      border: `1.5px solid ${dropdownOpen && isAI ? kit.purple5 : kit.gray4}`,
                      bgcolor: '#fff',
                      boxShadow: dropdownOpen && isAI ? `0 0 0 3px ${kit.purple2}` : 'none',
                      pl: '4px', pr: '10px', gap: 0,
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                      cursor: 'text',
                    }}
                    onClick={() => { inputRef.current?.focus(); setDropdownOpen(true); }}
                  >
                    {/* AI ↔ Search toggle pill (AI on the left as per V3 design) */}
                    <Box sx={{
                      display: 'flex', alignItems: 'center', flexShrink: 0,
                      height: 34, bgcolor: kit.gray3, borderRadius: '100px',
                      p: '3px', gap: '2px', mr: 1,
                    }}>
                      <Box
                        onClick={(e) => { e.stopPropagation(); if (!isAI) switchMode(); setDropdownOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          height: 28, px: 1, borderRadius: '50px',
                          bgcolor: isAI ? kit.purple6 : 'transparent',
                          boxShadow: isAI ? '0 1px 3px rgba(0,0,0,0.14)' : 'none',
                          cursor: 'pointer', transition: 'all 0.18s ease',
                          '&:hover': { bgcolor: isAI ? kit.purple7 : kit.purple2 },
                        }}
                      >
                        <AutoAwesomeIcon sx={{ fontSize: 12, color: isAI ? '#fff' : kit.purple6 }} />
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: isAI ? '#fff' : kit.purple6, lineHeight: 1 }}>
                          AI
                        </Typography>
                      </Box>
                      <Box
                        onClick={(e) => { e.stopPropagation(); if (isAI) switchMode(); }}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          height: 28, px: 1, borderRadius: '50px',
                          bgcolor: !isAI ? '#fff' : 'transparent',
                          boxShadow: !isAI ? '0 1px 3px rgba(0,0,0,0.14)' : 'none',
                          cursor: 'pointer', transition: 'all 0.18s ease',
                          '&:hover': { bgcolor: !isAI ? '#fff' : kit.gray4 },
                        }}
                      >
                        <SearchIcon sx={{ fontSize: 13, color: !isAI ? kit.gray9 : kit.gray6 }} />
                      </Box>
                    </Box>

                    <InputBase
                      inputRef={inputRef}
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); if (aiSubmitted) setAiSubmitted(false); }}
                      onFocus={() => setDropdownOpen(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Опишите ваш запрос..."
                      sx={{
                        flexGrow: 1, fontSize: '0.875rem', color: kit.gray10,
                        '& input::placeholder': { color: kit.gray6, opacity: 1 },
                        '& input': { p: 0 },
                      }}
                    />

                    {query && (
                      <Box
                        onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                        sx={{
                          width: 28, height: 28, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: isAI ? kit.purple6 : kit.gray3,
                          color: isAI ? '#fff' : kit.gray7,
                          borderRadius: '50%', cursor: 'pointer',
                          '&:hover': { bgcolor: isAI ? kit.purple7 : kit.gray4 },
                          transition: 'background 0.15s',
                        }}
                      >
                        <SendIcon sx={{ fontSize: 13 }} />
                      </Box>
                    )}

                    <InfoOutlinedIcon sx={{ fontSize: 18, color: kit.gray5, ml: 1, flexShrink: 0 }} />

                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        setV3SearchOpen(false);
                        setDropdownOpen(false);
                        setQuery('');
                        setAiSubmitted(false);
                        setAiFilters([]);
                      }}
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, ml: 0.5, borderRadius: '50%', flexShrink: 0,
                        cursor: 'pointer', color: kit.gray6,
                        '&:hover': { bgcolor: kit.gray3, color: kit.gray9 },
                        transition: 'all 0.15s',
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>

                  {/* Dropdown — recent searches only, on focus */}
                  {dropdownOpen && !aiSubmitted && (
                    <Fade in={dropdownOpen}>
                      <Paper elevation={0} sx={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)', left: 0, right: 0,
                        zIndex: 1400,
                        borderRadius: '16px', border: `1px solid ${kit.gray4}`,
                        boxShadow: kit.shadowLg, overflow: 'hidden',
                      }}>
                        <Box sx={{ px: 2, py: 1.75 }}>
                          <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.06em', mb: 0.75 }}>
                            НЕДАВНИЕ
                          </Typography>
                          {AI_RECENT.map((r) => (
                            <Box
                              key={r}
                              onClick={() => {
                                setDropdownOpen(false);
                                if (isAI) {
                                  setQuery(r);
                                  setAiFilters(parseFilters(r));
                                  setAiSubmitted(true);
                                } else {
                                  setQuery(r);
                                  onSearch(r);
                                }
                              }}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.65, px: 1, mx: -1, borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: kit.gray3 } }}
                            >
                              <AccessTimeIcon sx={{ fontSize: 14, color: kit.gray6 }} />
                              <Typography sx={{ fontSize: '0.875rem', color: kit.gray10 }}>{r}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Fade>
                  )}
                </Box>

                {/* AI results — inline, below input */}
                {isAI && aiSubmitted && (
                  <Box sx={{ mt: 1.5, px: 0.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
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
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                      {aiFilters.map((f, i) => (
                        <KitBadge key={i} label={translateFilterLabel(f)} color={f.badgeColor} size={32}
                          onClickCross={() => setAiFilters((prev) => prev.filter((_, j) => j !== i))}
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '0.875rem', color: kit.gray7 }}>
                        Примерно{' '}
                        <Box component="span" sx={{ fontWeight: 600, color: kit.gray10 }}>{matchCount}</Box>
                        {' '}обращений
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box onClick={handleCancelAI}
                          sx={{ display: 'flex', alignItems: 'center', height: 32, px: 1.5, borderRadius: '8px', border: `1px solid ${kit.gray4}`, cursor: 'pointer', fontSize: '0.8125rem', color: kit.gray7, '&:hover': { bgcolor: kit.gray3 } }}
                        >
                          Отмена
                        </Box>
                        <Box
                          onClick={aiFilters.length > 0 ? handleApplyAI : undefined}
                          sx={{
                            display: 'flex', alignItems: 'center', height: 32, px: 1.5, borderRadius: '8px',
                            bgcolor: aiFilters.length > 0 ? kit.purple6 : kit.gray4,
                            color: aiFilters.length > 0 ? '#fff' : kit.gray6,
                            cursor: aiFilters.length > 0 ? 'pointer' : 'default',
                            fontSize: '0.8125rem', fontWeight: 600,
                            '&:hover': { bgcolor: aiFilters.length > 0 ? kit.purple7 : kit.gray4 },
                            transition: 'background 0.15s',
                          }}
                        >
                          Применить
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Quick prompts row — always visible when no submitted AI query */}
                {!aiSubmitted && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.25, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: kit.gray6, flexShrink: 0 }}>
                      Быстрый поиск
                    </Typography>
                    {QUICK_PROMPTS_V3.map((p) => (
                      <Chip
                        key={p.label}
                        label={p.label}
                        variant="outlined"
                        size="medium"
                        icon={p.icon}
                        onClick={() => handleQuickPrompt(p.label)}
                        sx={{
                          height: 30, borderRadius: '8px',
                          fontSize: '0.8125rem', color: kit.gray9,
                          borderColor: kit.gray4, cursor: 'pointer',
                          '& .MuiChip-icon': { color: kit.gray6, ml: '10px', mr: '-4px' },
                          '&:hover': { bgcolor: kit.purple1, borderColor: `${kit.purple6}40`, color: kit.purple8, '& .MuiChip-icon': { color: kit.purple6 } },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </>
        )}

        {/* ══ Toolbar (V1 / V2) ═══════════════════════════════════ */}
        {variant !== 3 && (
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, gap: 1.5 }}>

          {/* ── Inline search bar ── */}
          <Box ref={searchRef} sx={{ position: 'relative', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center',
                height: 40, borderRadius: '100px',
                border: `1.5px solid ${dropdownOpen && isAI ? kit.purple5 : kit.gray4}`,
                bgcolor: '#fff',
                boxShadow: dropdownOpen && isAI ? `0 0 0 3px ${kit.purple2}` : 'none',
                pl: '4px', pr: '6px', gap: 0,
                transition: 'box-shadow 0.2s, border-color 0.2s',
                cursor: 'text',
              }}
              onClick={() => { inputRef.current?.focus(); setDropdownOpen(true); }}
            >
              {/* Pill switcher */}
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', flexShrink: 0,
                  height: 32, bgcolor: kit.gray3, borderRadius: '100px',
                  p: '3px', gap: '2px', mr: 1,
                }}
              >
                <Box
                  onClick={(e) => { e.stopPropagation(); if (isAI) switchMode(); }}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    height: 26, px: 1, borderRadius: '50px',
                    bgcolor: !isAI ? '#fff' : 'transparent',
                    boxShadow: !isAI ? '0 1px 3px rgba(0,0,0,0.14)' : 'none',
                    cursor: 'pointer', transition: 'all 0.18s ease',
                    '&:hover': { bgcolor: !isAI ? '#fff' : kit.gray4 },
                  }}
                >
                  <SearchIcon sx={{ fontSize: 13, color: !isAI ? kit.gray9 : kit.gray6 }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: !isAI ? 600 : 400, color: !isAI ? kit.gray9 : kit.gray6, lineHeight: 1 }}>
                    Поиск
                  </Typography>
                </Box>
                <Box
                  onClick={(e) => { e.stopPropagation(); if (!isAI) switchMode(); setDropdownOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                  sx={{
                    height: 26, px: 1,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    borderRadius: '50px',
                    bgcolor: isAI ? kit.purple6 : 'transparent',
                    boxShadow: isAI ? '0 1px 3px rgba(0,0,0,0.14)' : 'none',
                    cursor: 'pointer', transition: 'all 0.18s ease',
                    '&:hover': { bgcolor: isAI ? kit.purple7 : kit.purple2 },
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 12, color: isAI ? '#fff' : kit.purple6 }} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: isAI ? '#fff' : kit.purple6, lineHeight: 1 }}>
                    AI
                  </Typography>
                </Box>
              </Box>

              <InputBase
                inputRef={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (aiSubmitted) setAiSubmitted(false); }}
                onFocus={() => setDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAI
                    ? 'Спросите AI — напр. «мои заявки в работе за неделю»'
                    : 'Поиск по обращениям, клиентам, ID…'
                }
                sx={{
                  flexGrow: 1, fontSize: '0.875rem', color: kit.gray10,
                  '& input::placeholder': { color: kit.gray6, opacity: 1 },
                  '& input': { p: 0 },
                }}
              />

              {query && (
                <Box
                  onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                  sx={{
                    width: 28, height: 28, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: isAI ? kit.purple6 : kit.gray3,
                    color: isAI ? '#fff' : kit.gray7,
                    borderRadius: '50%', cursor: 'pointer',
                    '&:hover': { bgcolor: isAI ? kit.purple7 : kit.gray4 },
                    transition: 'background 0.15s',
                  }}
                >
                  <SendIcon sx={{ fontSize: 13 }} />
                </Box>
              )}

              {!isAI && searchQuery && !query && (
                <Box
                  onClick={(e) => { e.stopPropagation(); onClearSearch(); }}
                  sx={{
                    width: 28, height: 28, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: kit.gray5, borderRadius: '50%', cursor: 'pointer',
                    '&:hover': { color: kit.red6 },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </Box>
              )}
            </Box>

            {/* ── AI Dropdown ── */}
            {dropdownOpen && (
              <Fade in={dropdownOpen}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0, right: 0,
                    zIndex: 1400,
                    borderRadius: '16px',
                    border: `1px solid ${kit.gray4}`,
                    boxShadow: kit.shadowLg,
                    overflow: 'hidden',
                  }}
                >
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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                          {/* Мои / Команда — Variant 2 only, «Все» не нужен */}
                          {variant === 2 && SCOPE_TABS.filter(t => t.key !== 'all').map((tab) => {
                            const active = scopeTab === tab.key;
                            return (
                              <Chip
                                key={tab.key}
                                label={tab.label}
                                variant="outlined"
                                size="medium"
                                onClick={() => { onScopeChange(active ? 'all' : tab.key); setDropdownOpen(false); }}
                                sx={{
                                  height: 32, borderRadius: '8px',
                                  fontSize: '0.8125rem',
                                  fontWeight: active ? 600 : 400,
                                  bgcolor: active ? kit.purple1 : 'transparent',
                                  color: active ? kit.purple8 : kit.gray7,
                                  borderColor: active ? kit.purple5 : kit.gray4,
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: kit.purple1, borderColor: kit.purple5, color: kit.purple8 },
                                  '& .MuiChip-label': { px: 1.5 },
                                }}
                              />
                            );
                          })}
                          {QUICK_PROMPTS.map((p) => (
                            <Chip
                              key={p.label}
                              label={p.label}
                              variant="outlined"
                              size="medium"
                              icon={p.icon}
                              onClick={() => handleQuickPrompt(p.label)}
                              sx={{
                                height: 32, borderRadius: '8px',
                                fontSize: '0.8125rem', color: kit.gray9,
                                borderColor: kit.gray4, cursor: 'pointer',
                                '& .MuiChip-icon': { color: kit.gray7, ml: '10px', mr: '-4px' },
                                '&:hover': { bgcolor: kit.purple1, borderColor: `${kit.purple6}40`, color: kit.purple8, '& .MuiChip-icon': { color: kit.purple6 } },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  )}

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

                      {aiFilters.length === 0 ? (
                        <Typography sx={{ fontSize: '0.875rem', color: kit.gray7, mb: 1.5 }}>
                          Фильтры не распознаны — попробуйте другой запрос.
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                          {aiFilters.map((f, i) => (
                            <KitBadge
                              key={i}
                              label={translateFilterLabel(f)}
                              color={f.badgeColor}
                              size={32}
                              onClickCross={() => setAiFilters((prev) => prev.filter((_, j) => j !== i))}
                            />
                          ))}
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: '0.875rem', color: kit.gray7 }}>
                          {aiFilters.length > 0 ? 'Примерно ' : ''}
                          <Box component="span" sx={{ fontWeight: 600, color: kit.gray10 }}>{matchCount}</Box>{' '}
                          {aiFilters.length === 0 ? 'обращений — фильтры не активны' : 'обращений найдено'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box onClick={handleCancelAI}
                            sx={{ display: 'flex', alignItems: 'center', height: 32, px: 1.5, borderRadius: '8px', border: `1px solid ${kit.gray4}`, cursor: 'pointer', fontSize: '0.8125rem', color: kit.gray7, '&:hover': { bgcolor: kit.gray3 } }}
                          >
                            Отмена
                          </Box>
                          <Box
                            onClick={aiFilters.length > 0 ? handleApplyAI : undefined}
                            sx={{
                              display: 'flex', alignItems: 'center', height: 32, px: 1.5, borderRadius: '8px',
                              bgcolor: aiFilters.length > 0 ? kit.purple6 : kit.gray4,
                              color: aiFilters.length > 0 ? '#fff' : kit.gray6,
                              cursor: aiFilters.length > 0 ? 'pointer' : 'default',
                              fontSize: '0.8125rem', fontWeight: 600,
                              '&:hover': { bgcolor: aiFilters.length > 0 ? kit.purple7 : kit.gray4 },
                              transition: 'background 0.15s',
                            }}
                          >
                            Применить
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {!isAI && (
                    <Box sx={{ px: 2, py: 1.75 }}>
                      <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.06em', mb: 0.75 }}>
                        БЫСТРЫЙ ПОИСК
                      </Typography>
                      {['SD-21786', 'SD-21811', 'SD-21841'].map((id) => (
                        <Box key={id} onClick={() => { onSearch(id); setDropdownOpen(false); }}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.65, px: 1, mx: -1, borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: kit.gray3 } }}
                        >
                          <SearchIcon sx={{ fontSize: 14, color: kit.gray6 }} />
                          <Typography sx={{ fontSize: '0.875rem', color: kit.gray10 }}>{id}</Typography>
                        </Box>
                      ))}
                      <Box sx={{ borderTop: `1px solid ${kit.gray4}`, mt: 1, pt: 1 }}>
                        <Box onClick={(e) => { e.stopPropagation(); switchMode(); }}
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.65, px: 1, mx: -1, borderRadius: '8px', cursor: 'pointer', '&:hover': { bgcolor: kit.gray3 } }}
                        >
                          <AutoAwesomeIcon sx={{ fontSize: 14, color: kit.purple6 }} />
                          <Typography sx={{ fontSize: '0.875rem', color: kit.gray7 }}>
                            Переключиться на{' '}
                            <Box component="span" sx={{ color: kit.purple6, fontWeight: 600 }}>AI-поиск</Box>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Fade>
            )}
          </Box>

          {/* ── Right icon bar ── */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>

            {/* Filter button — operation style, icon only */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Box
                component="button"
                onClick={() => setFiltersPanelOpen(true)}
                sx={{
                  all: 'unset',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40,
                  borderRadius: '16px',
                  bgcolor: filtersPanelOpen || panelCount > 0 ? kit.purple1 : 'var(--button-operation)',
                  color: filtersPanelOpen || panelCount > 0 ? kit.purple6 : 'var(--text-primary)',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'background-color 0.3s ease',
                  '&:hover': { bgcolor: filtersPanelOpen || panelCount > 0 ? kit.purple2 : 'var(--button-operation-hover)' },
                  boxSizing: 'border-box',
                }}
              >
                <KitIcon name="Filter" size={20} />
              </Box>
              {panelCount > 0 && (
                <Box sx={{
                  position: 'absolute', top: -5, right: -5,
                  width: 18, height: 18, borderRadius: '50%',
                  bgcolor: kit.purple6, color: '#fff',
                  fontSize: '0.625rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {panelCount}
                </Box>
              )}
            </Box>

            {/* View toggle — same operation bg, Grid icon + chevron */}
            <Box
              component="button"
              onClick={() => {}}
              sx={{
                all: 'unset',
                display: 'flex', alignItems: 'center', gap: '8px',
                height: 40, px: '16px',
                borderRadius: '16px',
                bgcolor: 'var(--button-operation)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--inter-display), sans-serif',
                fontSize: 16, lineHeight: '20px',
                cursor: 'pointer', flexShrink: 0,
                transition: 'background-color 0.3s ease',
                '&:hover': { bgcolor: 'var(--button-operation-hover)' },
                boxSizing: 'border-box',
              }}
            >
              <KitIcon name="Grid" size={20} />
              <KitIcon name="ChevronDown" size={16} />
            </Box>

          </Box>
        </Box>
        )}

        {/* ── Scope + active filter chips (always visible) ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, pb: 1 }}>

            {/* Scope preset chips — Variant 1 only */}
            {variant === 1 && SCOPE_TABS.map((tab) => {
              const active = scopeTab === tab.key;
              return (
                <Box
                  key={tab.key}
                  onClick={() => onScopeChange(tab.key)}
                  sx={{
                    display: 'inline-flex', alignItems: 'center', height: 32, px: 1.5,
                    border: `1px solid ${active ? kit.purple5 : kit.gray4}`,
                    borderRadius: '8px',
                    bgcolor: active ? kit.purple1 : 'transparent',
                    color: active ? kit.purple8 : kit.gray7,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    userSelect: 'none',
                    '&:hover': { bgcolor: active ? kit.purple1 : kit.gray2, borderColor: active ? kit.purple5 : kit.gray5 },
                  }}
                >
                  {tab.label}
                </Box>
              );
            })}

            {/* Separator between scope tabs and filter chips (Variant 1 only) */}
            {variant === 1 && hasExtras && (
              <Box sx={{ width: '1px', height: 20, bgcolor: kit.gray4, mx: 0.25, flexShrink: 0 }} />
            )}

            {/* Active filter chips (Assignee/Team from scope are hidden) */}
            {chipFilters.map((f) => {
              // AIContext — informational chip with AI sparkle icon
              if (f.key === 'AIContext') {
                return (
                  <Box
                    key={`AIContext:${f.value}`}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.5,
                      height: 32, pl: 1, pr: 0.75,
                      bgcolor: kit.purple1, border: `1px solid ${kit.purple4}`,
                      borderRadius: '8px',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 12, color: kit.purple6, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: kit.purple7 }}>
                      {f.value}
                    </Typography>
                    <Box
                      onClick={() => onRemoveFilter(f.key, f.value)}
                      sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: kit.gray5, ml: 0.25, '&:hover': { color: kit.red6 }, transition: 'color 0.15s' }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                );
              }
              const { color, bg } = getFilterAccent(f.key, f.value);
              return (
                <ActiveChip
                  key={`${f.key}:${f.value}`}
                  groupLabel={f.label}
                  filterKey={f.key}
                  value={f.value}
                  color={color}
                  bg={bg}
                  onRemove={() => onRemoveFilter(f.key, f.value)}
                />
              );
            })}

            {searchQuery.trim() && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, height: 32, pl: 1, pr: 0.75, bgcolor: kit.purple1, border: `1px solid ${kit.purple3}40`, borderRadius: '8px' }}>
                <SearchIcon sx={{ fontSize: 13, color: kit.purple6, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8125rem', color: kit.gray7 }}>Поиск</Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: kit.purple6 }}>"{searchQuery}"</Typography>
                <Box onClick={onClearSearch} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: kit.gray5, ml: 0.25, '&:hover': { color: kit.red6 }, transition: 'color 0.15s' }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            )}

            {chipFilters.length > 0 && searchQuery.trim() && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', height: 32, px: 1.25, bgcolor: 'transparent', border: `1px solid ${kit.gray4}`, borderRadius: '8px' }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.04em' }}>И</Typography>
              </Box>
            )}

            {showResetAll && (
              <Box onClick={onResetAll}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.35, cursor: 'pointer', color: kit.gray6, px: 0.25, ml: 0.25, '&:hover': { color: kit.red6 }, transition: 'color 0.15s' }}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: 'inherit' }}>Сбросить всё</Typography>
              </Box>
            )}
        </Box>

      </Box>
    </>
  );
}

// ── Icons per filter group ────────────────────────────────────
const GROUP_ICONS: Record<string, React.ReactElement> = {
  Assignee: <PersonOutlinedIcon  sx={{ fontSize: 13 }} />,
  Team:     <LayersOutlinedIcon  sx={{ fontSize: 13 }} />,
  Type:     <LayersOutlinedIcon  sx={{ fontSize: 13 }} />,
  Status:   <ShowChartIcon       sx={{ fontSize: 13 }} />,
  Channel:  <PhoneIcon           sx={{ fontSize: 13 }} />,
  Priority: <FlagOutlinedIcon    sx={{ fontSize: 13 }} />,
};

function ActiveChip({
  groupLabel, filterKey, value, color, bg, onRemove,
}: {
  groupLabel: string; filterKey: string; value: string; color: string; bg: string; onRemove: () => void;
}) {
  const icon = GROUP_ICONS[filterKey];
  return (
    <Box
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.5,
        height: 32, pl: icon ? 1 : 1.25, pr: 0.75,
        bgcolor: bg, border: `1px solid ${color}40`, borderRadius: '8px',
      }}
    >
      {icon && <Box sx={{ display: 'flex', alignItems: 'center', color, flexShrink: 0 }}>{icon}</Box>}
      <Typography sx={{ fontSize: '0.8125rem', color: kit.gray7, fontWeight: 400 }}>{groupLabel}</Typography>
      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color }}>{value}</Typography>
      <Box onClick={onRemove} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: kit.gray5, ml: 0.25, '&:hover': { color: kit.red6 }, transition: 'color 0.15s' }}>
        <CloseIcon sx={{ fontSize: 14 }} />
      </Box>
    </Box>
  );
}
