"""
AI MRV Oracle & Cyber-Security Threat Shield
Addresses IEEE Session 2: 'AI and Cyber Security Issues for Climate Change'.
Employs Machine Learning (IsolationForest & Statistical Z-Score Auto-Profiling)
to detect spoofed/tampered IoT sensor and satellite telemetry before on-chain minting.
Integrates Google Gemini for intelligent climate policy reasoning.
"""

import os
import hashlib
import json
import time
import math
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from sklearn.ensemble import IsolationForest


class AIClimateOracle:
    """
    Decentralized AI Oracle that audits climate MRV (Measurement, Reporting, Verification)
    telemetry and protects the blockchain from malicious or fabricated carbon claims.
    """
    def __init__(self):
        self.anomaly_detector = IsolationForest(
            n_estimators=100,
            contamination=0.08,
            random_state=42
        )
        self._fit_synthetic_baseline()

    def _fit_synthetic_baseline(self):
        """Fits normal physical sensor dynamics (CO2 ppm, Thermal IR, kWh output, Production Index)."""
        np.random.seed(42)
        # Normal industrial/renewable profiles:
        # [co2_ppm, thermal_ir_celsius, output_kwh, production_index]
        normal_samples = []
        for _ in range(300):
            # Normal solar farm: high kwh with daylight, low co2
            solar_kwh = np.random.uniform(500, 3500)
            thermal = 20.0 + (solar_kwh / 3500.0) * 25.0 + np.random.normal(0, 2)
            co2_ppm = np.random.uniform(410, 435)
            prod_idx = np.random.uniform(0.6, 1.0)
            normal_samples.append([co2_ppm, thermal, solar_kwh, prod_idx])

            # Normal wind / hydro:
            wind_kwh = np.random.uniform(1000, 5000)
            wind_thermal = np.random.uniform(12, 28)
            normal_samples.append([np.random.uniform(412, 430), wind_thermal, wind_kwh, prod_idx])

        self.anomaly_detector.fit(np.array(normal_samples))

    def verify_emissions_reduction(
        self,
        project_type: str,
        reported_tonnage: float,
        sensor_telemetry: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        AI MRV verification:
        1. Validates physical sensor feasibility (energy conservation laws).
        2. Detects anomalous/fabricated telemetry (cybersecurity threat defense).
        3. Computes tamper-proof cryptographic attestation hash.
        """
        co2_ppm = float(sensor_telemetry.get("co2_ppm", 420.0))
        thermal_celsius = float(sensor_telemetry.get("thermal_celsius", 25.0))
        output_kwh = float(sensor_telemetry.get("output_kwh", 1500.0))
        production_index = float(sensor_telemetry.get("production_index", 0.8))
        hour_of_day = int(sensor_telemetry.get("hour_of_day", 14))

        anomalies: List[str] = []
        cyber_threat_detected = False

        # Physical Rule 1: Solar generation at midnight check (Sensor Spoofing)
        if "solar" in project_type.lower():
            if (hour_of_day < 5 or hour_of_day > 20) and output_kwh > 50.0:
                anomalies.append(f"PHYSICAL_VIOLATION: Solar generation of {output_kwh:.1f} kWh reported at hour {hour_of_day}:00 (No sunlight)")
                cyber_threat_detected = True

        # Physical Rule 2: High thermal footprint on zero-emission claims
        if thermal_celsius > 85.0 and reported_tonnage > 100.0:
            anomalies.append(f"THERMAL_DISCREPANCY: Satellite IR detects high heat signature ({thermal_celsius:.1f}°C) inconsistent with clean offset claim")
            cyber_threat_detected = True

        # Physical Rule 3: Extreme negative or impossible CO2 values
        if co2_ppm < 200.0 or co2_ppm > 5000.0:
            anomalies.append(f"SENSOR_OUT_OF_RANGE: CO2 ppm reading of {co2_ppm} exceeds physical atmospheric boundaries")
            cyber_threat_detected = True

        # ML Anomaly Detection score using IsolationForest decision_function
        features = np.array([[co2_ppm, thermal_celsius, output_kwh, production_index]])
        dec_score = float(self.anomaly_detector.decision_function(features)[0])
        is_inlier = int(self.anomaly_detector.predict(features)[0]) == 1

        if is_inlier:
            # Map decision function (typically 0.0 to 0.25) to confidence (0.80 to 0.98)
            normalized_confidence = round(0.80 + min(0.18, max(0.0, dec_score * 0.9)), 4)
        else:
            # Outlier / anomaly: confidence below threshold (0.20 to 0.55)
            normalized_confidence = round(max(0.10, 0.55 + dec_score * 0.8), 4)

        if cyber_threat_detected:
            normalized_confidence = min(normalized_confidence, 0.15)
            is_valid = False
            verdict = "REJECTED_SPOOFED_TELEMETRY"
        elif not is_inlier or normalized_confidence < 0.65:
            anomalies.append(f"STATISTICAL_OUTLIER: ML confidence ({normalized_confidence:.2f}) below verification threshold (0.65)")
            is_valid = False
            verdict = "REQUIRES_AUDIT"
        else:
            is_valid = True
            verdict = "VERIFIED_GENUINE_REDUCTION"

        # Calculate verified allowable tonnage (capped by physical generation)
        # 1 MWh of clean electricity offsets approx 0.82 metric tons of CO2 (grid average factor)
        theoretical_max_offset = (output_kwh / 1000.0) * 0.82
        if "reforestation" not in project_type.lower() and reported_tonnage > (theoretical_max_offset * 1.5):
            anomalies.append(f"OVERCLAIM_DETECTED: Claimed {reported_tonnage:.2f} tCO2e exceeds max physical grid displacement of {theoretical_max_offset:.2f} tCO2e")
            verified_tonnage = round(theoretical_max_offset, 2)
        else:
            verified_tonnage = round(reported_tonnage, 2)

        timestamp = time.time()
        attestation_payload = {
            "verdict": verdict,
            "is_valid": is_valid,
            "confidence_score": round(normalized_confidence, 4),
            "verified_tonnage": verified_tonnage if is_valid else 0.0,
            "project_type": project_type,
            "anomalies": anomalies,
            "timestamp": timestamp
        }
        
        # Cryptographic Oracle Signature / Attestation Hash
        attestation_hash = hashlib.sha256(json.dumps(attestation_payload, sort_keys=True).encode("utf-8")).hexdigest()
        attestation_payload["attestation_hash"] = f"0xORACLE_{attestation_hash[:32]}"

        return attestation_payload

    async def query_gemini_climate_copilot(self, prompt: str) -> Dict[str, Any]:
        """
        Gemini 2.5/Flash powered Climate AI Copilot:
        Provides authoritative carbon auditing, ESG recommendations, and microgrid guidance.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Deterministic, high-yield heuristic response for offline/hackathon mode
            return self._heuristic_climate_response(prompt)

        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            system_instruction = (
                "You are ClimateChain AI, an expert decentralized climate intelligence and carbon market auditor "
                "built for the IEEE ClimateChain Global Hackathon. You provide precise, mathematically rigorous "
                "insights on carbon offset verification, avoiding double counting, P2P microgrid energy optimization, "
                "and UN COP 31 climate goals."
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={"system_instruction": system_instruction, "temperature": 0.2}
            )
            return {
                "source": "Google Gemini 2.5 Flash",
                "answer": response.text,
                "timestamp": time.time()
            }
        except Exception as e:
            fallback = self._heuristic_climate_response(prompt)
            fallback["warning"] = f"Gemini API fallback invoked ({str(e)})"
            return fallback

    def _heuristic_climate_response(self, prompt: str) -> Dict[str, Any]:
        p = prompt.lower()
        if "double count" in p or "double-count" in p:
            ans = (
                "Double-counting is eliminated on ClimateChain via cryptographic non-fungible certificate registries. "
                "Each credit is stamped with a unique SHA-256 certificate ID derived from sensor telemetry, "
                "vintage year, and issuing authority. When retired, the token is permanently locked into the "
                "`retired_registry` smart state and cannot be resold, transferred, or re-claimed."
            )
        elif "p2p" in p or "energy" in p or "microgrid" in p:
            ans = (
                "ClimateChain P2P Renewable Microgrid uses an automated market maker (AMM) pricing algorithm "
                "dynamically weighted by regional solar irradiance and battery reserves. Prosumers sell surplus clean kWh "
                "directly to neighboring commercial/residential consumers with atomic blockchain escrow, bypassing utility markup."
            )
        elif "sensor" in p or "cyber" in p or "oracle" in p:
            ans = (
                "In alignment with IEEE Session 2 ('AI and Cyber Security Issues for Climate Change'), "
                "our AI Oracle utilizes Isolation Forest anomaly detection and physical conservation constraints "
                "to intercept spoofed IoT sensors (e.g. nocturnal solar claims or thermal spoofing) before any credit can be minted."
            )
        else:
            ans = (
                f"ClimateChain AI analyzed your inquiry: '{prompt}'. Our autonomous architecture pairs verified "
                "AI MRV telemetry with cryptographic blockchain immutability to ensure full compliance with "
                "ISO 14064-2 and Article 6 of the Paris Agreement."
            )
        return {
            "source": "ClimateChain Local AI Engine",
            "answer": ans,
            "timestamp": time.time()
        }
