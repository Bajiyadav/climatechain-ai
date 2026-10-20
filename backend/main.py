"""
ClimateChain AI: Autonomous Climate Intelligence & Blockchain Engine
REST API Backend for IEEE ClimateChain Global Hackathon 2026.
Serves endpoints for AI MRV satellite verification, anti-double-counting carbon registry,
P2P renewable microgrid trading, on-chain Merkle block explorer, and Gemini Climate Copilot.
"""

import os
import time
import uuid
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from .blockchain import ClimateChainLedger, Transaction
from .ai_oracle import AIClimateOracle
from .p2p_grid import P2PMicrogridMarket

app = FastAPI(
    title="ClimateChain AI: Decentralized Autonomous Climate Action Platform",
    description="Decentralized MRV Oracle, Anti-Double-Counting Carbon Credit Registry & P2P Renewable Energy Trading.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core subsystems
ledger = ClimateChainLedger()
oracle = AIClimateOracle()
market = P2PMicrogridMarket()

# Seed initial block with verified credits for live demo
def _seed_initial_credits():
    cert_1 = "CERT-2026-TUR-SOLAR-089"
    tx_mint = Transaction(
        tx_type="MINT_CREDIT",
        sender="0xAI_Oracle_Coordinator",
        recipient="0xProsumer_SolarFarm_Adana",
        payload={
            "certificate_id": cert_1,
            "project_name": "Adana Agro-Photovoltaic Clean Power Facility",
            "project_type": "Solar PV Microgrid",
            "co2_tonnage": 180.0,
            "vintage_year": 2026,
            "oracle_confidence": 0.94,
            "oracle_hash": "0xORACLE_7a9c8f12d5e38104"
        }
    )
    ledger.add_transaction(tx_mint)
    ledger.mine_pending_block(validator="0xIEEE_Genesis_Validator")

_seed_initial_credits()


# ====================
# REQUEST SCHEMAS
# ====================

class MRVVerifyRequest(BaseModel):
    project_type: str = Field(..., description="Project category (Solar PV, Wind, Reforestation, etc.)")
    reported_tonnage: float = Field(..., gt=0, description="Reported CO2 reduction in metric tons (tCO2e)")
    co2_ppm: float = Field(420.0, description="Sensory/Satellite CO2 atmospheric concentration (ppm)")
    thermal_celsius: float = Field(25.0, description="Thermal IR surface temperature (°C)")
    output_kwh: float = Field(1500.0, description="Measured clean energy output (kWh)")
    production_index: float = Field(0.8, description="Normalized industrial activity index (0.0 to 1.0)")
    hour_of_day: int = Field(14, ge=0, le=23, description="Hour of telemetry measurement (0-23)")

class MintCreditRequest(BaseModel):
    project_name: str
    project_type: str
    co2_tonnage: float = Field(..., gt=0)
    recipient_address: str
    vintage_year: int = Field(2026)
    oracle_confidence: float = Field(0.92, ge=0.0, le=1.0)
    oracle_hash: Optional[str] = None

class RetireCreditRequest(BaseModel):
    certificate_id: str
    retiree_address: str
    reason: str = Field("Corporate Carbon Neutrality Target & Scope 1 Offset")

class EnergyOrderRequest(BaseModel):
    order_type: str = Field(..., description="BUY or SELL")
    trader_address: str
    kwh: float = Field(..., gt=0)
    price_per_kwh_usd: Optional[float] = None
    energy_source: str = "Solar PV"
    location: str = "Local Substation"

class EnergyTradeRequest(BaseModel):
    buyer_address: str
    seller_order_id: str
    kwh: float = Field(..., gt=0)

class CopilotChatRequest(BaseModel):
    prompt: str


# ====================
# REST API ENDPOINTS
# ====================

@app.get("/api/health")
def get_health():
    """System health, IEEE standards compliance, and consensus status."""
    return {
        "status": "online",
        "service": "ClimateChain AI Autonomous Node",
        "version": "1.0.0",
        "consensus_protocol": "Proof-of-Attestation & Stake (PoAS)",
        "ieee_hackathon": "IEEE ClimateChain Global Hackathon 2026",
        "cop31_alignment": "Article 6.2 / 6.4 Compliant",
        "blockchain_height": len(ledger.chain),
        "active_participants": len(ledger.accounts)
    }

@app.get("/api/stats")
def get_stats():
    """Real-time network and climate action telemetry."""
    stats = ledger.get_summary_stats()
    market_stats = market.get_market_state()
    stats["open_energy_sell_orders"] = len(market_stats["open_sell_orders"])
    stats["open_energy_buy_orders"] = len(market_stats["open_buy_orders"])
    stats["dynamic_tariff_usd"] = market_stats["dynamic_tariff"]["dynamic_tariff_usd_per_kwh"]
    stats["consumer_savings_vs_utility_pct"] = market_stats["dynamic_tariff"]["consumer_savings_pct"]
    return stats

@app.get("/api/blockchain/blocks")
def get_blocks(limit: int = 15):
    """Retrieve verified blocks on the ledger with Merkle root and transaction hashes."""
    recent_blocks = [b.to_dict() for b in reversed(ledger.chain[-limit:])]
    return {
        "total_height": len(ledger.chain),
        "blocks": recent_blocks
    }

@app.get("/api/blockchain/verify")
def verify_ledger_integrity():
    """Cryptographically verifies every block hash and Merkle root."""
    valid, message = ledger.is_chain_valid()
    return {
        "is_valid": valid,
        "audit_message": message,
        "blocks_audited": len(ledger.chain),
        "timestamp": time.time()
    }

@app.post("/api/mrv/verify-telemetry")
def verify_mrv_telemetry(req: MRVVerifyRequest):
    """
    AI MRV Oracle Endpoint:
    Applies Isolation Forest & Physical Guardrails to detect spoofed IoT/Satellite data.
    """
    telemetry = {
        "co2_ppm": req.co2_ppm,
        "thermal_celsius": req.thermal_celsius,
        "output_kwh": req.output_kwh,
        "production_index": req.production_index,
        "hour_of_day": req.hour_of_day
    }
    attestation = oracle.verify_emissions_reduction(
        project_type=req.project_type,
        reported_tonnage=req.reported_tonnage,
        sensor_telemetry=telemetry
    )
    return attestation

@app.post("/api/carbon-credits/mint")
def mint_carbon_credit(req: MintCreditRequest):
    """
    Mints a verified carbon credit certificate with AI Oracle attestation.
    Guarantees uniqueness and prevents duplicate issuance.
    """
    cert_id = f"CERT-{req.vintage_year}-TR-{uuid.uuid4().hex[:8].upper()}"
    tx = Transaction(
        tx_type="MINT_CREDIT",
        sender="0xAI_MRV_Oracle",
        recipient=req.recipient_address,
        payload={
            "certificate_id": cert_id,
            "project_name": req.project_name,
            "project_type": req.project_type,
            "co2_tonnage": req.co2_tonnage,
            "vintage_year": req.vintage_year,
            "oracle_confidence": req.oracle_confidence,
            "oracle_hash": req.oracle_hash or f"0xORACLE_{uuid.uuid4().hex[:16]}"
        }
    )
    accepted, reason = ledger.add_transaction(tx)
    if not accepted:
        raise HTTPException(status_code=400, detail=reason)
    
    new_block = ledger.mine_pending_block(validator="0xIEEE_Validator_Node_01")
    return {
        "status": "MINTED_SUCCESSFULLY",
        "certificate_id": cert_id,
        "block_index": new_block.index,
        "block_hash": new_block.hash,
        "tx_hash": tx.tx_hash,
        "credit_details": ledger.carbon_credits[cert_id]
    }

@app.post("/api/carbon-credits/retire")
def retire_carbon_credit(req: RetireCreditRequest):
    """
    Permanently retires a carbon credit to offset emissions.
    Strictly prevents double-counting by permanently locking the certificate ID.
    """
    tx = Transaction(
        tx_type="RETIRE_CREDIT",
        sender=req.retiree_address,
        recipient="0x0000000000000000000000000000000000000000",  # Burn address
        payload={
            "certificate_id": req.certificate_id,
            "reason": req.reason
        }
    )
    accepted, reason = ledger.add_transaction(tx)
    if not accepted:
        raise HTTPException(status_code=409, detail=reason)
    
    new_block = ledger.mine_pending_block(validator="0xIEEE_Validator_Node_01")
    return {
        "status": "RETIRED_PERMANENTLY",
        "certificate_id": req.certificate_id,
        "block_index": new_block.index,
        "proof_of_retirement": ledger.retired_registry[req.certificate_id]
    }

@app.get("/api/carbon-credits/list")
def list_carbon_credits():
    """Lists all active and retired carbon credits on the ledger."""
    return {
        "active_credits": list(ledger.carbon_credits.values()),
        "retired_credits": list(ledger.retired_registry.values())
    }

@app.get("/api/energy/market")
def get_energy_market():
    """Current decentralized clean energy order book and dynamic AI tariffs."""
    return market.get_market_state()

@app.post("/api/energy/order")
def create_energy_order(req: EnergyOrderRequest):
    """Places a new prosumer or consumer energy order into the microgrid book."""
    order = market.place_order(
        order_type=req.order_type,
        trader_address=req.trader_address,
        kwh=req.kwh,
        price_per_kwh_usd=req.price_per_kwh_usd,
        energy_source=req.energy_source,
        location=req.location
    )
    return {
        "status": "ORDER_PLACED",
        "order": order.to_dict()
    }

@app.post("/api/energy/trade")
def execute_energy_trade(req: EnergyTradeRequest):
    """
    Executes an atomic P2P clean energy trade and commits the transaction on-chain.
    """
    matched, message, receipt = market.execute_match(
        buyer_address=req.buyer_address,
        seller_order_id=req.seller_order_id,
        kwh_requested=req.kwh
    )
    if not matched:
        raise HTTPException(status_code=400, detail=message)

    # Commit trade on blockchain ledger
    tx = Transaction(
        tx_type="P2P_ENERGY_TRADE",
        sender=receipt["buyer"],
        recipient=receipt["seller"],
        payload={
            "trade_id": receipt["trade_id"],
            "kwh": receipt["kwh"],
            "total_price_usd": receipt["total_price_usd"],
            "price_per_kwh_usd": receipt["price_per_kwh_usd"],
            "co2_avoided_kg": receipt["co2_avoided_kg"],
            "energy_source": receipt["energy_source"]
        }
    )
    accepted, reason = ledger.add_transaction(tx)
    if not accepted:
        raise HTTPException(status_code=400, detail=reason)
    
    block = ledger.mine_pending_block(validator="0xIEEE_Microgrid_Node_04")
    return {
        "status": "TRADE_SETTLED_ON_CHAIN",
        "trade_receipt": receipt,
        "block_index": block.index,
        "block_hash": block.hash,
        "tx_hash": tx.tx_hash
    }

@app.post("/api/copilot/chat")
async def copilot_chat(req: CopilotChatRequest):
    """Interactive Climate AI Copilot powered by Google Gemini 2.5 Flash."""
    return await oracle.query_gemini_climate_copilot(req.prompt)


# ====================
# STATIC FILE SERVING
# ====================
dist_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")

if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_react_frontend():
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "ClimateChain AI API Running. Build frontend with 'npm run build'."}

elif os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_frontend():
        index_file = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "ClimateChain AI API Running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("climatechain-ai.backend.main:app", host="0.0.0.0", port=8001, reload=True)
