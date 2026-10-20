// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title P2PEnergyMarket
 * @dev IEEE ClimateChain Track 2: Renewable Energy & Energy Trading Reference Contract.
 * Implements decentralized escrow, microgrid order matching, and atomic settlements
 * between renewable prosumers (solar/wind) and localized consumers.
 */

contract P2PEnergyMarket {
    address public immutable marketAdmin;
    uint256 public totalVolumeTradedKwh;
    uint256 public totalTradesCount;

    enum OrderType { SELL, BUY }
    enum OrderStatus { OPEN, FILLED, CANCELLED }

    struct EnergyOrder {
        bytes32 orderId;
        OrderType orderType;
        address trader;
        uint256 kwhAmount;
        uint256 remainingKwh;
        uint256 pricePerKwhWei; // in Wei per kWh
        string energySource;
        string gridLocation;
        OrderStatus status;
        uint256 createdAt;
    }

    mapping(bytes32 => EnergyOrder) public orders;
    bytes32[] public activeOrderIds;

    event OrderCreated(
        bytes32 indexed orderId,
        OrderType indexed orderType,
        address indexed trader,
        uint256 kwhAmount,
        uint256 pricePerKwhWei,
        string energySource
    );

    event TradeExecuted(
        bytes32 indexed tradeId,
        bytes32 indexed orderId,
        address indexed buyer,
        address seller,
        uint256 kwhTraded,
        uint256 totalCostWei,
        uint256 co2AvoidedGrams
    );

    modifier onlyAdmin() {
        require(msg.sender == marketAdmin, "UNAUTHORIZED");
        _;
    }

    constructor() {
        marketAdmin = msg.sender;
    }

    function createSellOrder(
        uint256 kwhAmount,
        uint256 pricePerKwhWei,
        string calldata energySource,
        string calldata gridLocation
    ) external returns (bytes32) {
        require(kwhAmount > 0, "INVALID_KWH");
        require(pricePerKwhWei > 0, "INVALID_PRICE");

        bytes32 orderId = keccak256(abi.encodePacked(msg.sender, block.timestamp, kwhAmount));
        orders[orderId] = EnergyOrder({
            orderId: orderId,
            orderType: OrderType.SELL,
            trader: msg.sender,
            kwhAmount: kwhAmount,
            remainingKwh: kwhAmount,
            pricePerKwhWei: pricePerKwhWei,
            energySource: energySource,
            gridLocation: gridLocation,
            status: OrderStatus.OPEN,
            createdAt: block.timestamp
        });

        activeOrderIds.push(orderId);
        emit OrderCreated(orderId, OrderType.SELL, msg.sender, kwhAmount, pricePerKwhWei, energySource);
        return orderId;
    }

    /**
     * @notice Purchases clean energy directly from an open prosumer sell order with atomic payment escrow.
     */
    function buyEnergy(bytes32 orderId, uint256 kwhRequested) external payable {
        EnergyOrder storage order = orders[orderId];
        require(order.status == OrderStatus.OPEN, "ORDER_NOT_ACTIVE");
        require(order.orderType == OrderType.SELL, "NOT_A_SELL_ORDER");
        require(kwhRequested > 0, "INVALID_REQUEST_KWH");
        require(kwhRequested <= order.remainingKwh, "INSUFFICIENT_ENERGY_AVAILABLE");

        uint256 totalCost = kwhRequested * order.pricePerKwhWei;
        require(msg.value >= totalCost, "INSUFFICIENT_PAYMENT");

        order.remainingKwh -= kwhRequested;
        if (order.remainingKwh == 0) {
            order.status = OrderStatus.FILLED;
        }

        // Direct payment to clean energy seller
        (bool success, ) = payable(order.trader).call{value: totalCost}("");
        require(success, "SETTLEMENT_TRANSFER_FAILED");

        // Refund excess payment
        if (msg.value > totalCost) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
            require(refundSuccess, "REFUND_FAILED");
        }

        totalVolumeTradedKwh += kwhRequested;
        totalTradesCount += 1;
        uint256 co2AvoidedGrams = kwhRequested * 820; // 820g per kWh

        bytes32 tradeId = keccak256(abi.encodePacked(orderId, msg.sender, block.timestamp));
        emit TradeExecuted(tradeId, orderId, msg.sender, order.trader, kwhRequested, totalCost, co2AvoidedGrams);
    }
}
