import React, { useState, useEffect } from 'react';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

  const convertToISOFormat = (timestamp) => {
    const [date, time] = timestamp.split(' ');
    const [hourMinuteSecond, millisecond] = time.split(',');
    return `${date}T${hourMinuteSecond}.${millisecond}`;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${baseUrl}/app_logs/logs`);
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();

        const formattedData = data.map((log) => ({
          ...log,
          timestamp: convertToISOFormat(log.timestamp),
        }));

        formattedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setLogs(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Logs Viewer</h1>

      {loading && <p className="text-blue-600 animate-pulse">Loading logs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && logs.length === 0 && <p className="text-gray-500">No logs available.</p>}

      <div className="space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-white to-gray-50 border-l-4"
            style={{
              borderColor: log.level === 'ERROR' ? '#f87171' : log.level === 'WARNING' ? '#facc15' : '#34d399',
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {log.filename} - {log.function}
                </p>
                <p
                  className={`text-sm font-medium ${log.level === 'ERROR'
                    ? 'text-red-500'
                    : log.level === 'WARNING'
                      ? 'text-yellow-500'
                      : 'text-green-500'
                    }`}
                >
                  {log.level}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mt-3 text-gray-700 text-sm">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
