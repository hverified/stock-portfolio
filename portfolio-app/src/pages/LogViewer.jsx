import React, { useState, useEffect } from 'react';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to convert timestamp to ISO format
  const convertToISOFormat = (timestamp) => {
    // Convert the timestamp from "2025-01-29 23:31:39,065" to "2025-01-29T23:31:39.065"
    const [date, time] = timestamp.split(' '); // Split date and time
    const [hourMinuteSecond, millisecond] = time.split(','); // Split seconds and milliseconds
    return `${date}T${hourMinuteSecond}.${millisecond}`;
  };

  // Fetch logs from FastAPI endpoint
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/app_logs/logs');
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        const data = await response.json();

        // Ensure timestamp is formatted properly
        const formattedData = data.map(log => ({
          ...log,
          timestamp: convertToISOFormat(log.timestamp),
        }));

        // Sort logs by timestamp in descending order
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
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Logs Viewer</h1>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {logs.length === 0 && !loading && <p>No logs available.</p>}

      <div className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{log.filename} - {log.function}</p>
                <p className="text-sm text-gray-500">{log.level}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
