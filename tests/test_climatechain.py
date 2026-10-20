"""
Comprehensive Test Suite for ClimateChain AI
Tests blockchain integrity, Merkle tree inclusion proofs, anti-double-counting invariants,
AI Oracle cyber-threat & anomaly detection, P2P microgrid AMM dynamic pricing,
and FastAPI REST API endpoints.
"""

import pytest
import sys
import os

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, PROJECT_ROOT)

from fastapi.testclient import TestClient
try:
    from backend.blockchain import ClimateChainLedger, Transaction, MerkleTree, sha256
    from backend.ai_oracle import AIClimateOracle
    from backend.p2p_grid import P2PMicrogridMarket
    from backend.main import app
except ImportError:
    from climatechain_ai.backend.blockchain import ClimateChainLedger, Transaction, MerkleTree, sha256
    from climatechain_ai.backend.ai_oracle import AIClimateOracle
    from climatechain_ai.backend.p2p_grid import P2PMicrogridMarket
    from climatechain_ai.backend.main import app


class TestBlockchainAndDoubleCountingDefense:
    def test_genesis_block_and_chain_validity(self):
        ledger = ClimateChainLedger()
        assert len(ledger.chain) == 1
        assert ledger.chain[0].index == 0
        valid, msg = ledger.is_chain_valid()
        assert valid is True

    def test_merkle_tree_proof_generation_and_verification(self):
        tx1 = sha256("tx1_data")
        tx2 = sha256("tx2_data")
        tx3 = sha256("tx3_data")
        tx4 = sha256("tx4_data")
        leaves = [tx1, tx2, tx3, tx4]

        root = MerkleTree.compute_root(leaves)
        assert len(root) == 64

        # Proof for tx2 (index 1)
        proof = MerkleTree.get_proof(leaves, target_index=1)
        assert len(proof) > 0
        is_verified = MerkleTree.verify_proof(tx2, proof, root)
        assert is_verified is True

        # Fake leaf fails verification
        fake_leaf = sha256("fake_tx")
        assert MerkleTree.verify_proof(fake_leaf, proof, root) is False

    def test_carbon_credit_minting_and_block_mining(self):
        ledger = ClimateChainLedger()
        tx = Transaction(
            tx_type="MINT_CREDIT",
            sender="0xAI_Oracle",
            recipient="0xProsumer_SolarFarm_Adana",
            payload={
                "certificate_id": "CERT-2026-TEST-001",
                "project_name": "Test Solar Project",
                "co2_tonnage": 100.0,
                "oracle_confidence": 0.95
            }
        )
        accepted, msg = ledger.add_transaction(tx)
        assert accepted is True
        block = ledger.mine_pending_block()
        assert block.index == 1
        assert "CERT-2026-TEST-001" in ledger.carbon_credits
        assert ledger.carbon_credits["CERT-2026-TEST-001"]["co2_tonnage"] == 100.0

    def test_double_counting_attack_prevented(self):
        """CRITICAL REQUIREMENT: A certificate cannot be retired more than once."""
        ledger = ClimateChainLedger()
        cert_id = "CERT-2026-ANTI-DOUBLE"

        # 1. Mint credit
        tx_mint = Transaction(
            tx_type="MINT_CREDIT",
            sender="0xAI_Oracle",
            recipient="0xEnterprise_Amazon",
            payload={
                "certificate_id": cert_id,
                "project_name": "Wind Offset Project",
                "co2_tonnage": 50.0,
                "oracle_confidence": 0.90
            }
        )
        ledger.add_transaction(tx_mint)
        ledger.mine_pending_block()

        # 2. First retirement (Legitimate)
        tx_retire_1 = Transaction(
            tx_type="RETIRE_CREDIT",
            sender="0xEnterprise_Amazon",
            recipient="0x0000000000000000000000000000000000000000",
            payload={"certificate_id": cert_id, "reason": "Scope 1 Corporate Offset"}
        )
        accepted1, msg1 = ledger.add_transaction(tx_retire_1)
        assert accepted1 is True
        ledger.mine_pending_block()
        assert cert_id in ledger.retired_registry

        # 3. Second retirement attempt (Fraudulent Double-Counting Attack!)
        tx_retire_2 = Transaction(
            tx_type="RETIRE_CREDIT",
            sender="0xEnterprise_Amazon",
            recipient="0x0000000000000000000000000000000000000000",
            payload={"certificate_id": cert_id, "reason": "Attempting second claim"}
        )
        accepted2, msg2 = ledger.add_transaction(tx_retire_2)
        assert accepted2 is False
        assert "DOUBLE_COUNTING_ATTACK_PREVENTED" in msg2

    def test_double_issuance_duplicate_mint_prevented(self):
        ledger = ClimateChainLedger()
        cert_id = "CERT-DUPLICATE-CHECK"
        tx1 = Transaction(
            tx_type="MINT_CREDIT",
            sender="0xAI_Oracle",
            recipient="0xEnterprise_Amazon",
            payload={"certificate_id": cert_id, "co2_tonnage": 20.0, "oracle_confidence": 0.91}
        )
        ledger.add_transaction(tx1)
        ledger.mine_pending_block()

        # Duplicate mint attempt
        tx2 = Transaction(
            tx_type="MINT_CREDIT",
            sender="0xAI_Oracle",
            recipient="0xOther_Entity",
            payload={"certificate_id": cert_id, "co2_tonnage": 20.0, "oracle_confidence": 0.91}
        )
        accepted, msg = ledger.add_transaction(tx2)
        assert accepted is False
        assert "DOUBLE_ISSUANCE_PREVENTED" in msg


