import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Button,
  Input,
  Badge,
  Tabs,
  CardBlock,
  UserAvatar,
  Icon,
  Loader,
  Typography,
  TypographySize,
  TypographyRole,
  TypographyColor,
} from '../ui';
import type { IconName } from '../ui';
import { kit } from '../theme';
import logoBpmSrc from '../assets/logo-bpm.svg';
import designMdRaw from '../../DESIGN.md?raw';

// ─── layout helpers (plain HTML so no MUI dependency in sections) ─────────────

const Page = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minHeight: '100vh', background: kit.gray3, fontFamily: 'Inter, sans-serif' }}>
    {children}
  </div>
);

const Header = ({ onBack }: { onBack: () => void }) => (
  <div style={{
    background: '#fff',
    borderBottom: `1px solid ${kit.gray4}`,
    padding: '0 24px',
    height: 56,
    display: 'flex', alignItems: 'center', gap: 16,
    position: 'sticky', top: 0, zIndex: 10,
  }}>
    <img src={logoBpmSrc} alt="LogicBPM" style={{ height: 20 }} />
    <div style={{ flex: 1 }} />
    <Button text="← Назад" variant="secondary" onClick={onBack} />
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <CardBlock padding={24} borderRadius={16} style={{ marginBottom: 16 }}>
    <div style={{ marginBottom: 16 }}>
      <Typography size={TypographySize.M} role={TypographyRole.Heading}>
        {title}
      </Typography>
    </div>
    {children}
  </CardBlock>
);

const Row = ({ label, children, wrap }: { label?: string; children: React.ReactNode; wrap?: boolean }) => (
  <div style={{ marginBottom: 20 }}>
    {label && (
      <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: kit.gray7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
    )}
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: wrap ? 'wrap' : 'nowrap' }}>
      {children}
    </div>
  </div>
);

// ─── Color swatch ─────────────────────────────────────────────────────────────

const Swatch = ({ color, name }: { color: string; name: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    <div style={{
      width: 40, height: 40, borderRadius: 8,
      background: color,
      border: `1px solid ${kit.gray4}`,
    }} />
    <span style={{ fontSize: 10, color: kit.gray7 }}>{name}</span>
    <span style={{ fontSize: 9, color: kit.gray6 }}>{color}</span>
  </div>
);

// ─── Icon tile ────────────────────────────────────────────────────────────────

const IconTile = ({ name }: { name: IconName }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    padding: '10px 8px', borderRadius: 8,
    border: `1px solid ${kit.gray4}`,
    minWidth: 72, background: '#fff',
  }}>
    <Icon name={name} size={20} color={kit.gray9} />
    <span style={{ fontSize: 9, color: kit.gray7, textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-all' }}>{name}</span>
  </div>
);

// ─── DesignSystemPage ─────────────────────────────────────────────────────────

const SHOWCASE_ICONS: IconName[] = [
  'DogAi', 'Send', 'Search', 'Bell', 'Settings', 'User', 'Users',
  'Plus', 'Close', 'Check', 'Edit', 'Trash', 'Star', 'Heart',
  'MessageSquare', 'MessageCircle', 'Mail', 'Phone', 'Calendar',
  'File', 'Folder', 'Upload', 'Download', 'Filter', 'MoreHorizontal',
  'ChevronDown', 'ChevronRight', 'ArrowLeft', 'ArrowRight',
  'AlertCircle', 'Info', 'CheckCircle', 'XCircle',
  'Ticket', 'Headset', 'Workflow', 'BarChart',
];

// ─── DESIGN.md viewer ─────────────────────────────────────────────────────────

const mdStyles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    lineHeight: 1.7,
    color: kit.gray10,
    maxWidth: 860,
  },
};

