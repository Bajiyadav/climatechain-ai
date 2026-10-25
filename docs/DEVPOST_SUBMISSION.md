# 🌍 ClimateChain AI: Decentralized Carbon MRV Oracle & P2P Clean Energy Grid

> **Submission for:** [IEEE ClimateChain Global Hackathon 2026](https://devpost.com/)  
> **Organizers:** IEEE Blockchain Türkiye Group, IEEE Blockchain Technical Group, IEEE Orange County EMBS / Computer Society, IEEE Türkiye Section  
> **Tracks:**  
> 1. **Carbon Markets & Emissions Transparency** (AI Satellite MRV & Zero Double-Counting Registry)  
> 2. **Renewable Energy & Energy Trading** (Decentralized Prosumer Microgrid & Dynamic AMM Tariff)  
> **Prize Targets:** 1st Prize ($1,500 Cash + IEEE Certificate of Merit + IEEE Senior Member Nomination)  
> **Team:** Baji Baddela  
> **Repository:** [https://github.com/Bajiyadav/climatechain-ai](https://github.com/Bajiyadav/climatechain-ai)  
> **Live Web App / Demo:** [https://climatechain-ai.vercel.app](https://climatechain-ai.vercel.app)  
> **Video Demo Link:** [https://youtu.be/YfWt6OrgIRA](https://youtu.be/YfWt6OrgIRA)  

---

## ⚡ 1. Inspiration & Problem Statement

Climate change is humanity's most urgent systemic crisis. The UN COP 31 and the Paris Agreement (Article 6) envision transparent carbon markets and rapid renewable energy adoption. However, current environmental market infrastructure is plagued by severe trust and cybersecurity bottlenecks:

1. **The Double-Counting Plague:** Carbon credits are frequently sold across multiple registries or claimed by both host countries and private corporations due to centralized, fragmented databases.
2. **Fabricated Telemetry & Greenwashing (Cyber-Physical Risk):** In alignment with **IEEE Learning Session 2 ("AI and Cyber Security Issues for Climate Change")**, connected IoT sensors and satellite reporting can be spoofed or manipulated (e.g. nocturnal solar generation or thermal discrepancies).
3. **Centralized Energy Inefficiency:** Renewable prosumers (rooftop solar, localized wind, battery storage) are forced to sell energy back to centralized fossil-dominated utilities at rock-bottom feed-in tariffs while neighbors pay exorbitant retail electricity rates.

---

## 💡 2. What It Does

**ClimateChain AI** is an end-to-end decentralized climate infrastructure platform uniting **Machine Learning Oracles** with **Cryptographic Blockchain State Machines**:

### 🛰️ A. AI Satellite MRV & Cyber-Threat Oracle (Track 1)
- Ingests multi-modal sensory telemetry: atmospheric CO2 concentration (ppm), satellite thermal infrared IR (°C), clean kilowatt-hour output, and industrial production activity.
- Uses an **Isolation Forest** unsupervised anomaly detection model combined with physical conservation invariants (e.g. detecting nocturnal solar spoofing or exaggerated emission reduction claims).
- Computes tamper-proof cryptographic attestation hashes (`0xORACLE_...`) required before any credit can be minted.

### 🛡️ B. Zero Double-Counting On-Chain Registry (Track 1 & Smart Contracts)
- Implements ERC-1155 multi-vintage carbon assets where each token carries its complete immutable lineage (project ID, vintage year, issuing authority, and sensor attestation hash).
- **Permanent Proof-of-Burn:** When retired, the token is permanently transferred to a burn address and recorded in an immutable `retired_registry` smart state. Replay or duplicate retirement attacks fail closed with HTTP 409 and smart contract reverts.

### ⚡ C. Decentralized P2P Renewable Microgrid & Dynamic AMM (Track 2)
- Connects clean power prosumers (solar farms, wind microgrids, residential battery systems) directly with commercial and residential consumers.
- Features an **AI Dynamic Equilibrium Tariff Algorithm** that clears prices between $0.08/kWh and $0.14/kWh based on localized supply, demand, and solar irradiance—delivering **25% to 40% consumer cost savings** compared to conventional utility rates ($0.18/kWh).
- Atomic smart contract execution settles kilowatt-hour balances and computes real-time avoided CO2 emissions ($0.82\text{ kg CO}_2\text{ / kWh}$).

### 🤖 D. Autonomous Climate Copilot (Google Gemini 2.5 Flash)
- An AI reasoning engine grounded in ISO 14064-2 protocols and UN COP 31 climate policy that assists corporations and grid operators in auditing carbon claims and microgrid optimization.

---

## 🏗️ 3. System Architecture

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                   ClimateChain Cyber-Emerald HUD                      │
  │     (Satellite MRV Feed, P2P Order Book, Certificate Explorer)        │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │ REST / WebSocket
                                     ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                 FastAPI ClimateChain Core Backend                      │
  │   ┌────────────────────────────────┐   ┌───────────────────────────┐   │
  │   │   AI Climate MRV Oracle        │   │  P2P Microgrid AMM Engine │   │
  │   │   - IsolationForest ML Scorer  │   │  - Dynamic Tariff Pricing │   │
  │   │   - Physical Law Validation    │   │  - Order Matching Engine  │   │
  │   │   - Satellite IR Analysis      │   │  - Clean Power Balancing  │   │
  │   └───────────────┬────────────────┘   └─────────────┬─────────────┘   │
  │                   │ Attestation Hash                 │ Settled Trade   │
  │                   ▼                                  ▼                 │
  │   ┌────────────────────────────────────────────────────────────────┐   │
  │   │        Cryptographic Blockchain Engine (Proof-of-Attestation)   │   │
  │   │        - SHA-256 Chained Blocks & Nonce Consensus              │   │
  │   │        - Merkle Tree Inclusion Proofs (O(log N))               │   │
  │   │        - Strict Anti-Double-Counting State Register            │   │
  │   └────────────────────────────────────────────────────────────────┘   │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│  CarbonCreditLedger.sol (ERC-1155)  │    │      P2PEnergyMarket.sol             │
│  - Minting with Oracle Hash          │    │      - Prosumer Sell Orders          │
│  - Permanent Retirement Lock         │    │      - Atomic Escrow Settlement      │
│  - Zero Double-Counting Guarantee    │    │      - Avoided CO2 Ledger Tracking   │
└──────────────────────────────────────┘    └──────────────────────────────────────┘
```

---

## 🧪 4. Testing & Verification

The platform includes a rigorous **16-test Python unit and adversarial test suite (`pytest`)**:
* **100% Pass Rate** across cryptographic block hashing, Merkle proofs, double-counting attack prevention, duplicate minting defense, nocturnal solar spoofing interception, and FastAPI REST endpoints.

Run tests:
```bash
./venv/bin/pytest climatechain-ai/tests/test_climatechain.py -v
```

---

## 🚀 5. How to Run Locally

```bash
# 1. Start the ClimateChain Node & Web App
./venv/bin/python3 -m uvicorn climatechain_ai.backend.main:app --host 0.0.0.0 --port 8001 --reload

# 2. Open in Browser
# http://localhost:8001
```

---

## 👥 Team & Hackathon Submission
* **Author / Developer:** Baji Baddela
* **Submission Category:** Blockchain + AI for Social Good (UN COP 31 Sustainable Tomorrow)
* **Conference Tracks:** 
  * Track 1: Carbon Markets & Emissions Transparency
  * Track 2: Renewable Energy & Energy Trading

---

## 🏛️ IEEE Blockchain Türkiye Leadership & Academic Collaboration

This project is built in direct alignment with the mission of the **IEEE Blockchain Türkiye Group**, established and approved by **IEEE Blockchain** and the **IEEE Türkiye Section** to support, collaborate, and coordinate blockchain innovation, research, and industrial adoption across Türkiye.

### Leadership & Contact Information:
* **Chair:** **Prof. Dr. Şeref Sağıroğlu**  
  * *Institution:* Gazi University, Türkiye  
  * *Email:* [ss@gazi.edu.tr](mailto:ss@gazi.edu.tr)
* **Co-Chair (Industry):** **Dr. Güven Fidan**  
  * *Organization:* MindMons Technologies  
* **Co-Chair (Universities):** **Prof. Dr. Sedat Akleylek**  
  * *Institution:* University of Tartu  
  * *Email:* [akleylek@gmail.com](mailto:akleylek@gmail.com)

*For further information, collaboration, organizational initiatives, and joint research projects, please communicate with the leadership team.*

