# 🌍 ClimateChain AI: Decentralized Carbon MRV Oracle & P2P Renewable Microgrid

> **IEEE ClimateChain Global Hackathon 2026 Official Submission**  
> **Organizers:** IEEE Blockchain Türkiye Group, IEEE Blockchain Technical Group, IEEE Orange County EMBS / Computer Society, IEEE Türkiye Section  
> **Tracks:** Carbon Markets & Emissions Transparency • Renewable Energy & Energy Trading  
> **Author:** Baji Baddela  

---

## ⚡ Overview
**ClimateChain AI** is an autonomous climate action platform combining **Machine Learning Oracles** with **Cryptographic Blockchain State Machines** to address two of the largest barriers in global climate finance:

1. **Carbon Credit Double-Counting & Greenwashing (Track 1):** Eliminates double-counting through non-reversible on-chain retirement locks and filters fraudulent sensor/satellite data using an **Isolation Forest ML Cyber-Shield**.
2. **Centralized Energy Inefficiency (Track 2):** Connects renewable prosumers (solar, wind, battery) with localized consumers in a peer-to-peer microgrid using an **AI Dynamic Equilibrium Tariff**, achieving **34.4% consumer energy savings**.
3. **Conversational Climate Copilot:** Grounded with **Google Gemini 2.5 Flash** to provide instant carbon accounting, ISO 14064-2 compliance guidance, and microgrid analytics.

---

## 🏗️ Project Architecture

```
climatechain-ai/
├── backend/
│   ├── main.py              # FastAPI REST server & static UI mount
│   ├── blockchain.py        # Cryptographic ledger, Merkle trees & state machine
│   ├── ai_oracle.py         # Isolation Forest anomaly scorer & Gemini Copilot
│   ├── p2p_grid.py          # Prosumer microgrid order book & AMM dynamic pricing
│   └── requirements.txt     # Python dependencies
├── contracts/
│   ├── CarbonCreditLedger.sol # ERC-1155 smart contract with anti-double-counting locks
│   └── P2PEnergyMarket.sol   # Microgrid escrow & atomic P2P settlement contract
├── frontend/
│   ├── index.html           # Modern Cyber-Emerald glassmorphic dashboard
│   ├── style.css            # Custom CSS design system with micro-animations
│   └── app.js               # Reactive JS engine connecting to backend APIs
├── tests/
│   └── test_climatechain.py # 16 unit, adversarial & API tests (100% passing)
└── docs/
    ├── DEVPOST_SUBMISSION.md # Official Devpost hackathon submission writeup
    └── IEEE_PAPER_PROPOSAL.md # Academic IEEE conference paper draft
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
cd climatechain-ai
pip install -r backend/requirements.txt
```

### 2. Run the Test Suite (100% Pass)
```bash
pytest tests/ -v
```

### 3. Launch the Application & HUD
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload
```
Open **`http://localhost:8001`** in your browser.

---

## 🧪 Key Test Vectors Handled
* **Cryptographic Block Hashing & Merkle Root Proofs:** Recomputes block hashes and verifies inclusion in $O(\log N)$.
* **Double-Counting Attack Interception:** Attempting to retire the same certificate twice is rejected with HTTP 409 and `DOUBLE_COUNTING_ATTACK_PREVENTED`.
* **Duplicate Minting Defense:** Prevents duplicate tokenization of previously issued project IDs.
* **Cyber-Physical Sensor Defense:** Intercepts nocturnal solar claims (e.g. 3,500 kWh generated at 2:00 AM) and extreme thermal discrepancies.
* **P2P Clean Energy Atomic Matching:** Sells kilowatt-hours directly from prosumer to buyer, settling balances on-chain and tracking avoided CO2 ($0.82\text{ kg CO}_2\text{ / kWh}$).

---

## 📜 Standards & Compliance
* **UN COP 31 Aligned** (Paris Agreement Article 6.2 / 6.4)
* **ISO 14064-2 Greenhouse Gas MRV Protocol**
* **ERC-1155 Multi-Token Standard** for Multi-Vintage Carbon Assets
