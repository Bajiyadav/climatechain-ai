"""
P2P Renewable Microgrid & Decentralized Energy Trading Engine
Addresses IEEE ClimateChain Track 2: Renewable Energy & Energy Trading.
Simulates decentralized prosumer nodes (solar rooftops, wind farms, battery microgrids)
with dynamic automated market maker (AMM) pricing, order matching, and atomic settlements.
"""

import time
import uuid
import math
from typing import Dict, Any, List, Optional, Tuple


class EnergyOrder:
    def __init__(
        self,
        order_type: str,  # SELL (Prosumer) or BUY (Consumer)
        trader_address: str,
        kwh: float,
        price_per_kwh_usd: float,
        energy_source: str = "Solar PV",
        location: str = "Microgrid-Region-01"
    ):
        self.order_id = f"ord-{uuid.uuid4().hex[:8]}"
        self.order_type = order_type
        self.trader_address = trader_address
        self.kwh = round(kwh, 2)
        self.remaining_kwh = round(kwh, 2)
        self.price_per_kwh_usd = round(price_per_kwh_usd, 4)
        self.energy_source = energy_source
        self.location = location
        self.timestamp = time.time()
        self.status = "OPEN"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "order_id": self.order_id,
            "order_type": self.order_type,
            "trader_address": self.trader_address,
            "kwh": self.kwh,
            "remaining_kwh": self.remaining_kwh,
            "price_per_kwh_usd": self.price_per_kwh_usd,
            "total_value_usd": round(self.kwh * self.price_per_kwh_usd, 2),
            "energy_source": self.energy_source,
            "location": self.location,
            "timestamp": self.timestamp,
            "status": self.status
        }


