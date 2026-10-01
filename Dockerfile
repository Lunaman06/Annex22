# Dockerfile für Annex 22 Dev- & Build-Umgebung
# Kombiniert Node.js 20 (Vite, Marked, Mermaid) und Python 3 (Sync- & Scraping-Skripte)
FROM node:20-slim

# System-Abhängigkeiten und Python 3 installieren
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Node-Dependencies cachen
COPY package*.json ./
RUN npm install

# Python Virtualenv anlegen und Dependencies cachen
COPY requirements.txt ./
RUN python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt

# Virtualenv in den PATH aufnehmen
ENV PATH="/venv/bin:$PATH"

# Quellcode kopieren
COPY . .

# Port für Vite Web-Server
EXPOSE 5173

# Standardmäßig Vite Dev-Server starten
CMD ["npm", "run", "dev"]
