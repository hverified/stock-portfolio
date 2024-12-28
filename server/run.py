import uvicorn

if __name__ == "__main__":
    # Run the app with production settings
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        # workers=1,  # Number of worker processes
        log_level="info",  # Logging level
        reload=False,  # Enable auto-reload
    )
