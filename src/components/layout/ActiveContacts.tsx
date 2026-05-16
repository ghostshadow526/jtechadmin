export default function ActiveContacts() {
  const contacts = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=64&h=64&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&h=64&auto=format&fit=crop",
  ];

  return (
    <aside className="w-16 bg-bg-sidebar border-l border-border-subtle h-screen flex flex-col items-center py-4 fixed right-0 top-0 z-50">
      <div className="p-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-border-subtle flex items-center justify-center text-accent-gold">
           <span className="text-[10px] font-bold">14</span>
        </div>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto w-full flex flex-col items-center custom-scrollbar pb-4">
        {contacts.map((contact, i) => (
          <div key={i} className="relative cursor-pointer hover:scale-110 transition-transform">
            <img 
              src={contact} 
              alt="contact" 
              className="w-10 h-10 rounded-full border border-border-subtle shadow-sm"
              referrerPolicy="no-referrer"
            />
            {i % 3 === 0 && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-gold border-2 border-bg-sidebar rounded-full shadow-lg shadow-accent-gold/20" />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
