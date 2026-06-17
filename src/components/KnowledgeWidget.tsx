// LogicBPM Knowledge Widget (Web Component). Загрузчик подключён в index.html,
// здесь только ставим тег. tenant/token берём из env (.env.local, gitignored),
// чтобы JWT не попадал в репозиторий. Плавающая кнопка в правом нижнем углу.
export default function KnowledgeWidget() {
  const tenant = import.meta.env.VITE_KW_TENANT;
  const token = import.meta.env.VITE_KW_TOKEN;

  if (!tenant) return null;

  return (
    <knowledge-chat
      tenant={tenant}
      token={token || undefined}
      theme="light"
      lang="ru"
      position="bottom-right"
      collapsed="true"
    />
  );
}
