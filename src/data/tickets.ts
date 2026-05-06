export type TicketChannel = 'Phone' | 'Email' | 'Chat';
export type TicketStatus =
  | 'In progress'
  | 'Assigned'
  | 'Overdue'
  | 'New'
  | 'Closed';
export type TicketPriority = 'high' | 'medium' | 'low';
export type TicketType = 'Problem' | 'Complaint' | 'Request' | 'Appeal';

export interface Ticket {
  id: string;
  type: TicketType;
  priority: TicketPriority;
  starred: boolean;
  channel: TicketChannel;
  status: TicketStatus;
  description: string;
  client: string;
  created: string;
  assignee?: { firstName: string; lastName: string; color: string };
  team?: string;
}

const ME = { firstName: 'Мария', lastName: 'Ананьева', color: '#7C5CBF' };

export const TICKETS: Ticket[] = [
  // ── Мои заявки ────────────────────────────────────────────
  {
    id: 'SD-21786', type: 'Problem', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Р-Кипер: терминал на стойке не проводит безналичную оплату — «Ошибка эквайринга 05». Наличка проходит.',
    client: 'Шашлычный Дворик — Москва', created: '16.04.2026 20:12', assignee: ME, team: 'Support 1',
  },
  {
    id: 'SD-21802', type: 'Problem', priority: 'high', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'KDS-экраны на кухне зависли на вчерашних заказах, перезагрузка не помогает. Три точки не работают.',
    client: 'Тандыр Хаус — 8 точек, Москва', created: '18.04.2026 09:41', assignee: ME, team: 'Support 1',
  },
  {
    id: 'SD-21823', type: 'Request', priority: 'high', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Заказы из Яндекс.Еды и Delivery Club не попадают в KDS с вчерашнего вечера. Агрегатор пишет об успешной отправке.',
    client: 'Суши Матсури — Санкт-Петербург', created: '19.04.2026 13:22', assignee: ME, team: 'Support 1',
  },
  {
    id: 'SD-21826', type: 'Appeal', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Ежедневный X-отчёт экспортирует нули по чаевым — бухгалтерия не может закрыть смену.',
    client: 'Причал 47 — Владивосток', created: '19.04.2026 16:47', assignee: ME, team: 'Support 1',
  },
  {
    id: 'SD-21830', type: 'Problem', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Принтер чеков за барной стойкой обрезает последние 3 строки. Р-Кипер 8.1.1.',
    client: 'Тимьян и Кº — Казань', created: '20.04.2026 08:14', assignee: ME, team: 'Support 1',
  },
  {
    id: 'SD-21834', type: 'Complaint', priority: 'high', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Менеджер не может аннулировать позиции по комп-листу после закрытия смены по воскресеньям.',
    client: 'У Маминой Подруги — 12 точек', created: '20.04.2026 10:02', assignee: ME,
  },
  {
    id: 'SD-21841', type: 'Appeal', priority: 'high', starred: true,
    channel: 'Phone', status: 'In progress',
    description: 'Возврат суммы свыше 5000 ₽ через Stripe возвращает 503. Открыт тикет на стороне банка №87233.',
    client: 'Бухта Цапли — Сочи', created: '20.04.2026 14:30', assignee: ME,
  },
  {
    id: 'SD-21855', type: 'Problem', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Датчик температуры холодильника срабатывает каждые 4 минуты ночью — в логах дрейф сенсора.',
    client: 'Рамэн Мидори — Москва', created: '21.04.2026 08:45', assignee: ME,
  },
  {
    id: 'SD-21860', type: 'Request', priority: 'high', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Обновление прошивки кипера откатилось на двух терминалах — подозрение на несовместимость версий.',
    client: 'Медный Чайник — Екатеринбург', created: '21.04.2026 09:32', assignee: ME,
  },
  {
    id: 'SD-21872', type: 'Complaint', priority: 'medium', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Бонусные баллы перестали начисляться после обновления кипера в пятницу.',
    client: 'Обжорный Ряд — Ростов-на-Дону', created: '21.04.2026 10:15', assignee: ME,
  },
  {
    id: 'SD-21879', type: 'Problem', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Оплата складчиной двумя картами падает с ошибкой; одной картой всё работает.',
    client: 'Якорь Бистро — Мурманск', created: '21.04.2026 11:04', assignee: ME,
  },
  {
    id: 'SD-21885', type: 'Request', priority: 'medium', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Необходимо подключить второй кассовый ящик для новой барной стойки, открываемой на следующей неделе.',
    client: 'Крафт и Драфт — Новосибирск', created: '21.04.2026 11:48', assignee: ME,
  },
  {
    id: 'SD-21891', type: 'Appeal', priority: 'low', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Просят отсрочку оплаты годовой подписки на 2 недели — ресторан на реновации.',
    client: 'Пончиковая Бени — Самара', created: '21.04.2026 12:22', assignee: ME,
  },
  {
    id: 'SD-21897', type: 'Problem', priority: 'high', starred: true,
    channel: 'Phone', status: 'In progress',
    description: 'Синхронизация меню между бэк-офисом и киоском ломается, если название блюда длиннее 32 символов.',
    client: 'Урбан Еда — Краснодар', created: '21.04.2026 13:05', assignee: ME,
  },
  {
    id: 'SD-21903', type: 'Complaint', priority: 'medium', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Гости не получают email-чеки; спам-фильтр проверен, в логах SMTP ошибки авторизации.',
    client: 'Соль и Виноград — Москва', created: '21.04.2026 13:44', assignee: ME,
  },
  {
    id: 'SD-21908', type: 'Request', priority: 'low', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Запрос поддержки мультиязычного меню — нужен английский интерфейс для зарубежных гостей.',
    client: 'Фуего Такос — Москва', created: '21.04.2026 14:10', assignee: ME,
  },
  {
    id: 'SD-21914', type: 'Problem', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Офлайн-режим не синхронизировал 14 заказов после восстановления интернета — деньги не учтены.',
    client: 'Береговой Гриль — Хабаровск', created: '21.04.2026 14:55', assignee: ME,
  },
  {
    id: 'SD-21920', type: 'Appeal', priority: 'medium', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Просят скорректировать счёт — в мартовском инвойсе задвоилась строка за поддержку.',
    client: 'Олива и Лоза — 5 точек', created: '21.04.2026 15:22', assignee: ME,
  },
  {
    id: 'SD-21925', type: 'Complaint', priority: 'high', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Дисплей на кассе драйв-тру показывает неверные позиции в час-пик — предположительно гонка данных.',
    client: 'КвикБайт — Тюмень', created: '21.04.2026 15:50', assignee: ME,
  },
  {
    id: 'SD-21931', type: 'Request', priority: 'medium', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Нужна интеграция кипера со складским модулём iiko до летнего сезона.',
    client: 'ГринБоул — Омск', created: '21.04.2026 16:08', assignee: ME,
  },
  {
    id: 'SD-21936', type: 'Problem', priority: 'high', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Модуль схемы зала падает при активации более 8 залов одновременно.',
    client: 'Гранд Терраса — Сочи', created: '21.04.2026 16:33', assignee: ME,
  },
  {
    id: 'SD-21942', type: 'Problem', priority: 'medium', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'НДС округляется неверно при суммах свыше 30 000 ₽ — расходится с данными ОФД.',
    client: 'Бистро Люмьер — Санкт-Петербург', created: '21.04.2026 17:00', assignee: ME,
  },
  {
    id: 'SD-21948', type: 'Complaint', priority: 'low', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Экран чаевых гасится слишком быстро — гости не успевают выбрать сумму.',
    client: 'Рассвет Кафе — Иркутск', created: '21.04.2026 17:20', assignee: ME,
  },
  {
    id: 'SD-21953', type: 'Request', priority: 'medium', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Нужен кастомный отчёт по выручке за час по каждому терминалу для ночных смен.',
    client: 'Ночная Сова Бар — Москва', created: '21.04.2026 17:45', assignee: ME,
  },
  {
    id: 'SD-21959', type: 'Appeal', priority: 'high', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Спор по SLA: заявка SD-21701 шла 6 дней при гарантии 48 ч — просят перерасчёт оплаты.',
    client: 'Урожай Мун — Владимир', created: '21.04.2026 18:00', assignee: ME,
  },
  {
    id: 'SD-21964', type: 'Problem', priority: 'high', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Платёжный терминал теряет Bluetooth-связь с планшетом каждые 20–30 минут.',
    client: 'Чугунная Сковорода — Ростов-на-Дону', created: '21.04.2026 18:15', assignee: ME,
  },
  {
    id: 'SD-21970', type: 'Complaint', priority: 'medium', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Кипер тормозит при закрытии смены — ~45 секунд на загрузку Z-отчёта.',
    client: 'Красный Кедр Китчен — Пермь', created: '21.04.2026 18:30', assignee: ME,
  },
  {
    id: 'SD-21975', type: 'Request', priority: 'low', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Обновить логотип на шаблоне чека во всех терминалах — новый брендинг.',
    client: 'Прибрежная Еда — Сочи', created: '21.04.2026 18:50', assignee: ME,
  },
  {
    id: 'SD-21980', type: 'Appeal', priority: 'medium', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Запрос на досрочное отключение модуля доставки — заведение меняет концепцию.',
    client: 'Горное Пиво — Красноярск', created: '21.04.2026 19:05', assignee: ME,
  },
  {
    id: 'SD-21985', type: 'Problem', priority: 'high', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Подарочная карта списывает неверную сумму при комбинировании с промокодом.',
    client: 'Сладкая Улица Пекарня — Москва', created: '21.04.2026 19:22', assignee: ME,
  },
  {
    id: 'SD-21990', type: 'Complaint', priority: 'medium', starred: false,
    channel: 'Chat', status: 'In progress',
    description: 'Кухонный принтер игнорирует маршрутизацию — все заказы печатаются на экспо вместо цехов.',
    client: 'Слепая Свинья — Москва', created: '21.04.2026 19:40', assignee: ME,
  },
  {
    id: 'SD-21994', type: 'Request', priority: 'low', starred: false,
    channel: 'Phone', status: 'In progress',
    description: 'Нужно дать старшим смены право на снятие Z-отчёта без менеджерского пин-кода.',
    client: 'Тихоокеанский Поке — Хабаровск', created: '21.04.2026 19:55', assignee: ME,
  },
  {
    id: 'SD-21999', type: 'Problem', priority: 'high', starred: false,
    channel: 'Email', status: 'In progress',
    description: 'Промокод применяется дважды при разделении и пересборке чека на кассе.',
    client: 'Мамина Кухня — Воронеж', created: '21.04.2026 20:10', assignee: ME,
  },

  // ── Не мои заявки ─────────────────────────────────────────
  {
    id: 'SD-21811', type: 'Complaint', priority: 'low', starred: true,
    channel: 'Phone', status: 'Overdue',
    description: 'Wi-Fi отваливается каждые 20 минут в обед — гости и кипер теряют соединение.',
    client: 'Зелёный Лист Кафе — Уфа',
    created: '18.04.2026 11:05',
    assignee: { firstName: 'Иван', lastName: 'Иванов', color: '#3B82F6' }, team: 'Support 1',
  },
  {
    id: 'SD-21847', type: 'Request', priority: 'low', starred: false,
    channel: 'Chat', status: 'Assigned',
    description: 'Клиент уточняет, можно ли поменять планшет по гарантии — ждём серийный номер.',
    client: 'Фуего Такос — Москва',
    created: '20.04.2026 17:18',
    assignee: { firstName: 'Елена', lastName: 'Ковалёва', color: '#22C55E' }, team: 'Support 1',
  },
  {
    id: 'SD-21867', type: 'Appeal', priority: 'low', starred: false,
    channel: 'Phone', status: 'New',
    description: 'Входящее обращение по вопросу продления договора на техобслуживание — ждём подтверждения от клиента.',
    client: 'Олива и Лоза — 5 точек',
    created: '03.04.2026 11:24',
    assignee: { firstName: 'Иван', lastName: 'Иванов', color: '#3B82F6' }, team: 'Support 1',
  },
  {
    id: 'SD-21718', type: 'Problem', priority: 'high', starred: false,
    channel: 'Email', status: 'Assigned',
    description: 'Кипер падает при добавлении более 12 модификаторов к одной позиции.',
    client: 'Медный Кран — Нижний Новгород',
    created: '14.04.2026 09:00',
    assignee: { firstName: 'Айша', lastName: 'Белова', color: '#14B8A6' }, team: 'Support 2',
  },
  {
    id: 'SD-21745', type: 'Complaint', priority: 'medium', starred: false,
    channel: 'Chat', status: 'Closed',
    description: 'Переплата в прошлом расчётном периоде — разобрались после ручной проверки.',
    client: 'Рыбная Гавань — Мурманск',
    created: '15.04.2026 14:30',
    assignee: { firstName: 'Ольга', lastName: 'Дмитриева', color: '#F59E0B' }, team: 'Support 2',
  },
  {
    id: 'SD-21762', type: 'Request', priority: 'low', starred: false,
    channel: 'Phone', status: 'New',
    description: 'Запрос на выгрузку данных о продажах за Q1 для налоговой проверки.',
    client: 'Фронтир Шашлык-Хаус — Краснодар',
    created: '16.04.2026 08:15',
    assignee: { firstName: 'Дмитрий', lastName: 'Орлов', color: '#EC4899' }, team: 'Support 2',
  },
];