class TestAIClimateOracleAndThreatDefense:
    def test_genuine_solar_telemetry_approved(self):
        oracle = AIClimateOracle()
        telemetry = {
            "co2_ppm": 418.0,
            "thermal_celsius": 32.0,
            "output_kwh": 2800.0,
            "production_index": 0.9,
            "hour_of_day": 13  # 1 PM Daylight
        }
        res = oracle.verify_emissions_reduction("Solar PV Farm", 2.0, telemetry)
        assert res["is_valid"] is True
        assert res["verdict"] == "VERIFIED_GENUINE_REDUCTION"
        assert res["confidence_score"] >= 0.70
        assert "0xORACLE_" in res["attestation_hash"]

    def test_nocturnal_solar_cyber_spoofing_rejected(self):
        """Physical sensor violation: Solar generation claimed at midnight."""
        oracle = AIClimateOracle()
        telemetry = {
            "co2_ppm": 420.0,
            "thermal_celsius": 20.0,
            "output_kwh": 3500.0,  # 3500 kWh claimed
            "production_index": 0.9,
            "hour_of_day": 2  # 2:00 AM (Midnight darkness)
        }
        res = oracle.verify_emissions_reduction("Solar PV Farm", 2.8, telemetry)
        assert res["is_valid"] is False
        assert res["verdict"] == "REJECTED_SPOOFED_TELEMETRY"
        assert any("PHYSICAL_VIOLATION" in a for a in res["anomalies"])


class TestP2PEnergyMarketplace:
    def test_dynamic_tariff_pricing(self):
        market = P2PMicrogridMarket()
        # High supply, low demand = cheap tariff
        cheap = market.calculate_dynamic_tariff(supply_kwh=5000, demand_kwh=1000)
        assert cheap["dynamic_tariff_usd_per_kwh"] < market.base_utility_rate
        assert cheap["consumer_savings_pct"] > 0

    def test_order_placement_and_atomic_match(self):
        market = P2PMicrogridMarket()
        order = market.place_order(
            order_type="SELL",
            trader_address="0xTest_Prosumer",
            kwh=100.0,
            price_per_kwh_usd=0.11,
            energy_source="Rooftop Solar"
        )
        assert order.status == "OPEN"

        matched, msg, receipt = market.execute_match(
            buyer_address="0xTest_Buyer",
            seller_order_id=order.order_id,
            kwh_requested=50.0
        )
        assert matched is True
        assert receipt["kwh"] == 50.0
        assert receipt["total_price_usd"] == 5.50
        assert receipt["co2_avoided_kg"] == 41.0  # 50 * 0.82 kg


class TestFastAPIEndpoints:
    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_health_endpoint(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "online"
        assert "IEEE ClimateChain" in data["ieee_hackathon"]

    def test_stats_endpoint(self, client):
        resp = client.get("/api/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert "blockchain_height" in data
        assert "total_co2_minted_tco2e" in data

    def test_blockchain_blocks_endpoint(self, client):
        resp = client.get("/api/blockchain/blocks")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_height"] >= 1
        assert len(data["blocks"]) >= 1

    def test_mrv_verify_endpoint(self, client):
        payload = {
            "project_type": "Wind Farm",
            "reported_tonnage": 1.5,
            "co2_ppm": 415.0,
            "thermal_celsius": 22.0,
            "output_kwh": 2000.0,
            "production_index": 0.85,
            "hour_of_day": 10
        }
        resp = client.post("/api/mrv/verify-telemetry", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert "is_valid" in data
        assert "attestation_hash" in data

    def test_mint_and_retire_carbon_credit_api(self, client):
        # 1. Mint
        mint_payload = {
            "project_name": "Anatolian Solar Power Station",
            "project_type": "Solar PV",
            "co2_tonnage": 75.0,
            "recipient_address": "0xEnterprise_Amazon",
            "vintage_year": 2026,
            "oracle_confidence": 0.95
        }
        mint_resp = client.post("/api/carbon-credits/mint", json=mint_payload)
        assert mint_resp.status_code == 200
        mint_data = mint_resp.json()
        cert_id = mint_data["certificate_id"]
        assert cert_id.startswith("CERT-2026-TR-")

        # 2. Retire
        retire_payload = {
            "certificate_id": cert_id,
            "retiree_address": "0xEnterprise_Amazon",
            "reason": "100% Zero-Carbon Data Center Offset"
        }
        retire_resp = client.post("/api/carbon-credits/retire", json=retire_payload)
        assert retire_resp.status_code == 200
        assert retire_resp.json()["status"] == "RETIRED_PERMANENTLY"

        # 3. Double-counting retirement attempt must return 409
        retire_duplicate = client.post("/api/carbon-credits/retire", json=retire_payload)
        assert retire_duplicate.status_code == 409
        assert "DOUBLE_COUNTING_ATTACK" in retire_duplicate.json()["detail"]

    def test_energy_market_and_trade_api(self, client):
        market_resp = client.get("/api/energy/market")
        assert market_resp.status_code == 200
        orders = market_resp.json()["open_sell_orders"]
        assert len(orders) > 0
        target_order = orders[0]

        # Trade
        trade_payload = {
            "buyer_address": "0xEnterprise_Amazon",
            "seller_order_id": target_order["order_id"],
            "kwh": 25.0
        }
        trade_resp = client.post("/api/energy/trade", json=trade_payload)
        assert trade_resp.status_code == 200
        trade_data = trade_resp.json()
        assert trade_data["status"] == "TRADE_SETTLED_ON_CHAIN"
        assert trade_data["trade_receipt"]["kwh"] == 25.0

    def test_copilot_chat_endpoint(self, client):
        resp = client.post("/api/copilot/chat", json={"prompt": "Explain how double counting is prevented"})
        assert resp.status_code == 200
        data = resp.json()
        assert "answer" in data
        assert len(data["answer"]) > 20
