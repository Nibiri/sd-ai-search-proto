import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, IconButton, Avatar, Divider,
  Chip, AppBar, Toolbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import { Input, Button as KitButton, Icon } from '../ui';
import logoBpmSrc from '../assets/logo-bpm.svg';
import { kit } from '../theme';
import { CONVERSATIONS, type Conversation, type ConvStatus, type Message } from '../data/conversations';

type Variant = 'A' | 'B' | 'C';

// ─── helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  in_progress: 'В работе',
  new: 'Новая',
  closed: 'Закрыта',
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  in_progress: { bg: kit.green1,   text: kit.green6  },
  new:         { bg: kit.purple1,  text: kit.purple7 },
  closed:      { bg: kit.gray3,    text: kit.gray7   },
};

// ─── shared sub-pieces ────────────────────────────────────────────────────────

const STATUS_DOT: Record<ConvStatus, string> = {
  in_progress: kit.green6,
  new:         kit.purple6,
  closed:      kit.gray5,
};

function UnreadBadge({ count }: { count: number }) {
  return (
    <Box sx={{
      flexShrink: 0,
      minWidth: 20, height: 20, borderRadius: '10px',
      bgcolor: kit.purple6, color: '#fff',
      fontSize: '0.62rem', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      px: 0.75,
    }}>
      {count > 999 ? '999+' : count}
    </Box>
  );
}

function StatusChip({ status }: { status: ConvStatus }) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      size="small"
      sx={{
        height: 20, fontSize: '0.65rem', borderRadius: '6px',
        fontWeight: 500, flexShrink: 0,
        bgcolor: STATUS_COLOR[status]?.bg,
        color: STATUS_COLOR[status]?.text,
      }}
    />
  );
}

// ─── ConversationItem ─────────────────────────────────────────────────────────