function DesignMdViewer() {
  return (
    <CardBlock padding={32} borderRadius={16} style={{ marginBottom: 24 }}>
      <div style={mdStyles.root}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 style={{ fontSize: 26, fontWeight: 700, color: kit.gray10, margin: '0 0 8px', lineHeight: 1.3 }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ fontSize: 19, fontWeight: 600, color: kit.gray10, margin: '32px 0 10px', paddingBottom: 6, borderBottom: `2px solid ${kit.gray4}` }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: 15, fontWeight: 600, color: kit.gray9, margin: '20px 0 8px' }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p style={{ margin: '0 0 12px', color: kit.gray10 }}>{children}</p>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{
                margin: '16px 0', padding: '10px 16px',
                borderLeft: `4px solid ${kit.purple5}`,
                background: kit.purple1,
                borderRadius: '0 8px 8px 0',
                color: kit.gray8,
                fontSize: 13,
              }}>{children}</blockquote>
            ),
            code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
              inline ? (
                <code style={{
                  background: kit.gray3, padding: '2px 6px', borderRadius: 4,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: 12, color: kit.purple7,
                }}>{children}</code>
              ) : (
                <code>{children}</code>
              ),
            pre: ({ children }) => (
              <pre style={{
                background: kit.gray10, color: '#e8eaeb',
                padding: '16px 20px', borderRadius: 10,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 12, lineHeight: 1.6,
                overflow: 'auto', margin: '12px 0 16px',
              }}>{children}</pre>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead style={{ background: kit.purple1 }}>{children}</thead>
            ),
            th: ({ children }) => (
              <th style={{
                padding: '8px 14px', textAlign: 'left',
                fontWeight: 600, color: kit.purple7,
                borderBottom: `2px solid ${kit.purple3}`,
                whiteSpace: 'nowrap',
              }}>{children}</th>
            ),
            td: ({ children }) => (
              <td style={{
                padding: '7px 14px',
                borderBottom: `1px solid ${kit.gray4}`,
                verticalAlign: 'top',
              }}>{children}</td>
            ),
            tr: ({ children }) => (
              <tr style={{ transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = kit.gray2)}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >{children}</tr>
            ),
            ul: ({ children }) => (
              <ul style={{ paddingLeft: 20, margin: '0 0 12px', color: kit.gray10 }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{ paddingLeft: 20, margin: '0 0 12px' }}>{children}</ol>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: 4 }}>{children}</li>
            ),
            hr: () => (
              <hr style={{ border: 'none', borderTop: `1px solid ${kit.gray4}`, margin: '24px 0' }} />
            ),
            a: ({ href, children }) => (
              <a href={href} style={{ color: kit.blue5, textDecoration: 'underline' }}>{children}</a>
            ),
            em: ({ children }) => (
              <em style={{ color: kit.gray8 }}>{children}</em>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: 600, color: kit.gray10 }}>{children}</strong>
            ),
          }}
        >
          {designMdRaw}
        </ReactMarkdown>
      </div>
    </CardBlock>
  );
}

