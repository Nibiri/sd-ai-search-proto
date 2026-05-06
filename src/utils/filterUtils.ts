import type { Ticket } from '../data/tickets';
import type { ActiveFilter } from '../components/FilterBar';
import type { RecognizedFilter } from '../components/SearchBar';

// ── Team assignments ──────────────────────────────────────────
export const TEAMS: Record<string, string[]> = {
  'Support 1': ['Ананьева', 'Иванов', 'Ковалёва'],
  'Support 2': ['Белова', 'Орлов', 'Дмитриева'],
};

export function getAssigneeTeam(ticket: Ticket): string | null {
  if (!ticket.assignee) return null;
  const lastName = ticket.assignee.lastName;
  for (const [team, members] of Object.entries(TEAMS)) {
    if (members.includes(lastName)) return team;
  }
  return null;
}

// Maps Russian display values back to English ticket field values
const EN_TYPE:   Record<string, string> = { 'Проблема': 'Problem', 'Жалоба': 'Complaint', 'Запрос': 'Request', 'Обращение': 'Appeal' };
const EN_STATUS: Record<string, string> = { 'В работе': 'In progress', 'Просрочено': 'Overdue', 'Назначено': 'Assigned', 'Новое': 'New', 'Закрыто': 'Closed' };
const EN_CHAN:   Record<string, string> = { 'Телефон': 'Phone', 'Чат': 'Chat' };
const EN_PRI:   Record<string, string> = { 'Высокий': 'high', 'Средний': 'medium', 'Низкий': 'low' };

export function matchesAIFilter(ticket: Ticket, filter: ActiveFilter): boolean {
  const key = filter.key;
  const val = filter.value;
  const valLower = val.toLowerCase();

  if (key === 'Type') {
    const enVal = EN_TYPE[val] ?? val;
    return ticket.type === enVal;
  }

  if (key === 'Status') {
    const enVal = EN_STATUS[val] ?? val;
    return ticket.status === enVal;
  }

  if (key === 'Channel') {
    const enVal = EN_CHAN[val] ?? val;
    return ticket.channel === enVal;
  }

  if (key === 'Priority') {
    const enVal = EN_PRI[val] ?? valLower;
    return ticket.priority === enVal;
  }

  if (key === 'Assignee') {
    if (!ticket.assignee) return false;
    const fullName = `${ticket.assignee.firstName} ${ticket.assignee.lastName}`;
    // legacy AI filter (maapaneva) or Russian name
    if (valLower === 'maapaneva' || valLower === 'me') {
      return ticket.assignee.lastName === 'Ананьева';
    }
    return fullName.toLowerCase().includes(valLower);
  }

  if (key === 'Team') {
    // prefer explicit team field; fallback to derived team from assignee
    const team = ticket.team ?? getAssigneeTeam(ticket);
    return team === val;
  }

  if (key === 'Period') {
    return true;
  }

  if (key === 'AIContext') {
    // Informational tag — no data field to match, always passes
    return true;
  }

  return true;
}

export function matchesTextSearch(ticket: Ticket, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const assigneeName = ticket.assignee
    ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`.toLowerCase()
    : '';
  return (
    ticket.id.toLowerCase().includes(q) ||
    ticket.description.toLowerCase().includes(q) ||
    ticket.client.toLowerCase().includes(q) ||
    assigneeName.includes(q)
  );
}

const RU_TYPE: Record<string, string> = {
  Type: 'Тип', Status: 'Статус', Assignee: 'Исполнитель',
  Channel: 'Канал', Priority: 'Приоритет', Period: 'Период',
};

const RU_VALUE: Record<string, string> = {
  Problem: 'Проблема', Complaint: 'Жалоба', Request: 'Запрос', Appeal: 'Обращение',
  'In progress': 'В работе', Overdue: 'Просрочено', Assigned: 'Назначено',
  New: 'Новое', Closed: 'Закрыто',
  Phone: 'Телефон', Email: 'Email', Chat: 'Чат',
  High: 'Высокий', Medium: 'Средний', Low: 'Низкий',
  // Assignee alias from AI parse
  maapaneva: 'Мария Ананьева',
};

export function toActiveFilter(f: RecognizedFilter): ActiveFilter {
  if (f.type === 'AIContext') {
    return { key: 'AIContext', label: 'AI', value: f.contextLabel ?? f.value };
  }
  const ruValue = RU_VALUE[f.value] ?? f.value;
  return {
    key:   f.type,
    label: RU_TYPE[f.type] ?? f.type,
    value: ruValue,
  };
}

export function countMatchingTickets(tickets: Ticket[], filters: RecognizedFilter[]): number {
  if (filters.length === 0) return tickets.length;
  return tickets.filter((t) =>
    filters.every((f) => matchesAIFilter(t, toActiveFilter(f)))
  ).length;
}
