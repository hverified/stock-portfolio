import React, { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

  const formatISTTimestamp = (timestamp) => {
    try {
      const [date, time] = timestamp.split(" ");
      const [timePart] = time.split(",");
      return `${date} ${timePart}`;
    } catch (error) {
      console.error("Timestamp conversion failed:", error.message);
      return "Invalid Date";
    }
  };

  const extractJSON = (message) => {
    try {
      const jsonStart = message.indexOf("{");
      const jsonEnd = message.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
        const jsonString = message.slice(jsonStart, jsonEnd + 1).trim().replace(/'/g, '"');
        const parsedJSON = JSON.parse(jsonString);
        return {
          plainText: message.slice(0, jsonStart).trim(),
          formattedJSON: parsedJSON,
        };
      }
    } catch (e) {
      console.warn("Failed to extract JSON:", e.message);
    }
    return { plainText: message, formattedJSON: null };
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${baseUrl}/app_logs/logs`);
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data = await response.json();
        const formattedData = data.map((log) => ({
          ...log,
          parsedMessage: extractJSON(log.message),
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
    <div className="p-4 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Log Viewer</h2>

      {loading && <p className="text-blue-600 animate-pulse">Loading logs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && logs.length === 0 && <p className="text-gray-500">No logs available.</p>}

      <div className="space-y-3">
        {logs.map((log, index) => (
          <div
            key={index}
            className="p-3 rounded-xl shadow bg-white border-l-4"
            style={{
              borderColor: log.level === "ERROR" ? "#f87171" : log.level === "WARNING" ? "#facc15" : "#34d399",
            }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {log.filename} - {log.function}
                </p>
                <p
                  className={`text-xs font-bold ${log.level === "ERROR"
                    ? "text-red-500"
                    : log.level === "WARNING"
                      ? "text-yellow-500"
                      : "text-green-500"
                    }`}
                >
                  {log.level}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {log.timestamp === "Invalid Date" ? "Invalid Timestamp" : formatISTTimestamp(log.timestamp)}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-700">
              {log.parsedMessage?.plainText || log.message}
            </p>
            {log.parsedMessage?.formattedJSON && (
              <SyntaxHighlighter
                language="json"
                style={vs2015}
                className="mt-2 p-2 rounded text-xs overflow-auto"
              >
                {JSON.stringify(log.parsedMessage.formattedJSON, null, 2)}
              </SyntaxHighlighter>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogViewer;
