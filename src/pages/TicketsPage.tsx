import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box, Grid, Chip,
  Skeleton, Fade,
} from '@mui/material';
import { Button as KitButton, Typography, TypographySize, TypographyRole, TypographyColor } from '../ui';
import { kit } from '../theme';
import dogSrc from '../assets/dog.svg';
import Header from '../components/Header';
import FilterBar, { type ActiveFilter } from '../components/FilterBar';
import TicketCard from '../components/TicketCard';
import { TICKETS, type Ticket } from '../data/tickets';
import type { RecognizedFilter } from '../components/SearchBar';
type ScopeTab = 'all' | 'mine' | 'team';
import { matchesAIFilter, matchesTextSearch, toActiveFilter } from '../utils/filterUtils';

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Box sx={{ bgcolor: kit.gray1, borderRadius: '16px', border: `1px solid ${kit.gray4}`, p: '14px', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Skeleton variant="rounded" width={64} height={18} sx={{ borderRadius: '6px' }} />
        <Skeleton variant="text" width={70} sx={{ fontSize: '0.78rem' }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width={52} height={16} sx={{ borderRadius: '20px' }} />
        <Skeleton variant="text" width={60} sx={{ fontSize: '0.7rem' }} />
      </Box>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="72%" />
      <Box sx={{ borderTop: `1px solid ${kit.gray4}`, my: 0.25 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
          <Skeleton variant="text" width={30} sx={{ fontSize: '0.63rem' }} />
          <Skeleton variant="text" width={90} sx={{ fontSize: '0.72rem' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, alignItems: 'flex-end' }}>
          <Skeleton variant="text" width={40} sx={{ fontSize: '0.63rem' }} />
          <Skeleton variant="text" width={80} sx={{ fontSize: '0.72rem' }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
        <Skeleton variant="circular" width={22} height={22} />
        <Skeleton variant="text" width={90} sx={{ fontSize: '0.74rem' }} />
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const [variant, setVariant] = useState<1 | 2 | 3>(1);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [scopeTab, setScopeTab] = useState<ScopeTab>('all');

  const visibleTickets = useMemo<Ticket[]>(() => {
    return tickets.filter((t) => {
      const passesFilters = activeFilters.every((f) => matchesAIFilter(t, f));
      const passesSearch  = matchesTextSearch(t, searchQuery);
      return passesFilters && passesSearch;
    });
  }, [tickets, activeFilters, searchQuery]);

  const isFiltered = activeFilters.length > 0 || searchQuery.trim() !== '';

  const handleToggleStar = (id: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, starred: !t.starred } : t)));
  };

  // ── Scope tab ↔ ActiveFilter sync ────────────────────────
  // Tab → filter: clicking a tab immediately adds/replaces Assignee/Team filter
  const handleScopeChange = useCallback((tab: ScopeTab) => {
    setScopeTab(tab);
    setActiveFilters((prev) => {
      const rest = prev.filter((f) => f.key !== 'Assignee' && f.key !== 'Team');
      if (tab === 'mine')
        return [...rest, { key: 'Assignee', label: 'Исполнитель', value: 'Мария Ананьева' }];
      if (tab === 'team')
        return [...rest, { key: 'Team', label: 'Команда', value: 'Support 1' }];
      return rest;
    });
  }, []);

  // Filter → tab: adjusts scope tab based on active Assignee/Team filters
  useEffect(() => {
    const assigneeFilters = activeFilters.filter((f) => f.key === 'Assignee');
    const teamFilters     = activeFilters.filter((f) => f.key === 'Team');

    // "Мои" only when Мария is the SOLE assignee and no team filter
    const isOnlyMe   = assigneeFilters.length === 1
      && assigneeFilters[0].value === 'Мария Ананьева'
      && teamFilters.length === 0;

    // "Команда" only when Support 1 is the SOLE team and no assignee filter
    const isOnlyTeam = teamFilters.length === 1
      && teamFilters[0].value === 'Support 1'
      && assigneeFilters.length === 0;

    if (isOnlyMe)        setScopeTab('mine');
    else if (isOnlyTeam) setScopeTab('team');
    else                 setScopeTab('all');
  }, [activeFilters]);

  const PANEL_KEYS = new Set(['Assignee', 'Team', 'Type', 'Status', 'Channel', 'Priority']);

  const handleApplyPanel = useCallback((panelFilters: ActiveFilter[]) => {
    setLoading(true);
    setTimeout(() => {
      setActiveFilters((prev) => {
        const kept = prev.filter((f) => !PANEL_KEYS.has(f.key));
        return [...kept, ...panelFilters];
      });
      setLoading(false);
    }, 400);
  }, []);

  const handleResetPanel = useCallback(() => {
    setActiveFilters((prev) => prev.filter((f) => !PANEL_KEYS.has(f.key)));
  }, []);

  const handleApplyFilters = useCallback((filters: RecognizedFilter[]) => {
    setLoading(true);
    setTimeout(() => {
      setActiveFilters((prev) => {
        const incoming = filters.map(toActiveFilter);
        const incomingKeys = new Set(incoming.map((f) => f.key));
        const kept = prev.filter((f) => !incomingKeys.has(f.key));
        return [...kept, ...incoming];
      });
      setLoading(false);
    }, 1400);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setLoading(true);
    setTimeout(() => { setSearchQuery(query); setLoading(false); }, 800);
  }, []);

  const handleRemoveFilter = (key: string, value: string) => {
    setActiveFilters((prev) => prev.filter((f) => !(f.key === key && f.value === value)));
  };

  const handleResetAll = () => { setActiveFilters([]); setSearchQuery(''); };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: kit.gray3, display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Prototype variant switcher ── */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 3, py: 0.75,
          bgcolor: kit.gray2,
          borderBottom: `1px solid ${kit.gray4}`,
        }}>
          <Box sx={{ fontSize: '0.72rem', fontWeight: 600, color: kit.gray6, letterSpacing: '0.05em', mr: 0.5 }}>
            ПРОТОТИП
          </Box>
          {([1, 2, 3] as const).map((v) => (
            <Box
              key={v}
              onClick={() => {
                setVariant(v);
                setActiveFilters([]);
                setSearchQuery('');
                setScopeTab('all');
              }}
              sx={{
                display: 'inline-flex', alignItems: 'center', height: 26, px: 1.25,
                borderRadius: '6px',
                border: `1px solid ${variant === v ? kit.purple5 : kit.gray4}`,
                bgcolor: variant === v ? kit.purple1 : 'transparent',
                color: variant === v ? kit.purple8 : kit.gray7,
                fontSize: '0.75rem', fontWeight: variant === v ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
                '&:hover': { bgcolor: kit.purple1, borderColor: kit.purple5, color: kit.purple8 },
              }}
            >
              Вариант {v}
            </Box>
          ))}
          <Box sx={{ fontSize: '0.72rem', color: kit.gray6, ml: 0.5 }}>
            {variant === 1
              ? '— Скоп-чипы всегда видны в строке фильтров'
              : variant === 2
              ? '— Скоп-чипы внутри поиска (дропдаун)'
              : '— Скоп-пилюля + поиск за иконкой (как в референсе)'}
          </Box>
        </Box>

        <FilterBar
          filters={activeFilters}
          searchQuery={searchQuery}
          scopeTab={scopeTab}
          onScopeChange={handleScopeChange}
          onRemoveFilter={handleRemoveFilter}
          onClearSearch={() => setSearchQuery('')}
          onResetAll={handleResetAll}
          onApplyFilters={handleApplyFilters}
          onApplyPanel={handleApplyPanel}
          onResetPanel={handleResetPanel}
          onSearch={handleSearch}
          variant={variant}
        />

        {/* @material/web md-linear-progress — real M3 wave indicator */}
        {loading && (
          <md-linear-progress indeterminate style={{ width: '100%' }} />
        )}

        {/* Results bar */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 36 }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton variant="text" width={120} sx={{ fontSize: '0.8rem' }} />
              <md-circular-progress indeterminate style={{ width: 20, height: 20 }} />
            </Box>
          ) : (
            <>
              <span style={{ fontSize: 13, color: kit.gray7, fontFamily: 'Inter, sans-serif' }}>
                {isFiltered ? (
                  <>
                    <span style={{ fontWeight: 600, color: kit.gray10 }}>{visibleTickets.length}</span>
                    {' из '}
                    <span style={{ fontWeight: 600, color: kit.gray10 }}>{tickets.length}</span>
                    {' обращений'}
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: 600, color: kit.gray10 }}>{tickets.length}</span>
                    {' обращений'}
                  </>
                )}
              </span>
              {activeFilters.length > 0 && searchQuery.trim() && (
                <Chip
                  label="Фильтр + Поиск"
                  size="small"
                  sx={{ bgcolor: kit.purple1, color: kit.purple7, fontWeight: 600, fontSize: '0.7rem', height: 22, border: `1px solid ${kit.purple2}` }}
                />
              )}
            </>
          )}
        </Box>

        {/* Grid */}
        <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 1.5 }, flexGrow: 1 }}>
          {loading ? (
            <Grid container spacing={2}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}><SkeletonCard /></Grid>
              ))}
            </Grid>
          ) : visibleTickets.length === 0 ? (
            <Fade in>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 2 }}>
                <img src={dogSrc} alt="" style={{ width: 96, height: 96, opacity: 0.5 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography size={TypographySize.M} role={TypographyRole.Heading} color={TypographyColor.Secondary}>
                    Нет результатов
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Typography size={TypographySize.S} role={TypographyRole.Text} color={TypographyColor.Inactive}>
                      Попробуйте изменить параметры фильтра или поиска
                    </Typography>
                  </Box>
                </Box>
                {isFiltered && (
                  <KitButton
                    text="Сбросить фильтры"
                    variant="secondary"
                    onClick={handleResetAll}
                    iconName="Close"
                    iconPosition="left"
                  />
                )}
              </Box>
            </Fade>
          ) : (
            <Fade in>
              <Grid container spacing={2}>
                {visibleTickets.map((ticket) => (
                  <Grid key={ticket.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <TicketCard ticket={ticket} onToggleStar={handleToggleStar} />
                  </Grid>
                ))}
              </Grid>
            </Fade>
          )}
        </Box>
      </Box>
  );
}
