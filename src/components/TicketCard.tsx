import { Card, CardContent, Box, IconButton } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Badge, UserAvatar, Icon, Typography, TypographySize, TypographyRole, TypographyColor } from '../ui';
import type { BadgeColor } from '../ui';
import type { IconName } from '../ui';
import type { Ticket, TicketChannel, TicketStatus, TicketType } from '../data/tickets';
import { kit } from '../theme';

// ── Entity type config (matches real portal ENTITY_CONFIG) ──────────────────

type TypeConfig = { label: string; color: BadgeColor; topAccent: string };

const TYPE_CONFIG: Record<TicketType, TypeConfig> = {
  Problem:   { label: 'Проблема',  color: 'red',    topAccent: kit.red6    },
  Complaint: { label: 'Жалоба',    color: 'orange', topAccent: kit.orange6 },
  Request:   { label: 'Запрос',    color: 'purple', topAccent: kit.purple6 },
  Appeal:    { label: 'Обращение', color: 'green',  topAccent: kit.green6  },
};

// ── Status config (matches STATUSES_UI_MAP from real portal) ────────────────

type StatusConfig = { label: string; color: BadgeColor };

const STATUS_CONFIG: Record<TicketStatus, StatusConfig> = {
  'New':         { label: 'Новое',    color: 'blue'      },
  'In progress': { label: 'В работе', color: 'green'     },
  'Assigned':    { label: 'Назначено',color: 'lightBlue' },
  'Overdue':     { label: 'Просрочено', color: 'red'     },
  'Closed':      { label: 'Закрыто',  color: 'gray'      },
};

// ── Channel icon ─────────────────────────────────────────────────────────────

const CHANNEL_ICON: Record<TicketChannel, IconName> = {
  Phone: 'Phone',
  Email: 'Mail',
  Chat:  'MessageSquare',
};

const CHANNEL_LABEL: Record<TicketChannel, string> = {
  Phone: 'Телефон',
  Email: 'Email',
  Chat:  'Чат',
};

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ticket: Ticket;
  onToggleStar: (id: string) => void;
}

export default function TicketCard({ ticket, onToggleStar }: Props) {
  const type   = TYPE_CONFIG[ticket.type];
  const status = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG['New'];
  const isHigh = ticket.priority === 'high';

  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: '16px',
        border: `1px solid ${kit.gray4}`,
        borderTop: `2px solid ${type.topAccent}`,
        boxShadow: kit.shadowXs,
        bgcolor: kit.gray1,
        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
        '&:hover': { boxShadow: kit.shadowMd, transform: 'translateY(-2px)' },
      }}
    >
      <CardContent sx={{ p: '14px !important' }}>

        {/* Row 1: type · id · high-priority dot · star */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <Badge label={type.label} color={type.color} size={24} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography size={TypographySize.XS} role={TypographyRole.Text}>
              {ticket.id}
            </Typography>
          </Box>

          {isHigh && (
            <Box
              title="Высокий приоритет"
              sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: kit.red6, flexShrink: 0 }}
            />
          )}

          <IconButton
            size="small"
            sx={{ p: 0 }}
            onClick={(e) => { e.stopPropagation(); onToggleStar(ticket.id); }}
          >
            {ticket.starred
              ? <StarIcon     sx={{ fontSize: 14, color: kit.yellow6 }} />
              : <StarBorderIcon sx={{ fontSize: 14, color: kit.gray5  }} />}
          </IconButton>
        </Box>

        {/* Row 2: channel pill · status badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.875 }}>
          {/* Channel — small pill using kit colors */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.4,
            bgcolor: kit.gray3, border: `1px solid ${kit.gray4}`,
            borderRadius: '20px', px: 0.75, py: 0.3,
          }}>
            <Icon name={CHANNEL_ICON[ticket.channel]} size={11} color={kit.gray7} />
            <Typography size={TypographySize.Micro} role={TypographyRole.Text} color={TypographyColor.Secondary}>
              {CHANNEL_LABEL[ticket.channel]}
            </Typography>
          </Box>

          <Badge label={status.label} color={status.color} size={24} />
        </Box>

        {/* Description */}
        <Box sx={{
          fontSize: '0.8125rem',
          color: ticket.description ? kit.gray9 : kit.gray6,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: 58,
          fontFamily: 'Inter, sans-serif',
        }}>
          {ticket.description || (
            <Typography size={TypographySize.S} role={TypographyRole.Text} color={TypographyColor.Inactive}>
              Описание не указано
            </Typography>
          )}
        </Box>

        <Box sx={{ borderTop: `1px solid ${kit.gray4}`, my: 1 }} />

        {/* Client + Created */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 0.875 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography size={TypographySize.Micro} role={TypographyRole.Text} color={TypographyColor.Inactive}>
              Клиент
            </Typography>
            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Typography size={TypographySize.XS} role={TypographyRole.Text}>
                {ticket.client}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography size={TypographySize.Micro} role={TypographyRole.Text} color={TypographyColor.Inactive}>
              Создано
            </Typography>
            <Typography size={TypographySize.XS} role={TypographyRole.Text}>
              {ticket.created}
            </Typography>
          </Box>
        </Box>

        {/* Assignee + Team row */}
        <Box sx={{ minHeight: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            {ticket.status === 'Overdue' ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 13, color: kit.orange6 }} />
                <Typography size={TypographySize.XS} role={TypographyRole.Text} color={TypographyColor.Warning}>
                  Просрочено на 1д 4ч
                </Typography>
              </Box>
            ) : ticket.assignee ? (
              <UserAvatar
                firstName={ticket.assignee.firstName}
                lastName={ticket.assignee.lastName}
                size={24}
                viewMode="avatarRightText"
                backgroundColor={ticket.assignee.color}
              />
            ) : (
              <Typography size={TypographySize.XS} role={TypographyRole.Text} color={TypographyColor.Secondary}>
                Не назначен
              </Typography>
            )}
          </Box>

          {ticket.team && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', flexShrink: 0,
              height: 20, px: 0.875,
              bgcolor: ticket.team === 'Support 1' ? '#f3effc' : '#eefbf1',
              border: `1px solid ${ticket.team === 'Support 1' ? '#c4b5f4' : '#6ee7b7'}`,
              borderRadius: '6px',
            }}>
              <Box component="span" sx={{
                fontSize: '0.68rem', fontWeight: 600, lineHeight: 1,
                color: ticket.team === 'Support 1' ? '#7C5CBF' : '#059669',
                letterSpacing: '0.02em',
              }}>
                {ticket.team}
              </Box>
            </Box>
          )}
        </Box>

      </CardContent>
    </Card>
  );
}