class P2PMicrogridMarket:
    """
    Decentralized P2P Clean Energy Marketplace.
    Matches clean power producers directly with localized consumers.
    """
    def __init__(self):
        self.sell_orders: List[EnergyOrder] = []
        self.buy_orders: List[EnergyOrder] = []
        self.completed_trades: List[Dict[str, Any]] = []
        self.base_utility_rate = 0.18  # Conventional fossil grid rate: $0.18 / kWh
        self._seed_sample_orders()

    def _seed_sample_orders(self):
        """Initializes realistic prosumer & consumer orders."""
        self.sell_orders.append(EnergyOrder(
            order_type="SELL",
            trader_address="0xProsumer_SolarFarm_Adana",
            kwh=450.0,
            price_per_kwh_usd=0.115,
            energy_source="Solar Rooftop Array (High Efficiency)",
            location="Adana Industrial Zone"
        ))
        self.sell_orders.append(EnergyOrder(
            order_type="SELL",
            trader_address="0xProsumer_WindMicrogrid_Izmir",
            kwh=1200.0,
            price_per_kwh_usd=0.108,
            energy_source="Offshore Wind Turbines",
            location="Izmir Coastal Grid"
        ))
        self.sell_orders.append(EnergyOrder(
            order_type="SELL",
            trader_address="0xProsumer_BatteryStorage_Bursa",
            kwh=300.0,
            price_per_kwh_usd=0.125,
            energy_source="Lithium-Iron Phosphate BESS Microgrid",
            location="Bursa Smart District"
        ))

        self.buy_orders.append(EnergyOrder(
            order_type="BUY",
            trader_address="0xEnterprise_Amazon",
            kwh=800.0,
            price_per_kwh_usd=0.120,
            energy_source="Any Clean Renewable",
            location="Cloud Data Center West"
        ))
        self.buy_orders.append(EnergyOrder(
            order_type="BUY",
            trader_address="0xCity_Istanbul_Transit",
            kwh=500.0,
            price_per_kwh_usd=0.118,
            energy_source="Solar Preferred",
            location="Metro Light Rail Station 4"
        ))

    def calculate_dynamic_tariff(self, supply_kwh: float, demand_kwh: float) -> Dict[str, Any]:
        """
        AI Dynamic Equilibrium Tariff Algorithm:
        Determines optimal market-clearing rate balancing supply and demand.
        """
        if supply_kwh <= 0:
            ratio = 2.0
        else:
            ratio = demand_kwh / max(1.0, supply_kwh)

        # Scale pricing smoothly between $0.08 and $0.15
        dynamic_rate = self.base_utility_rate * (0.55 + 0.30 * min(ratio, 1.8))
        dynamic_rate = max(0.08, min(0.15, dynamic_rate))
        
        savings_vs_utility_pct = round(((self.base_utility_rate - dynamic_rate) / self.base_utility_rate) * 100, 1)

        return {
            "dynamic_tariff_usd_per_kwh": round(dynamic_rate, 4),
            "conventional_utility_rate_usd": self.base_utility_rate,
            "consumer_savings_pct": savings_vs_utility_pct,
            "market_supply_kwh": round(supply_kwh, 2),
            "market_demand_kwh": round(demand_kwh, 2),
            "grid_stress_index": round(min(1.0, ratio / 1.5), 2)
        }

    def place_order(
        self,
        order_type: str,
        trader_address: str,
        kwh: float,
        price_per_kwh_usd: Optional[float] = None,
        energy_source: str = "Solar PV",
        location: str = "Local Substation"
    ) -> EnergyOrder:
        """Places a new order into the decentralized book."""
        if price_per_kwh_usd is None:
            # Auto-price with AI dynamic tariff
            metrics = self.get_market_state()
            price_per_kwh_usd = metrics["dynamic_tariff"]["dynamic_tariff_usd_per_kwh"]

        order = EnergyOrder(
            order_type=order_type.upper(),
            trader_address=trader_address,
            kwh=kwh,
            price_per_kwh_usd=price_per_kwh_usd,
            energy_source=energy_source,
            location=location
        )
        if order.order_type == "SELL":
            self.sell_orders.append(order)
            self.sell_orders.sort(key=lambda x: x.price_per_kwh_usd)  # Cheapest sellers first
        else:
            self.buy_orders.append(order)
            self.buy_orders.sort(key=lambda x: x.price_per_kwh_usd, reverse=True)  # Highest bidders first
        return order

    def execute_match(self, buyer_address: str, seller_order_id: str, kwh_requested: float) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Executes immediate atomic match against a specific sell order.
        Returns match payload suitable for on-chain block transaction.
        """
        target_order = None
        for order in self.sell_orders:
            if order.order_id == seller_order_id and order.status == "OPEN":
                target_order = order
                break

        if not target_order:
            return False, f"Order '{seller_order_id}' not found or already closed", {}

        if kwh_requested <= 0:
            return False, "Requested kWh must be greater than zero", {}

        trade_kwh = min(kwh_requested, target_order.remaining_kwh)
        total_cost = round(trade_kwh * target_order.price_per_kwh_usd, 2)
        co2_avoided_kg = round(trade_kwh * 0.82, 2)

        target_order.remaining_kwh -= trade_kwh
        if target_order.remaining_kwh <= 0.01:
            target_order.status = "FILLED"
            self.sell_orders.remove(target_order)

        trade_receipt = {
            "trade_id": f"trade-{uuid.uuid4().hex[:10]}",
            "buyer": buyer_address,
            "seller": target_order.trader_address,
            "kwh": trade_kwh,
            "price_per_kwh_usd": target_order.price_per_kwh_usd,
            "total_price_usd": total_cost,
            "energy_source": target_order.energy_source,
            "co2_avoided_kg": co2_avoided_kg,
            "timestamp": time.time()
        }
        self.completed_trades.append(trade_receipt)
        return True, "MATCH_EXECUTED: Trade ready for blockchain settlement", trade_receipt

    def get_market_state(self) -> Dict[str, Any]:
        """Returns comprehensive orderbook and market indicators."""
        total_supply = sum(o.remaining_kwh for o in self.sell_orders if o.status == "OPEN")
        total_demand = sum(o.remaining_kwh for o in self.buy_orders if o.status == "OPEN")
        tariff_data = self.calculate_dynamic_tariff(total_supply, total_demand)

        return {
            "open_sell_orders": [o.to_dict() for o in self.sell_orders if o.status == "OPEN"],
            "open_buy_orders": [o.to_dict() for o in self.buy_orders if o.status == "OPEN"],
            "recent_trades": self.completed_trades[-10:],
            "dynamic_tariff": tariff_data,
            "total_co2_avoided_kg": round(sum(t["co2_avoided_kg"] for t in self.completed_trades), 2),
            "total_volume_traded_kwh": round(sum(t["kwh"] for t in self.completed_trades), 2)
        }
