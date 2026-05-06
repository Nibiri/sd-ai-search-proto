import { type ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
}

type TabsView = 'default' | 'deep' | 'pills';

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (id: string) => void;
  view?: TabsView;
  classNameContentWrapper?: string;
}

export function Tabs({ tabs, activeTab, onChange, view = 'default', classNameContentWrapper }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id ?? '');
  const current = activeTab ?? internalActive;

  const handleChange = (id: string) => {
    setInternalActive(id);
    onChange?.(id);
  };

  const isDeep = view === 'deep';
  const isPills = view === 'pills';

  return (
    <div>
      <div style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             isDeep ? 2 : isPills ? 4 : 0,
        backgroundColor: isDeep ? '#f3f4f5' : 'transparent',
        borderRadius:    isDeep ? 12 : 0,
        padding:         isDeep ? 3 : 0,
        borderBottom:    !isDeep && !isPills ? '1px solid #e5e7eb' : 'none',
      }}>
        {tabs.map((tab) => {
          const isActive = tab.id === current;
          return (
            <button
              key={tab.id}
              onClick={() => handleChange(tab.id)}
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                gap:             6,
                height:          isDeep ? 34 : 36,
                paddingLeft:     isDeep ? 14 : 16,
                paddingRight:    isDeep ? 14 : 16,
                borderRadius:    isDeep ? 9 : isPills ? 8 : 0,
                border:          isPills
                  ? `1px solid ${isActive ? '#7c3aed' : '#e5e7eb'}`
                  : 'none',
                borderBottom:    !isDeep && !isPills
                  ? `2px solid ${isActive ? '#7c3aed' : 'transparent'}`
                  : 'none',
                backgroundColor: isDeep
                  ? (isActive ? '#ffffff' : 'transparent')
                  : isPills
                  ? (isActive ? '#f3effc' : 'transparent')
                  : 'transparent',
                color:           isActive ? '#7c3aed' : '#6b7280',
                fontSize:        '0.875rem',
                fontWeight:      isActive ? 600 : 400,
                fontFamily:      'Inter, sans-serif',
                cursor:          'pointer',
                transition:      'all 0.15s',
                boxShadow:       isDeep && isActive ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                whiteSpace:      'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={classNameContentWrapper}
          style={{ display: tab.id === current ? 'block' : 'none' }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
