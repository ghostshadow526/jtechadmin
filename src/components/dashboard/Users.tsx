import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Loader2, AlertCircle, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: any;
  lastLogin?: any;
  status?: string;
  role?: string;
  [key: string]: any;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        }) as User[];

        const sorted = usersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setUsers(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        handleFirestoreError(error, OperationType.LIST, 'users');
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm))
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate?.() || new Date(timestamp);
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif italic text-white tracking-widest uppercase">Users</h2>
        <div className="text-[10px] uppercase tracking-widest text-accent-gold font-mono">
          {users.length} Total Users
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Users List */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-input-bg border border-border-subtle text-white placeholder-gray-600 outline-none focus:border-accent-gold transition-colors text-sm"
          />

          {loading ? (
            <div className="flex items-center justify-center h-64 text-accent-gold">
              <Loader2 className="animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="h-64 border border-dashed border-border-subtle flex flex-col items-center justify-center gap-4">
              <AlertCircle size={32} className="text-gray-600" />
              <p className="text-[10px] uppercase tracking-widest text-gray-600">
                {users.length === 0 ? 'No users found.' : 'No matching users.'}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 border cursor-pointer transition-all ${
                  selectedUser?.id === user.id
                    ? 'border-accent-gold bg-border-subtle'
                    : 'border-border-subtle hover:border-accent-gold'
                }`}
              >
                <h3 className="font-serif text-white text-sm mb-2">{user.name || 'Unknown'}</h3>
                <p className="text-[10px] text-gray-400 truncate">{user.email || 'No email'}</p>
                {user.phone && (
                  <p className="text-[10px] text-gray-500 mt-1">{user.phone}</p>
                )}
                <p className="text-[10px] text-accent-gold mt-2">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Selected User Details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="border border-border-subtle p-8 space-y-6">
              <div>
                <h3 className="text-xl font-serif italic text-white tracking-widest uppercase mb-1">
                  {selectedUser.name || 'Unknown User'}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                  ID: {selectedUser.id}
                </p>
              </div>

              {/* User Information Grid */}
              <div className="space-y-4 border-t border-border-subtle pt-6">
                {selectedUser.email && (
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-accent-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Email</p>
                      <p className="text-white text-sm break-all">{selectedUser.email}</p>
                    </div>
                  </div>
                )}

                {selectedUser.phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-accent-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Phone</p>
                      <p className="text-white text-sm">{selectedUser.phone}</p>
                    </div>
                  </div>
                )}

                {selectedUser.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-accent-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Address</p>
                      <p className="text-white text-sm">{selectedUser.address}</p>
                    </div>
                  </div>
                )}

                {selectedUser.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-accent-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Joined</p>
                      <p className="text-white text-sm">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                )}

                {selectedUser.lastLogin && (
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-accent-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Last Login</p>
                      <p className="text-white text-sm">{formatDate(selectedUser.lastLogin)}</p>
                    </div>
                  </div>
                )}

                {selectedUser.status && (
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-accent-gold mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Status</p>
                      <p className="text-white text-sm capitalize">{selectedUser.status}</p>
                    </div>
                  </div>
                )}

                {selectedUser.role && (
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full bg-accent-gold mt-1 flex-shrink-0"></div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Role</p>
                      <p className="text-white text-sm capitalize">{selectedUser.role}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Custom Fields */}
              {Object.keys(selectedUser).some(
                key => !['id', 'name', 'email', 'phone', 'address', 'createdAt', 'lastLogin', 'status', 'role'].includes(key)
              ) && (
                <div className="border-t border-border-subtle pt-6 space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Additional Information</p>
                  {Object.entries(selectedUser).map(([key, value]) => {
                    if (['id', 'name', 'email', 'phone', 'address', 'createdAt', 'lastLogin', 'status', 'role'].includes(key)) {
                      return null;
                    }
                    return (
                      <div key={key} className="bg-input-bg p-3 rounded">
                        <p className="text-[10px] uppercase tracking-widest text-accent-gold font-mono mb-1">{key}</p>
                        <p className="text-white text-sm break-all">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-border-subtle flex items-center justify-center h-96">
              <p className="text-[10px] uppercase tracking-widest text-gray-600">
                Select a user to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