function ConversationItem({
  conv, active, onClick, variant = 'A',
}: { conv: Conversation; active: boolean; onClick: () => void; variant?: Variant }) {
  const numStr = String(conv.number);
  const rowBase = {
    display: 'flex', alignItems: 'flex-start', gap: 1.5,
    px: 2, py: 1.5,
    cursor: 'pointer',
    bgcolor: active ? kit.purple1 : 'transparent',
    borderRight: `3px solid ${active ? kit.purple6 : 'transparent'}`,
    transition: 'background 0.15s',
    '&:hover': { bgcolor: active ? kit.purple1 : kit.gray3 },
  };

  // ── Variant A: статус-точка на аватаре + бейдж отдельно ───────────────────
  if (variant === 'A') {
    return (
      <Box onClick={onClick} sx={rowBase}>
        {/* Avatar с точкой статуса */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          <Avatar sx={{
            width: 40, height: 40,
            bgcolor: active ? kit.purple6 : kit.purple2,
            color: active ? '#fff' : kit.purple8,
            fontSize: '0.65rem', fontWeight: 700,
          }}>
            {numStr}
          </Avatar>
          {conv.status && (
            <Box sx={{
              position: 'absolute', bottom: 1, right: 1,
              width: 10, height: 10, borderRadius: '50%',
              bgcolor: STATUS_DOT[conv.status],
              border: `2px solid ${active ? kit.purple1 : '#fff'}`,
            }} />
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: kit.gray10 }}>
              {conv.number}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, ml: 1 }}>
              {conv.unread ? <UnreadBadge count={conv.unread} /> : null}
              <Typography sx={{ fontSize: '0.72rem', color: kit.gray6 }}>
                {conv.time}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{
            fontSize: '0.8rem', color: kit.gray7, lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {conv.preview}
          </Typography>
        </Box>
      </Box>
    );
  }

  // ── Variant B: статус в первой строке + бейдж во второй ───────────────────
  if (variant === 'B') {
    return (
      <Box onClick={onClick} sx={rowBase}>
        <Avatar sx={{
          width: 40, height: 40, flexShrink: 0,
          bgcolor: active ? kit.purple6 : kit.purple2,
          color: active ? '#fff' : kit.purple8,
          fontSize: '0.65rem', fontWeight: 700,
        }}>
          {numStr}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Строка 1: номер + статус-чип + время */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.4 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: kit.gray10 }}>
              {conv.number}
            </Typography>
            {conv.status && <StatusChip status={conv.status} />}
            <Typography sx={{ fontSize: '0.72rem', color: kit.gray6, ml: 'auto', flexShrink: 0 }}>
              {conv.time}
            </Typography>
          </Box>
          {/* Строка 2: превью + бейдж */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
            <Typography sx={{
              fontSize: '0.8rem', color: kit.gray7, lineHeight: 1.4,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              flex: 1, minWidth: 0,
            }}>
              {conv.preview}
            </Typography>
            {conv.unread ? <UnreadBadge count={conv.unread} /> : null}
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Variant C: секции по статусу — на айтеме только бейдж ─────────────────
  return (
    <Box onClick={onClick} sx={rowBase}>
      <Avatar sx={{
        width: 40, height: 40, flexShrink: 0,
        bgcolor: active ? kit.purple6 : kit.purple2,
        color: active ? '#fff' : kit.purple8,
        fontSize: '0.65rem', fontWeight: 700,
      }}>
        {numStr}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: kit.gray10 }}>
            {conv.number}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, ml: 1 }}>
            {conv.unread ? <UnreadBadge count={conv.unread} /> : null}
            <Typography sx={{ fontSize: '0.72rem', color: kit.gray6 }}>
              {conv.time}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{
          fontSize: '0.8rem', color: kit.gray7, lineHeight: 1.4,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {conv.preview}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── SectionHeader (для варианта C) ──────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <Box sx={{ px: 2, pt: 1.5, pb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: kit.gray6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Box sx={{
        minWidth: 18, height: 18, borderRadius: '9px',
        bgcolor: kit.gray4, color: kit.gray7,
        fontSize: '0.62rem', fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', px: 0.5,
      }}>
        {count}
      </Box>
    </Box>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isClient = msg.sender === 'client';
  const isAI = msg.sender === 'ai';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isClient ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: 1, mb: 2,
    }}>
      {!isClient && (
        <Avatar sx={{
          width: 28, height: 28, flexShrink: 0,
          bgcolor: isAI ? kit.purple6 : kit.gray4,
          color: isAI ? '#fff' : kit.gray8,
          fontSize: '0.7rem',
        }}>
          {isAI ? <Icon name="DogAi" size={16} color="#fff" /> : 'П'}
        </Avatar>
      )}

      <Box sx={{ maxWidth: '68%' }}>
        {!isClient && (
          <Typography sx={{ fontSize: '0.7rem', color: kit.gray6, mb: 0.3, ml: 0.5 }}>
            {msg.name || (isAI ? 'AI помощник' : 'Поддержка')}
          </Typography>
        )}
        <Box sx={{
          px: 1.75, py: 1,
          borderRadius: isClient ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          bgcolor: isClient ? kit.purple1 : isAI ? kit.gray3 : kit.gray3,
          border: isClient ? `1px solid ${kit.purple3}` : !isAI ? `1px solid ${kit.gray4}` : 'none',
        }}>
          <Typography sx={{
            fontSize: '0.875rem',
            color: kit.gray10,
            lineHeight: 1.55, whiteSpace: 'pre-wrap',
          }}>
            {msg.text}
          </Typography>
        </Box>
        <Typography sx={{
          fontSize: '0.67rem', color: kit.gray6, mt: 0.3,
          textAlign: isClient ? 'right' : 'left', mx: 0.5,
        }}>
          {msg.time}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── MessageInput ─────────────────────────────────────────────────────────────

function MessageInput({
  placeholder = 'Описание проблемы...',
  onSend,
  disabled,
}: {
  placeholder?: string;
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState('');
  const canSend = value.trim() && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <Box sx={{
      px: 2, py: 1.5,
      borderTop: `1px solid ${kit.gray4}`,
      bgcolor: kit.gray1, flexShrink: 0,
    }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {/* Attachment icon */}
        <IconButton size="small" sx={{ color: kit.gray6, flexShrink: 0, '&:hover': { color: kit.gray8, bgcolor: kit.gray3 } }}>
          <Icon name="Paperclip" size={18} color="currentColor" />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Input
            value={value}
            onChange={(v) => setValue(v)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={placeholder}
          />
        </Box>
        <KitButton
          text="Отправить"
          variant="primary"
          onClick={handleSend}
          isDisabled={!canSend}
          iconName="Send"
          iconPosition="right"
        />
      </Box>
    </Box>
  );
}

// ─── ChatPanel ────────────────────────────────────────────────────────────────

function ChatPanel({ conv }: { conv: Conversation }) {
  const [messages, setMessages] = useState<Message[]>(conv.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages(conv.messages); }, [conv.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, {
      id: `m${Date.now()}`, sender: 'client', text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  const statusColor = conv.status ? STATUS_COLOR[conv.status] : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: 3, height: 56,
        borderBottom: `1px solid ${kit.gray4}`,
        bgcolor: kit.gray1, flexShrink: 0,
      }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: kit.gray10, flex: 1 }}>
          {conv.number}
        </Typography>
        {conv.status && (
          <Box sx={{
            px: 1.25, height: 24, borderRadius: '6px',
            display: 'inline-flex', alignItems: 'center',
            bgcolor: STATUS_COLOR[conv.status]?.bg,
            fontSize: '0.72rem', fontWeight: 500,
            color: STATUS_COLOR[conv.status]?.text,
            flexShrink: 0,
          }}>
            {STATUS_LABEL[conv.status]}
          </Box>
        )}
      </Box>

      {/* messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
        {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </Box>

      <MessageInput onSend={handleSend} />
    </Box>
  );
}

// ─── AiChatPanel ──────────────────────────────────────────────────────────────

const AI_REPLIES = [
  'Понял вас! Дайте мне секунду, я проверю информацию по вашему запросу.',
  'Это распространённая ситуация. Могу предложить несколько вариантов решения — уточните детали?',
  'Отличный вопрос! Рекомендую проверить раздел настроек в вашем профиле.',
  'Нашёл связанную статью в базе знаний. Хотите, пришлю ссылку?',
  'Если это не помогло, я могу создать обращение в службу поддержки прямо сейчас.',
  'По вашему запросу нашёл несколько похожих решений. Давайте попробуем по порядку.',
];

function AiChatPanel() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'ai-intro', sender: 'ai', name: 'AI помощник',
    text: 'Здравствуйте! Я AI помощник LogicBPM.\nЗдесь вы найдёте ответы на интересующие вас вопросы. Чем могу помочь?',
    time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking]);

  const handleSend = (text: string) => {
    setMessages((prev) => [...prev, {
      id: `u${Date.now()}`, sender: 'client', text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [...prev, {
        id: `ai${Date.now()}`, sender: 'ai', name: 'AI помощник',
        text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)],
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        px: 3, py: 2,
        borderBottom: `1px solid ${kit.gray4}`,
        bgcolor: kit.gray1, flexShrink: 0,
      }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: kit.purple6 }}>
          <Icon name="DogAi" size={22} color="#fff" />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: kit.gray10 }}>
            AI помощник
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: kit.green6 }} />
            <Typography sx={{ fontSize: '0.72rem', color: kit.green6 }}>Онлайн</Typography>
          </Box>
        </Box>
      </Box>

      {/* messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>
        {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}

        {/* typing indicator */}
        {thinking && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: kit.purple6 }}>
              <Icon name="DogAi" size={16} color="#fff" />
            </Avatar>
            <Box sx={{ px: 1.75, py: 1.25, borderRadius: '16px 16px 16px 4px', bgcolor: kit.purple1 }}>
              <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', height: 16 }}>
                {[0, 1, 2].map((i) => (
                  <Box key={i} sx={{
                    width: 6, height: 6, borderRadius: '50%', bgcolor: kit.purple5,
                    animation: 'dotBounce 1.2s infinite ease-in-out',
                    animationDelay: `${i * 0.2}s`,
                    '@keyframes dotBounce': {
                      '0%, 80%, 100%': { transform: 'translateY(0)' },
                      '40%': { transform: 'translateY(-5px)' },
                    },
                  }} />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      <MessageInput
        placeholder="Задайте вопрос AI помощнику..."
        onSend={handleSend}
        disabled={thinking}
      />
    </Box>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ onAiChat, onNewTicket }: { onAiChat: () => void; onNewTicket: () => void }) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 2.5,
    }}>
      <Box sx={{
        width: 64, height: 64, borderRadius: '20px',
        bgcolor: kit.gray3, border: `1px solid ${kit.gray4}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <HeadsetMicOutlinedIcon sx={{ fontSize: 28, color: kit.gray6 }} />
      </Box>
      <Typography sx={{ fontSize: '0.9375rem', color: kit.gray7 }}>
        Выберите обращение и оно отобразится здесь
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <KitButton
          text="AI помощник"
          variant="primary"
          iconName="DogAi"
          iconPosition="left"
          onClick={onAiChat}
        />
        <KitButton
          text="Написать в поддержку"
          variant="secondary"
          onClick={onNewTicket}
        />
      </Box>
    </Box>
  );
}

// ─── ClientPortalPage ─────────────────────────────────────────────────────────

export default function ClientPortalPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>('A');

  const handleSelectConv = (conv: Conversation) => {
    setSelected(conv);
    setAiOpen(false);
  };

  const handleOpenAi = () => {
    setSelected(null);
    setAiOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── AppBar ── */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ minHeight: 56, px: { xs: 2, sm: 3 }, gap: 1.5 }}>
          {/* Logo */}
          <Box sx={{ flex: 1 }}>
            <Box
              component="img"
              src={logoBpmSrc}
              alt="LogicBPM"
              sx={{ height: 20, display: 'block' }}
            />
          </Box>

          {/* User avatar */}
          <Avatar sx={{
            width: 34, height: 34,
            bgcolor: kit.purple6, color: '#fff',
            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
          }}>
            КГ
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* ── Body ── */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left sidebar ── */}
        <Box sx={{
          width: 340, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          bgcolor: kit.gray1,
          borderRight: `1px solid ${kit.gray4}`,
          overflow: 'hidden',
        }}>
          {/* AI card */}
          <Box
            onClick={handleOpenAi}
            sx={{
              display: 'flex', alignItems: 'flex-start', gap: 1.5,
              mx: 2, mt: 2, px: 2, py: 1.5,
              borderRadius: '12px',
              bgcolor: aiOpen ? kit.purple1 : kit.gray2,
              border: `1px solid ${aiOpen ? kit.purple3 : kit.gray4}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
              '&:hover': { bgcolor: kit.purple1, borderColor: kit.purple3 },
            }}
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: kit.purple6, flexShrink: 0 }}>
              <Icon name="DogAi" size={24} color="#fff" />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: kit.gray10, mb: 0.25 }}>
                AI помощник
              </Typography>
              <Typography sx={{ fontSize: '0.77rem', color: kit.gray7, lineHeight: 1.4 }}>
                Здесь вы найдёте все ответы на интересующие вас вопросы
              </Typography>
            </Box>
          </Box>

          {/* List header */}
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2.5, pb: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: kit.gray10, flex: 1 }}>
              Список обращений
            </Typography>
            <IconButton size="small" sx={{ color: kit.gray7, '&:hover': { bgcolor: kit.gray3 } }}>
              <SearchIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton size="small" sx={{ color: kit.gray7, '&:hover': { bgcolor: kit.gray3 } }}>
              <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Divider />

          {/* Conversations */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {variant === 'C' ? (
              <>
                {/* Группа: с непрочитанными */}
                {CONVERSATIONS.filter(c => c.unread).length > 0 && (
                  <>
                    <SectionHeader
                      label="Новые сообщения"
                      count={CONVERSATIONS.filter(c => c.unread).length}
                    />
                    {CONVERSATIONS.filter(c => c.unread).map((conv) => (
                      <ConversationItem
                        key={conv.id} conv={conv} variant="C"
                        active={selected?.id === conv.id}
                        onClick={() => handleSelectConv(conv)}
                      />
                    ))}
                    <Divider sx={{ my: 0.5 }} />
                  </>
                )}
                {/* Группа: В работе */}
                {CONVERSATIONS.filter(c => !c.unread && c.status === 'in_progress').length > 0 && (
                  <>
                    <SectionHeader
                      label="В работе"
                      count={CONVERSATIONS.filter(c => !c.unread && c.status === 'in_progress').length}
                    />
                    {CONVERSATIONS.filter(c => !c.unread && c.status === 'in_progress').map((conv) => (
                      <ConversationItem
                        key={conv.id} conv={conv} variant="C"
                        active={selected?.id === conv.id}
                        onClick={() => handleSelectConv(conv)}
                      />
                    ))}
                    <Divider sx={{ my: 0.5 }} />
                  </>
                )}
                {/* Группа: Закрытые */}
                {CONVERSATIONS.filter(c => c.status === 'closed').length > 0 && (
                  <>
                    <SectionHeader
                      label="Закрытые"
                      count={CONVERSATIONS.filter(c => c.status === 'closed').length}
                    />
                    {CONVERSATIONS.filter(c => c.status === 'closed').map((conv) => (
                      <ConversationItem
                        key={conv.id} conv={conv} variant="C"
                        active={selected?.id === conv.id}
                        onClick={() => handleSelectConv(conv)}
                      />
                    ))}
                  </>
                )}
              </>
            ) : (
              CONVERSATIONS.map((conv) => (
                <ConversationItem
                  key={conv.id} conv={conv} variant={variant}
                  active={selected?.id === conv.id}
                  onClick={() => handleSelectConv(conv)}
                />
              ))
            )}
          </Box>
        </Box>

        {/* ── Right panel ── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: kit.gray1 }}>
          {aiOpen ? (
            <AiChatPanel />
          ) : selected ? (
            <ChatPanel conv={selected} />
          ) : (
            <EmptyState onAiChat={handleOpenAi} onNewTicket={() => {}} />
          )}
        </Box>

      </Box>
    </Box>
  );
}
