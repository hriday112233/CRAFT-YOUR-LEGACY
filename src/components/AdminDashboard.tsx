import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Download, Search, Mail, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  price_paid: number;
  timestamp: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.location.href = '/api/admin/export-users';
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Admin <span className="gradient-text">Dashboard</span></h2>
          </div>
          <p className="text-slate-500 font-medium">Manage registered students and export data for reporting.</p>
        </div>
        
        <button 
          onClick={handleExport}
          className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
        >
          <Download size={20} /> Export to Excel (CSV)
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatCard 
          icon={<Users className="text-brand" />}
          label="Total Students"
          value={users.length.toString()}
          color="bg-brand/5"
        />
        <StatCard 
          icon={<CreditCard className="text-emerald-600" />}
          label="Total Revenue"
          value={`₹${users.reduce((acc, curr) => acc + curr.price_paid, 0).toLocaleString()}`}
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<Calendar className="text-amber-600" />}
          label="Recent Enrollments"
          value={users.filter(u => {
            const date = new Date(u.timestamp);
            const today = new Date();
            return date.toDateString() === today.toDateString();
          }).length.toString()}
          color="bg-amber-50"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-bold">Registered Students</h3>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand outline-none font-medium text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Fee Paid</th>
                <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-slate-400">#{user.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand font-black text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500 font-medium">
                        <Mail size={14} />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-slate-900">₹{user.price_paid.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                        <Calendar size={14} />
                        {new Date(user.timestamp).toLocaleDateString()}
                      </div>
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

function StatCard({ icon, label, value, color }: { icon: React.ReactElement, label: string, value: string, color: string }) {
  return (
    <div className="card p-8 flex items-center gap-6">
      <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm`}>
        {React.cloneElement(icon, { size: 32 } as any)}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
