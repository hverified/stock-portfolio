# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Install system dependencies for Selenium and Chromium
RUN apt-get update && \
    apt-get install -y \
    wget \
    curl \
    unzip \
    chromium \
    chromium-driver \
    libgconf-2-4 \
    libnss3 \
    libx11-dev \
    libxss1 \
    libappindicator3-1 \
    fonts-liberation \
    libnspr4-dev \
    libnss3-dev \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libepoxy0 \
    libxtst6 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean


# Set the environment variable for headless chrome
ENV CHROME_BIN=/usr/bin/chromium
# Set the correct path to the Chromium binary
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

RUN which chromium || which chromium-browser || which chromedriver || echo "Chromium not found"
RUN ls /usr/bin
# Set up a directory for your app
WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN /usr/bin/chromedriver --version
RUN /usr/bin/chromium --version
RUN chmod +x /usr/bin/chromedriver
RUN chmod +x /usr/bin/chromium
# Copy your entire project into the Docker container
COPY . /app/

# Expose the port that FastAPI runs on
EXPOSE 8000

# Run the FastAPI app using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
