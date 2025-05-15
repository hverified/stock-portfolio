import React, { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Header from "../components/Header";
import BaseCard from "../components/BaseCard";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState({});
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
        setLoading(true);
        setError(null);
        const response = await fetch(`${baseUrl}/app_logs/logs`);
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data
          .map((log) => ({
            ...log,
            parsedMessage: extractJSON(log.message),
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setLogs(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const toggleJSON = (index) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getLogIcon = (level) => {
    switch (level) {
      case "ERROR":
        return (
          <svg
            className="w-4 h-4 text-red-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        );
      case "WARNING":
        return (
          <svg
            className="w-4 h-4 text-yellow-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-green-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:pb-24">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <Header />
        {loading && (
          <BaseCard className="w-full" padding="p-3 sm:p-4">
            <div className="flex items-center justify-center h-20 sm:h-24">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-4 border-emerald-500"></div>
            </div>
          </BaseCard>
        )}
        {!loading && error && (
          <BaseCard className="w-full" padding="p-3 sm:p-4">
            <div className="text-center py-4 sm:py-6">
              <p className="text-red-500 text-xs sm:text-sm">{error}</p>
              <button
                onClick={() => fetchLogs()}
                className="mt-3 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                Retry
              </button>
            </div>
          </BaseCard>
        )}
        {!loading && logs.length === 0 && (
          <BaseCard className="w-full" padding="p-3 sm:p-4">
            <div className="text-center py-4 sm:py-6">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">No logs available.</p>
            </div>
          </BaseCard>
        )}
        {!loading && logs.length > 0 && (
          <div className="p-4 sm:p-6 rounded-2xl shadow-lg bg-white transform hover:scale-105 transition-transform duration-300 animate-fade-in">
            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Application Logs
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Last updated at{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 sm:p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ${log.level === "ERROR"
                      ? "border-red-400 bg-red-50"
                      : log.level === "WARNING"
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-green-400 bg-green-50"
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${log.level === "ERROR"
                            ? "bg-red-500"
                            : log.level === "WARNING"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            } flex-shrink-0`}
                        ></span>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                            {log.filename} - {log.function}
                          </p>
                          <div className="flex items-center space-x-1">
                            {getLogIcon(log.level)}
                            <p
                              className={`text-xs font-semibold ${log.level === "ERROR"
                                ? "text-red-600"
                                : log.level === "WARNING"
                                  ? "text-yellow-600"
                                  : "text-green-600"
                                }`}
                            >
                              {log.level}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 sm:text-right break-words">
                        {log.timestamp === "Invalid Date"
                          ? "Invalid Timestamp"
                          : formatISTTimestamp(log.timestamp)}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-gray-700 break-words">
                      {log.parsedMessage?.plainText || log.message}
                    </p>
                    {log.parsedMessage?.formattedJSON && (
                      <div className="mt-1">
                        <button
                          onClick={() => toggleJSON(index)}
                          className="text-xs text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                        >
                          <svg
                            className={`w-3 h-3 sm:w-4 sm:h-4 transform ${expandedLogs[index] ? "rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                          <span>{expandedLogs[index] ? "Hide JSON" : "Show JSON"}</span>
                        </button>
                        {expandedLogs[index] && (
                          <SyntaxHighlighter
                            language="json"
                            style={vs2015}
                            className="mt-1 p-1 sm:p-2 rounded-lg text-xs border border-gray-200 max-h-24 overflow-x-auto overflow-y-auto"
                          >
                            {JSON.stringify(log.parsedMessage.formattedJSON, null, 2)}
                          </SyntaxHighlighter>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;