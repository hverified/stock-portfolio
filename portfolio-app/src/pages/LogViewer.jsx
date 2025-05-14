import React, { useState, useEffect } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Header from "../components/Header";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState({});
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
        const response = await fetch(`${baseUrl}/app_logs/logs`);
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
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
            className="w-4 h-4 text-red-600"
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
            className="w-4 h-4 text-yellow-600"
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
            className="w-4 h-4 text-green-600"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Header />
      <div className="max-w-6xl mx-auto space-y-8 mt-8">
        {loading && (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-emerald-500"></div>
          </div>
        )}
        {!loading && logs.length === 0 && (
          <div className="text-center py-10">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
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
            <p className="text-gray-500 text-sm mt-2">No logs available.</p>
          </div>
        )}

        {/* <div className="space-y-4 animate-fade-in"> */}
        <div
          className={`p-4 rounded-2xl shadow-lg bg-white transform hover:scale-105 
            transition-transform duration-300 animate-fade-in`}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Application Logs</h3>
            <p className="text-xs text-gray-500 mb-4">
              Last updated at{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ${log.level === "ERROR"
                  ? "border-red-400 bg-red-50"
                  : log.level === "WARNING"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-green-400 bg-green-50"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-full ${log.level === "ERROR"
                        ? "bg-red-500"
                        : log.level === "WARNING"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        }`}
                    ></span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
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
                  <p className="text-xs text-gray-500 text-right">
                    {log.timestamp === "Invalid Date"
                      ? "Invalid Timestamp"
                      : formatISTTimestamp(log.timestamp)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-gray-700">
                  {log.parsedMessage?.plainText || log.message}
                </p>
                {log.parsedMessage?.formattedJSON && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleJSON(index)}
                      className="text-xs text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                      <svg
                        className={`w-4 h-4 transform ${expandedLogs[index] ? "rotate-180" : ""
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
                        className="mt-1 p-2 rounded-lg text-xs border border-gray-200 max-h-32 overflow-auto"
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
    </div>
  );
};

export default LogViewer;