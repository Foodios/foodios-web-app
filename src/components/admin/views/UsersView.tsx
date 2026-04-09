import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Search, Loader2, AlertCircle, MoreHorizontal, User, Mail, Phone, Calendar } from "lucide-react";
import { adminService } from "../../../services/adminService";

function UsersView() {
  const { role = "customer" } = useParams<{ role: string }>();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.getUsers(role, 1, 20, searchQuery);
      const rawData = result.data || result;
      const finalData = Array.isArray(rawData) ? rawData : (rawData.items || rawData.content || []);
      setUsersList(finalData);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(`Failed to load ${role} list.`);
    } finally {
      setIsLoading(false);
    }
  }, [role, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getRoleTitle = () => {
    switch (role.toLowerCase()) {
      case 'admin': return 'Admin Staff';
      case 'corporate': return 'Corporate Clients';
      case 'customer': return 'Regular Customers';
      default: return 'Users';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-stone-950">{getRoleTitle()} Management</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and monitor all users registered as {role.toLowerCase()} on the platform.</p>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-white border border-stone-200 rounded-xl px-4 h-11 min-w-[320px] focus-within:ring-2 focus-within:ring-stone-950/10 transition-all">
            <Search className="w-4.5 h-4.5 text-stone-400 shrink-0" />
            <input
              className="w-full bg-transparent border-none outline-none px-3 text-sm text-stone-950 placeholder:text-stone-400"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${role} by name or email...`}
            />
          </div>
          <button onClick={() => fetchUsers()} className="h-11 px-4 flex items-center gap-2 bg-stone-950 text-white rounded-xl text-sm font-bold hover:bg-stone-800 transition-all">
            Search
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-sm min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">User Info</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Status</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-[0.7rem] font-black uppercase text-stone-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-bold">
                    <Loader2 className="w-8 h-8 text-stone-950 animate-spin mx-auto mb-4" />
                    Fetching {role} data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-red-500 font-bold">
                    <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                    {error}
                  </td>
                </tr>
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-bold">No {role} found.</td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200 shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-950">{user.fullName || user.username}</h4>
                          <span className="text-[0.7rem] font-medium text-stone-400 uppercase tracking-tighter italic">ID: #{user.id?.substring(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-stone-600">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{user.email || 'N/A'}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-stone-400">
                            <Phone className="w-3.5 h-3.5" />
                            <span className="text-xs">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold border ${
                        (user.status || 'Active').toLowerCase() === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          (user.status || 'Active').toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {user.status || 'Active'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-stone-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Jan 12, 2024'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <button className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-stone-50 text-stone-400 hover:bg-stone-950 hover:text-white transition-all shadow-sm border border-stone-100">
                         <MoreHorizontal className="w-4.5 h-4.5" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsersView;
