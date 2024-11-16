// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {PoolManager} from "v4-core/src/PoolManager.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {PoolModifyLiquidityTest} from "v4-core/src/test/PoolModifyLiquidityTest.sol";
import {PoolDonateTest} from "v4-core/src/test/PoolDonateTest.sol";
import {PoolTakeTest} from "v4-core/src/test/PoolTakeTest.sol";
import {PoolClaimsTest} from "v4-core/src/test/PoolClaimsTest.sol";

import "forge-std/console.sol";

contract V4Deployer is Script {
    function run() public {
        vm.startBroadcast();

        address owner = 0x000ef5F21dC574226A06C76AAE7060642A30eB74;

        PoolManager manager = new PoolManager(owner);
        console.log("Deployed PoolManager at", address(manager));
        PoolSwapTest swapRouter = new PoolSwapTest(manager);
        console.log("Deployed PoolSwapTest at", address(swapRouter));
        PoolModifyLiquidityTest modifyLiquidityRouter = new PoolModifyLiquidityTest(
                manager
            );
        console.log(
            "Deployed PoolModifyLiquidityTest at",
            address(modifyLiquidityRouter)
        );
        PoolDonateTest donateRouter = new PoolDonateTest(manager);
        console.log("Deployed PoolDonateTest at", address(donateRouter));
        PoolTakeTest takeRouter = new PoolTakeTest(manager);
        console.log("Deployed PoolTakeTest at", address(takeRouter));
        PoolClaimsTest claimsRouter = new PoolClaimsTest(manager);
        console.log("Deployed PoolClaimsTest at", address(claimsRouter));

        vm.stopBroadcast();
    }
}