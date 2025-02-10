import React, { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faExclamationCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

  const formatISTTimestamp = (timestamp) => {
    try {
      const [date, time] = timestamp.split(" ");
      const [timePart] = time.split(",");
      const formattedDate = `${date} ${timePart}`;
      return formattedDate;
    } catch (error) {
      console.error("Timestamp conversion failed:", error.message, "Input timestamp:", timestamp);
      return "Invalid Date";
    }
  };

  const extractJSON = (message) => {
    try {
      const jsonStart = message.indexOf("{");
      const jsonEnd = message.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
        let jsonString = message.slice(jsonStart, jsonEnd + 1).trim();
        jsonString = jsonString.replace(/'/g, '"');
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
          timestamp: log.timestamp,
          parsedMessage: extractJSON(log.message),
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

  const logCounts = logs.reduce(
    (acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    },
    { ERROR: 0, WARNING: 0, INFO: 0 }
  );

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      <h1 className="text-xl text-gray-800 mb-6">Logs Viewer</h1>

      {loading && <p className="text-blue-600 animate-pulse">Loading logs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && logs.length === 0 && <p className="text-gray-500">No logs available.</p>}

      {/* Cards Section */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div className="p-4 bg-gradient-to-r from-red-100 to-red-50 rounded-2xl shadow-lg text-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-3xl mb-2" />
          <p className="text-4xl font-bold text-red-600">{logCounts.ERROR}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-2xl shadow-lg text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-3xl mb-2" />
          <p className="text-4xl font-bold text-yellow-600">{logCounts.WARNING}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl shadow-lg text-center">
          <FontAwesomeIcon icon={faInfoCircle} className="text-green-500 text-3xl mb-2" />
          <p className="text-4xl font-bold text-green-600">{logCounts.INFO}</p>
        </div>
      </div>


      <div className="space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-lg bg-gradient-to-r from-white to-gray-50 border-l-4"
            style={{
              borderColor: log.level === "ERROR" ? "#f87171" : log.level === "WARNING" ? "#facc15" : "#34d399",
            }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {log.filename} - {log.function}
                </p>
                <p
                  className={`text-sm font-medium ${log.level === "ERROR"
                    ? "text-red-500"
                    : log.level === "WARNING"
                      ? "text-yellow-500"
                      : "text-green-500"
                    }`}
                >
                  {log.level}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {log.timestamp === "Invalid Date"
                    ? "Invalid Timestamp"
                    : formatISTTimestamp(log.timestamp)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-gray-700 text-sm">
              {log.parsedMessage?.plainText || log.message}
            </p>
            {log.parsedMessage?.formattedJSON && (
              <SyntaxHighlighter
                language="json"
                style={vs2015}
                className="mt-2 p-2 rounded-lg text-sm overflow-auto"
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
