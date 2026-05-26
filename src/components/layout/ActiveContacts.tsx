export default function ActiveContacts() {
  return (
    <aside className="w-16 bg-bg-sidebar border-l border-border-subtle h-screen flex flex-col items-center py-4 fixed right-0 top-0 z-50">
      <div className="p-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-border-subtle flex items-center justify-center text-accent-gold">
           <span className="text-[10px] font-bold">14</span>
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col items-center pb-4">
        {/* Profile images removed per request */}
      </div>
    </aside>
  );
}
