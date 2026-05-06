import {
  FilterAltOutlined,
  GridViewOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Phone,
  EmailOutlined,
  ChatOutlined,
  AttachFile,
  Send,
  Close,
  Search,
  Add,
  EditOutlined,
  DeleteOutlined,
  Check,
  CheckCircleOutlined,
  InfoOutlined,
  WarningAmber,
  ErrorOutlined,
  PersonOutlined,
  GroupOutlined,
  StarBorder,
  Star,
  Refresh,
  DownloadOutlined,
  UploadOutlined,
  MoreHoriz,
  MoreVert,
  CalendarTodayOutlined,
  AccessTime,
  Link,
  OpenInNew,
  ArrowBack,
  ArrowForward,
  ArrowUpward,
  ArrowDownward,
  NotificationsNone,
  SettingsOutlined,
  HomeOutlined,
  FolderOutlined,
  LayersOutlined,
  Tune,
  CopyAllOutlined,
  FlagOutlined,
  BookmarkOutlined,
  EmojiEventsOutlined,
  AccountTreeOutlined,
  ConfirmationNumberOutlined,
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';

import dogAiSrc from '../assets/dog-ai.svg';
import type { IconName } from './types';

const ICON_MAP: Record<string, SvgIconComponent> = {
  Filter:         FilterAltOutlined,
  Grid:           GridViewOutlined,
  ChevronDown:    KeyboardArrowDown,
  ChevronUp:      KeyboardArrowUp,
  ChevronLeft:    KeyboardArrowLeft,
  ChevronRight:   KeyboardArrowRight,
  Phone:          Phone,
  Mail:           EmailOutlined,
  MessageSquare:  ChatOutlined,
  Paperclip:      AttachFile,
  AttachFile:     AttachFile,
  Send:           Send,
  Close:          Close,
  Cross:          Close,
  Search:         Search,
  Add:            Add,
  Plus:           Add,
  Edit:           EditOutlined,
  Pencil:         EditOutlined,
  Delete:         DeleteOutlined,
  Trash:          DeleteOutlined,
  Check:          Check,
  CheckCircle:    CheckCircleOutlined,
  Info:           InfoOutlined,
  AlertTriangle:  WarningAmber,
  AlertCircle:    ErrorOutlined,
  Person:         PersonOutlined,
  User:           PersonOutlined,
  Users:          GroupOutlined,
  StarBorder:     StarBorder,
  Star:           Star,
  Refresh:        Refresh,
  Download:       DownloadOutlined,
  Upload:         UploadOutlined,
  MoreHoriz:      MoreHoriz,
  MoreVert:       MoreVert,
  Calendar:       CalendarTodayOutlined,
  Clock:          AccessTime,
  Link:           Link,
  ExternalLink:   OpenInNew,
  ArrowLeft:      ArrowBack,
  ArrowRight:     ArrowForward,
  ArrowUp:        ArrowUpward,
  ArrowDown:      ArrowDownward,
  Bell:           NotificationsNone,
  Settings:       SettingsOutlined,
  Home:           HomeOutlined,
  Folder:         FolderOutlined,
  Layers:         LayersOutlined,
  Tune:           Tune,
  Copy:           CopyAllOutlined,
  Flag:           FlagOutlined,
  Bookmark:       BookmarkOutlined,
  Crown:          EmojiEventsOutlined,
  Branch:         AccountTreeOutlined,
  Ticket:         ConfirmationNumberOutlined,
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 16, color = 'currentColor' }: IconProps) {
  if (name === 'DogAi') {
    return (
      <img
        src={dogAiSrc}
        alt="AI"
        width={size}
        height={size}
        style={{
          display: 'block',
          filter: color === '#fff' || color === 'white'
            ? 'brightness(0) invert(1)'
            : undefined,
        }}
      />
    );
  }

  const MuiIcon = ICON_MAP[name];

  if (!MuiIcon) {
    return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  }

  return <MuiIcon sx={{ fontSize: size, color }} />;
}
