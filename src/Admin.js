import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Trophy, Activity, Settings } from 'lucide-react';

const supabaseUrl = 'https://uwpjbjejfuocxkapqpti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cGpiamVqZnVvY3hrYXBxcHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTY5MDAsImV4cCI6MjA4MDQzMjkwMH0.DjatDOhBlDkgfcq7kWQ3wkm-k61TZ_Xqpo9JSCd9tFc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_PWD = "jesuslovesyou";

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPoints: 0, totalActivities: 0, userList: [] });

  const handleAuth = () => {
    if (password === ADMIN_PWD) {
      setAuthenticated(true);
      fetchData();
    } else {
      alert("Incorrect password");
    }
  };

  const fetchData = async () => {
    try {
      const { data: logsData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      const { data: usersData } = await supabase
        .from('users')
        .select('*');

      // 사용자별 통계 계산
      const userStats = {};
      usersData?.forEach(user => {
        userStats[user.id] = {
          ...user,
          activityCount: 0,
          totalScore: 0
        };
      });

      logsData?.forEach(log => {
        if (userStats[log.user_id]) {
          userStats[log.user_id].activityCount++;
          userStats[log.user_id].totalScore += log.score || 0;
        }
      });

      setLogs(logsData || []);
      
      const totalUsers = usersData?.length || 0;
      const totalPoints = usersData?.reduce((sum, u) => sum + (u.points || 0), 0) || 0;
      const totalActivities = logsData?.length || 0;
      const userList = Object.values(userStats);
      
      setStats({ totalUsers, totalPoints, totalActivities, userList });
    } catch (error) {
      console.error("Admin fetch failed:", error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center mb-6">
            <Settings className="mx-auto text-indigo-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold">Admin Access</h2>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="Enter admin password"
          />
          <button 
            onClick={handleAuth} 
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Login
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button 
            onClick={() => window.location.href = '/'} 
            className="text-sm text-gray-500 hover:text-indigo-600"
          >
            ← Back to Main
          </button>
        </div>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center gap-3">
                <Users className="text-indigo-600" size={32} />
                <div>
                  <div className="text-sm text-gray-500">Total Users</div>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-600" size={32} />
                <div>
                  <div className="text-sm text-gray-500">Total Points</div>
                  <div className="text-2xl font-bold">{stats.totalPoints}</div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <Activity className="text-green-600" size={32} />
                <div>
                  <div className="text-sm text-gray-500">Activities</div>
                  <div className="text-2xl font-bold">{stats.totalActivities}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Card>
          <h3 className="font-bold text-lg mb-4">User Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Nickname</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Grade</th>
                  <th className="p-2 text-left">School</th>
                  <th className="p-2 text-left">Total Points</th>
                  <th className="p-2 text-left">Activities</th>
                  <th className="p-2 text-left">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {stats.userList?.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 font-medium">{user.nickname || 'N/A'}</td>
                    <td className="p-2 text-xs">{user.email || 'N/A'}</td>
                    <td className="p-2">{user.grade || 'N/A'}</td>
                    <td className="p-2 text-xs">{user.school_name || 'N/A'}</td>
                    <td className="p-2 font-bold text-indigo-600">{user.points || 0}</td>
                    <td className="p-2">{user.activityCount}</td>
                    <td className="p-2">{user.activityCount > 0 ? Math.round(user.totalScore / user.activityCount) : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4">Recent Activity Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Details</th>
                  <th className="p-2 text-left">Score</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const user = stats.userList?.find(u => u.id === log.user_id);
                  return (
                    <tr key={log.id} className="border-t">
                      <td className="p-2 font-medium">{user?.nickname || 'Unknown'}</td>
                      <td className="p-2"><Badge>{log.activity_type}</Badge></td>
                      <td className="p-2">{log.details?.description || 'N/A'}</td>
                      <td className="p-2 font-bold text-indigo-600">{log.score}</td>
                      <td className="p-2">{Math.round(log.duration_seconds)}s</td>
                      <td className="p-2 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}