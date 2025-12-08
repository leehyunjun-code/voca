import React, { useState, useEffect } from 'react';
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
  const [authenticated, setAuthenticated] = useState(() => {
    const saved = localStorage.getItem('admin_auth');
    if (saved) {
      const { timestamp } = JSON.parse(saved);
      const now = Date.now();
      const hoursPassed = (now - timestamp) / (1000 * 60 * 60);
      if (hoursPassed < 24) {
        return true;
      } else {
        localStorage.removeItem('admin_auth');
      }
    }
    return false;
  });
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPoints: 0, totalActivities: 0, userList: [] });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const handleAuth = () => {
    if (password === ADMIN_PWD) {
      localStorage.setItem('admin_auth', JSON.stringify({ timestamp: Date.now() }));
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setAuthenticated(false);
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
          <div className="flex gap-4">
            <button 
              onClick={handleLogout} 
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
            <button 
              onClick={() => window.location.href = '/'} 
              className="text-sm text-gray-500 hover:text-indigo-600"
            >
              ← Back to Main
            </button>
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-bold text-lg mb-4">Module Performance Analysis</h3>
            <div className="space-y-3">
              {['Vocabulary', 'Grammar', 'Writing', 'Reading'].map(module => {
                const moduleLogs = logs.filter(log => log.activity_type === module);
                const avgScore = moduleLogs.length > 0 
                  ? Math.round(moduleLogs.reduce((sum, log) => sum + (log.score || 0), 0) / moduleLogs.length)
                  : 0;
                const totalAttempts = moduleLogs.length;
                
                return (
                  <div key={module} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{module}</div>
                      <div className="text-xs text-gray-500">{totalAttempts} attempts</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{avgScore}</div>
                      <div className="text-xs text-gray-500">avg score</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-lg mb-4">Student Performance Overview</h3>
            <div className="space-y-3">
              {stats.userList?.slice(0, 5).map(user => {
                const avgScore = user.activityCount > 0 
                  ? Math.round(user.totalScore / user.activityCount)
                  : 0;
                
                let performance = 'Needs Improvement';
                let color = 'text-red-600';
                if (avgScore >= 80) {
                  performance = 'Excellent';
                  color = 'text-green-600';
                } else if (avgScore >= 60) {
                  performance = 'Good';
                  color = 'text-blue-600';
                }
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{user.nickname}</div>
                      <div className="text-xs text-gray-500">Grade {user.grade}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${color}`}>{performance}</div>
                      <div className="text-xs text-gray-500">{avgScore} avg</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="font-bold text-lg mb-4">User Statistics (Click for Details)</h3>
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
                  <tr 
                    key={user.id} 
                    className="border-t hover:bg-indigo-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedUser(user)}
                  >
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 사용자 상세 분석 모달 */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Detailed Analysis: {selectedUser.nickname}</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Grade</div>
                <div className="text-2xl font-bold text-blue-600">{selectedUser.grade}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">Total Points</div>
                <div className="text-2xl font-bold text-green-600">{selectedUser.points}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600">Activities</div>
                <div className="text-2xl font-bold text-purple-600">{selectedUser.activityCount}</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-600">Avg Score</div>
                <div className="text-2xl font-bold text-orange-600">
                  {selectedUser.activityCount > 0 ? Math.round(selectedUser.totalScore / selectedUser.activityCount) : 0}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Module Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Vocabulary', 'Grammar', 'Writing', 'Reading'].map(module => {
                  const moduleLogs = logs.filter(log => 
                    log.user_id === selectedUser.id && log.activity_type === module
                  );
                  const avgScore = moduleLogs.length > 0
                    ? Math.round(moduleLogs.reduce((sum, log) => sum + (log.score || 0), 0) / moduleLogs.length)
                    : 0;
                  const totalTime = moduleLogs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
                  
                  let bgColor = 'bg-red-50';
                  let borderColor = 'border-red-200';
                  let textColor = 'text-red-600';
                  if (avgScore >= 80) {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-200';
                    textColor = 'text-green-600';
                  } else if (avgScore >= 60) {
                    bgColor = 'bg-blue-50';
                    borderColor = 'border-blue-200';
                    textColor = 'text-blue-600';
                  }
                  
                  return (
                    <div key={module} className={`p-4 ${bgColor} rounded-lg border ${borderColor}`}>
                      <div className="font-bold text-gray-800">{module}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Avg Score: <span className={`font-bold ${textColor}`}>{avgScore}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Attempts: {moduleLogs.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Time: {Math.round(totalTime / 60)}m
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">Strengths</h4>
                <ul className="space-y-1 text-sm">
                  {['Vocabulary', 'Grammar', 'Writing', 'Reading'].map(module => {
                    const moduleLogs = logs.filter(log => 
                      log.user_id === selectedUser.id && log.activity_type === module
                    );
                    const avgScore = moduleLogs.length > 0
                      ? Math.round(moduleLogs.reduce((sum, log) => sum + (log.score || 0), 0) / moduleLogs.length)
                      : 0;
                    if (avgScore >= 70 && moduleLogs.length > 0) {
                      return <li key={module} className="text-green-700">✓ {module} ({avgScore} avg)</li>;
                    }
                    return null;
                  }).filter(Boolean)}
                  {['Vocabulary', 'Grammar', 'Writing', 'Reading'].every(module => {
                    const moduleLogs = logs.filter(log => 
                      log.user_id === selectedUser.id && log.activity_type === module
                    );
                    const avgScore = moduleLogs.length > 0
                      ? Math.round(moduleLogs.reduce((sum, log) => sum + (log.score || 0), 0) / moduleLogs.length)
                      : 0;
                    return avgScore < 70 || moduleLogs.length === 0;
                  }) && <li className="text-gray-500">No strong areas yet</li>}
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-800 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1 text-sm">
                  {['Vocabulary', 'Grammar', 'Writing', 'Reading'].map(module => {
                    const moduleLogs = logs.filter(log => 
                      log.user_id === selectedUser.id && log.activity_type === module
                    );
                    const avgScore = moduleLogs.length > 0
                      ? Math.round(moduleLogs.reduce((sum, log) => sum + (log.score || 0), 0) / moduleLogs.length)
                      : 0;
                    if (avgScore < 70 && moduleLogs.length > 0) {
                      return <li key={module} className="text-red-700">⚠ {module} ({avgScore} avg)</li>;
                    }
                    if (moduleLogs.length === 0) {
                      return <li key={module} className="text-gray-600">○ {module} (No data)</li>;
                    }
                    return null;
                  }).filter(Boolean)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}