// ─── DesignSystemPage ─────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  const navigate = useNavigate();
  const [topTab, setTopTab] = useState<'kit' | 'design'>('kit');
  const [tabH, setTabH] = useState('messages');
  const [tabD, setTabD] = useState('all');
  const [inputVal, setInputVal] = useState('');
  const [inputErr, setInputErr] = useState('');

  return (
    <Page>
      <Header onBack={() => navigate('/')} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>

        {/* Title + top tab switch */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Typography size={TypographySize.XL} role={TypographyRole.Heading}>
              {topTab === 'kit' ? 'LogicBPM UI Kit' : 'DESIGN.md'}
            </Typography>
            <div style={{ marginTop: 4 }}>
              <Typography size={TypographySize.M} role={TypographyRole.Text} color={TypographyColor.Secondary}>
                {topTab === 'kit'
                  ? 'v1.9.12 — компонентная библиотека'
                  : 'Design system guide for AI agents'}
              </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              text="UI Kit"
              variant={topTab === 'kit' ? 'primary' : 'secondary'}
              onClick={() => setTopTab('kit')}
            />
            <Button
              text="DESIGN.md"
              variant={topTab === 'design' ? 'primary' : 'secondary'}
              onClick={() => setTopTab('design')}
              iconName="File"
              iconPosition="left"
            />
          </div>
        </div>

        {topTab === 'design' && <DesignMdViewer />}

        {topTab === 'kit' && <>

        {/* ── BORDER RADIUS ── */}
        <Section title="Border Radius">
          <div style={{ marginBottom: 12, fontSize: 13, color: kit.gray7 }}>
            Soft, generous rounding. Buttons at 16px, inputs at 8px, cards at 16–28px, avatars and search pills fully round.
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {([
              { label: 'none', value: 0,    size: 72 },
              { label: 'xs',   value: 4,    size: 72 },
              { label: 'sm',   value: 8,    size: 72 },
              { label: 'md',   value: 16,   size: 72 },
              { label: 'lg',   value: 20,   size: 72 },
              { label: 'xl',   value: 28,   size: 72 },
              { label: 'full', value: 9999, size: 72 },
            ] as const).map(({ label, value, size }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: size, height: size,
                  borderRadius: value,
                  background: kit.gray2,
                  border: `1px solid ${kit.gray5}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: kit.gray7, fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  gap: 4,
                }}>
                  <span style={{ fontWeight: 600, color: kit.gray9 }}>{value === 9999 ? '∞' : value}</span>
                  <span style={{ color: kit.gray5 }}>·</span>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── COLORS ── */}
        <Section title="Цвета">
          <Row label="Purple">
            {(['purple1','purple2','purple3','purple4','purple5','purple6','purple7','purple8'] as const).map((k) => (
              <Swatch key={k} color={kit[k]} name={k} />
            ))}
          </Row>
          <Row label="Gray">
            {(['gray1','gray2','gray3','gray4','gray5','gray6','gray7','gray8','gray9','gray10'] as const).map((k) => (
              <Swatch key={k} color={kit[k]} name={k} />
            ))}
          </Row>
          <Row label="Semantic" wrap>
            <Swatch color={kit.red6}    name="red6 / error"   />
            <Swatch color={kit.green6}  name="green6 / success" />
            <Swatch color={kit.green1}  name="green1"         />
            <Swatch color={kit.orange6} name="orange6 / warn" />
            <Swatch color={kit.orange1} name="orange1"        />
            <Swatch color={kit.yellow6} name="yellow6"        />
          </Row>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section title="Typography">
          {([
            [TypographySize.XL, 'XL'],
            [TypographySize.L,  'L'],
            [TypographySize.M,  'M'],
            [TypographySize.S,  'S'],
            [TypographySize.XS, 'XS'],
            [TypographySize.Micro, 'Micro'],
          ] as const).map(([size, label]) => (
            <div key={label} style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginBottom: 8, borderBottom: `1px solid ${kit.gray3}`, paddingBottom: 8 }}>
              <span style={{ width: 40, fontSize: 11, color: kit.gray6 }}>{label}</span>
              <Typography size={size} role={TypographyRole.Heading}>
                Заголовок
              </Typography>
              <Typography size={size} role={TypographyRole.Text}>
                Текст основной
              </Typography>
              <Typography size={size} role={TypographyRole.Text} color={TypographyColor.Secondary}>
                Вторичный текст
              </Typography>
              <Typography size={size} role={TypographyRole.Link}>
                Ссылка
              </Typography>
            </div>
          ))}
        </Section>

        {/* ── BUTTONS ── */}
        <Section title="Button">
          <Row label="Variants">
            <Button text="Primary"         variant="primary"         onClick={() => {}} />
            <Button text="Secondary"       variant="secondary"       onClick={() => {}} />
            <Button text="Tertiary"        variant="tertiary"        onClick={() => {}} />
            <Button text="Operation"       variant="operation"       onClick={() => {}} />
            <Button text="Link"            variant="link"            onClick={() => {}} />
          </Row>
          <Row label="States">
            <Button text="Loading"   variant="primary"  loading onClick={() => {}} />
            <Button text="Disabled"  variant="primary"  isDisabled onClick={() => {}} />
            <Button text="Disabled"  variant="secondary" isDisabled onClick={() => {}} />
          </Row>
          <Row label="Semantic">
            <Button text="Primary Error"   variant="primaryError"     onClick={() => {}} />
            <Button text="Secondary Error" variant="secondaryError"   onClick={() => {}} />
            <Button text="Accept"          variant="secondaryAccept"  onClick={() => {}} />
          </Row>
          <Row label="With icons">
            <Button text="AI помощник" variant="primary"    iconName="DogAi"  iconPosition="left"  onClick={() => {}} />
            <Button text="Отправить"   variant="primary"    iconName="Send"   iconPosition="right" onClick={() => {}} />
            <Button text="Добавить"    variant="secondary"  iconName="Plus"   iconPosition="left"  onClick={() => {}} />
            <Button text="Удалить"     variant="secondaryError" iconName="Trash" iconPosition="left" onClick={() => {}} />
          </Row>
        </Section>

        {/* ── INPUT ── */}
        <Section title="Input">
          <Row label="Default">
            <div style={{ width: 280 }}>
              <Input value={inputVal} onChange={setInputVal} placeholder="Введите текст..." />
            </div>
          </Row>
          <Row label="Error">
            <div style={{ width: 280 }}>
              <Input value={inputErr} onChange={setInputErr} placeholder="Неверный формат" status="error" statusText="Обязательное поле" />
            </div>
          </Row>
          <Row label="Warning">
            <div style={{ width: 280 }}>
              <Input value="" onChange={() => {}} placeholder="Проверьте данные" status="warning" statusText="Данные устарели" />
            </div>
          </Row>
          <Row label="Disabled">
            <div style={{ width: 280 }}>
              <Input value="Нередактируемое" onChange={() => {}} disabled />
            </div>
          </Row>
        </Section>

        {/* ── BADGE ── */}
        <Section title="Badge">
          <Row label="Colors" wrap>
            {(['purple','green','blue','red','orange','yellow','gray','neutral','error','success'] as const).map((color) => (
              <Badge key={color} label={color} color={color} size={24} />
            ))}
          </Row>
          <Row label="Sizes">
            <Badge label="52px" color="purple" size={52} />
            <Badge label="40px" color="purple" size={40} />
            <Badge label="32px" color="purple" size={32} />
            <Badge label="24px" color="purple" size={24} />
          </Row>
          <Row label="With icons">
            <Badge label="С иконкой" color="purple" size={32} iconName="DogAi" iconPosition="left" />
            <Badge label="Тикет"     color="blue"   size={32} iconName="Ticket" iconPosition="left" />
            <Badge label="Успешно"   color="green"  size={32} iconName="Check"  iconPosition="left" />
            <Badge label="Ошибка"    color="red"    size={32} iconName="AlertCircle" iconPosition="left" />
          </Row>
        </Section>

        {/* ── TABS ── */}
        <Section title="Tabs">
          <Row label="Horizontal">
            <div style={{ width: '100%' }}>
              <Tabs
                view="horizontal"
                activeTab={tabH}
                onChange={setTabH}
                tabs={[
                  { id: 'messages', label: 'Сообщения', content: (
                    <div style={{ padding: '16px 0', color: kit.gray7, fontSize: 14 }}>
                      Контент вкладки «Сообщения»
                    </div>
                  )},
                  { id: 'tickets', label: 'Обращения', content: (
                    <div style={{ padding: '16px 0', color: kit.gray7, fontSize: 14 }}>
                      Контент вкладки «Обращения»
                    </div>
                  )},
                  { id: 'reports', label: 'Отчёты', disabled: true, content: null },
                ]}
              />
            </div>
          </Row>
          <Row label="Deep (pill-style)">
            <Tabs
              view="deep"
              activeTab={tabD}
              onChange={setTabD}
              tabs={[
                { id: 'all',      label: 'Все',         icon: <Icon name="Ticket" size={16} /> },
                { id: 'active',   label: 'Активные',    icon: <Icon name="Activity" size={16} /> },
                { id: 'closed',   label: 'Закрытые',    icon: <Icon name="CheckCircle" size={16} /> },
              ]}
            />
          </Row>
        </Section>

        {/* ── CARD BLOCK ── */}
        <Section title="CardBlock">
          <Row label="Variants" wrap>
            <div style={{ background: kit.gray3, padding: 12, borderRadius: 16 }}>
              <CardBlock padding={16} borderRadius={12}>
                <div style={{ fontSize: 14, color: kit.gray10 }}>Карточка по умолчанию</div>
                <div style={{ fontSize: 12, color: kit.gray7, marginTop: 4 }}>padding=16, borderRadius=12</div>
                <div style={{ fontSize: 11, color: kit.gray6, marginTop: 2 }}>bg=white, border=gray-4</div>
              </CardBlock>
            </div>
            <CardBlock padding={16} borderRadius={24} background={kit.purple1}>
              <div style={{ fontSize: 14, color: kit.purple8 }}>Карточка с цветным фоном</div>
              <div style={{ fontSize: 12, color: kit.purple7, marginTop: 4 }}>background=purple1</div>
            </CardBlock>
            <CardBlock padding={16} borderRadius={12} background={kit.green1}>
              <div style={{ fontSize: 14, color: kit.green6 }}>Успешное состояние</div>
              <div style={{ fontSize: 12, color: kit.green6, marginTop: 4 }}>background=green1</div>
            </CardBlock>
          </Row>
        </Section>

        {/* ── USER AVATAR ── */}
        <Section title="UserAvatar">
          <Row label="Sizes">
            <UserAvatar firstName="Мария" lastName="Ананьева" size={100} viewMode="avatarOnly" />
            <UserAvatar firstName="Мария" lastName="Ананьева" size={40}  viewMode="avatarOnly" />
            <UserAvatar firstName="Мария" lastName="Ананьева" size={32}  viewMode="avatarOnly" />
            <UserAvatar firstName="Мария" lastName="Ананьева" size={24}  viewMode="avatarOnly" />
          </Row>
          <Row label="With status">
            <UserAvatar firstName="Мария" lastName="Ананьева" size={40} withStatus userStatus="active" />
            <UserAvatar firstName="Алексей" lastName="Иванов" size={40} withStatus userStatus="busy" />
            <UserAvatar firstName="Ольга" lastName="Петрова" size={40} withStatus userStatus="break" />
          </Row>
          <Row label="With text">
            <UserAvatar firstName="Мария" lastName="Ананьева" size={40} viewMode="avatarRightText" subtitle="Дизайнер" />
            <UserAvatar firstName="Алексей" lastName="Иванов" size={40} viewMode="avatarRightText" subtitle="Разработчик" />
          </Row>
        </Section>

        {/* ── LOADER ── */}
        <Section title="Loader">
          <Row label="Sizes и цвета">
            <Loader size={16} color={kit.purple6} />
            <Loader size={24} color={kit.purple6} />
            <Loader size={32} color={kit.purple6} />
            <Loader size={48} color={kit.purple6} />
            <Loader size={32} color={kit.green6} />
            <Loader size={32} color={kit.gray6} />
          </Row>
        </Section>

        {/* ── ICONS ── */}
        <Section title="Icons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SHOWCASE_ICONS.map((name) => <IconTile key={name} name={name} />)}
          </div>
        </Section>

        </>}

      </div>
    </Page>
  );
}
