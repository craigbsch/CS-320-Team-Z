# Using python 3.10 as runtime
FROM python:3.10

# Sets working directory to /app
WORKDIR /app

# Copies the Python script and environment variables file into the container
COPY get_food.py .
COPY dbInfoDocker.env .


# Installs required packages from requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Install Google Chrome
RUN apt-get update && apt-get install -y wget unzip && \
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb && \
    apt-get clean

    
# Runs the script
CMD ["python", "./get_food.py"]