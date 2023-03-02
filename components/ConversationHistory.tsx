type Type = 'user' | 'bot';

const messages = [
  ['Hello', 'user'],
  ['Hi', 'keimo'],
  ['How are you?', 'user'],
];

function HistoryMessage({ message, type }: { message: string; type: string }) {
  if (type === 'keimo')
    return (
      <div className="paper bg-white self-start min-w-[50%]">{message}</div>
    );
  return <div className="paper bg-green self-end min-w-[50%]">{message}</div>;
}

export default function ConversationHistory({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`${className} overflow-x-scroll flex flex-col blur-xs gap-2 my-2`}
    >
      {messages.map(([message, type], i) => (
        <HistoryMessage key={i} message={message} type={type} />
      ))}
    </div>
  );
}
