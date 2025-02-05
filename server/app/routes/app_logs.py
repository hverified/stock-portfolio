from fastapi import APIRouter
from fastapi.responses import JSONResponse
import re
from datetime import datetime

router = APIRouter()

# Define the path to your log file
log_file_path = "app_logs.txt"

# Function to parse log line into structured data
def parse_log_line(line: str):
    # Log line regex pattern to capture date, level, filename, function, and message
    log_pattern = r'(?P<timestamp>\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3}) - (?P<level>\w+) - (?P<filename>\S+) - (?P<function>\S+) - (?P<message>.*)'
    
    match = re.match(log_pattern, line)
    if match:
        return {
            "timestamp": match.group("timestamp"),
            "level": match.group("level"),
            "filename": match.group("filename"),
            "function": match.group("function"),
            "message": match.group("message")
        }
    return None

# Endpoint to fetch logs from file and return them as JSON
@router.get("/logs")
async def get_logs():
    logs = []
    
    # Read the log file and parse each line
    try:
        with open(log_file_path, "r") as file:
            for line in file:
                log_entry = parse_log_line(line)
                if log_entry:
                    logs.append(log_entry)
    except FileNotFoundError:
        return JSONResponse(status_code=404, content={"error": "Log file not found."})
    
    # Return the logs as a JSON response
    return JSONResponse(content=logs)
