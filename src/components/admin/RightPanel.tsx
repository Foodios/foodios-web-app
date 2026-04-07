import { 
  Bug, 
  UserPlus, 
  Zap, 
} from "lucide-react";

const notifications = [
  { 
    id: 1, 
    icon: Bug, 
    title: "You have a bug that needs...", 
    time: "Just now",
    color: "bg-blue-50 text-blue-500" 
  },
  { 
    id: 2, 
    icon: UserPlus, 
    title: "New user registered", 
    time: "59 minutes ago",
    color: "bg-stone-50 text-stone-500" 
  },
  { 
    id: 3, 
    icon: Bug, 
    title: "You have a bug that needs...", 
    time: "12 hours ago",
    color: "bg-blue-50 text-blue-500" 
  },
  { 
    id: 4, 
    icon: Zap, 
    title: "Andi Lane subscribed to you", 
    time: "Today, 11:59 AM",
    color: "bg-blue-50 text-blue-500" 
  },
];

const activities = [
  { id: 1, avatar: "https://i.pravatar.cc/150?u=1", title: "You have a bug that needs...", time: "Just now" },
  { id: 2, avatar: "https://i.pravatar.cc/150?u=2", title: "Released a new version", time: "59 minutes ago" },
  { id: 3, avatar: "https://i.pravatar.cc/150?u=3", title: "Submitted a bug", time: "12 hours ago" },
  { id: 4, avatar: "https://i.pravatar.cc/150?u=4", title: "Modified A data in Page X", time: "Today, 11:59 AM" },
  { id: 5, avatar: "https://i.pravatar.cc/150?u=5", title: "Deleted a page in Project X", time: "Feb 2, 2023" },
];

const contacts = [
  { name: "Natali Craig", avatar: "https://i.pravatar.cc/150?u=11" },
  { name: "Drew Cano", avatar: "https://i.pravatar.cc/150?u=12" },
  { name: "Orlando Diggs", avatar: "https://i.pravatar.cc/150?u=13" },
  { name: "Andi Lane", avatar: "https://i.pravatar.cc/150?u=14" },
  { name: "Kate Morrison", avatar: "https://i.pravatar.cc/150?u=15" },
  { name: "Koray Okumus", avatar: "https://i.pravatar.cc/150?u=16" },
];

function AdminRightPanel() {
  return (
    <aside className="w-72 border-l border-stone-200 bg-white p-6 shrink-0 h-screen overflow-y-auto">
      {/* Notifications */}
      <section className="mb-10">
        <h3 className="text-sm font-bold text-stone-900 mb-6">Notifications</h3>
        <ul className="flex flex-col gap-6">
          {notifications.map((notif) => (
            <li key={notif.id} className="flex gap-3">
              <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${notif.color}`}>
                <notif.icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm text-stone-900 font-medium truncate">{notif.title}</p>
                <span className="text-[0.7rem] text-stone-400 font-medium">{notif.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Activities */}
      <section className="mb-10">
        <h3 className="text-sm font-bold text-stone-900 mb-6">Activities</h3>
        <ul className="flex flex-col gap-6">
          {activities.map((act) => (
            <li key={act.id} className="flex gap-3 border-l-2 border-stone-100 pl-4 relative">
              <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-stone-200 border-2 border-white" />
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm text-stone-900 font-medium line-clamp-1">{act.title}</p>
                <span className="text-[0.7rem] text-stone-400 font-medium">{act.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Contacts */}
      <section>
        <h3 className="text-sm font-bold text-stone-900 mb-6">Contacts</h3>
        <ul className="flex flex-col gap-4">
          {contacts.map((contact) => (
            <li key={contact.name} className="flex items-center gap-3">
              <img src={contact.avatar} alt={contact.name} className="h-6 w-6 rounded-full grayscale-[0.5]" />
              <span className="text-sm text-stone-700 font-medium">{contact.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

export default AdminRightPanel;
