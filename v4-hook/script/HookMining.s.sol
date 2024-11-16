
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {PoolManager} from "v4-core/src/PoolManager.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {PoolModifyLiquidityTest} from "v4-core/src/test/PoolModifyLiquidityTest.sol";
import {PoolDonateTest} from "v4-core/src/test/PoolDonateTest.sol";
import {PoolTakeTest} from "v4-core/src/test/PoolTakeTest.sol";
import {PoolClaimsTest} from "v4-core/src/test/PoolClaimsTest.sol";
import {MockERC20} from "solmate/src/test/utils/mocks/MockERC20.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {HookMiner} from "./HookMiner.sol";

import { RewardHook } from "../src/RewardHook.sol";


import "forge-std/console.sol";

contract HookMiningScript is Script {

//       Deployed PoolManager at 0x74Bb711D032B5Df4F63dc04EA4422807D768aC08
//   Deployed PoolSwapTest at 0x9d8F28B52504112A8C89df9095ca3BF346286787
//   Deployed PoolModifyLiquidityTest at 0x5F1933923909C6a65a6769fA0d6F157857e33c48
//   Deployed PoolDonateTest at 0x3546914261a14D476671B02498420aDBbE7cA69A
//   Deployed PoolTakeTest at 0xA261F923654Eb93Ab6c35D285d58c8a01D42F792
//   Deployed PoolClaimsTest at 0x53a3A188943C94442D76396ba682b09a1e66517F



    PoolManager manager =
        PoolManager(0x536527976E98E253B424a3655E695D144E343341);
    PoolSwapTest swapRouter =
        PoolSwapTest(0x69801C169647Ad125707Dd40096D4EDC20Bb521a);
    PoolModifyLiquidityTest modifyLiquidityRouter =
        PoolModifyLiquidityTest(0x440D0bEe5706987be528Fec5C4cA5947E38161d2);

    Currency token0;
    Currency token1;

    PoolKey key;

    function setUp() public {
        vm.startBroadcast();

        MockERC20 tokenA = MockERC20(0x15906379703940bc51a5881Ad1a5fc481Ebc8bB1);
        MockERC20 tokenB = MockERC20(0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC);
        address owner = 0x000ef5F21dC574226A06C76AAE7060642A30eB74;

        // address tokenA = 0x15906379703940bc51a5881Ad1a5fc481Ebc8bB1; //USDC
        // address tokenB = 0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC; // PEPE


        if (address(tokenA) > address(tokenB)) {
            (token0, token1) = (
                Currency.wrap(address(tokenB)),
                Currency.wrap(address(tokenA))
            );
        } else {
            (token0, token1) = (
                Currency.wrap(address(tokenA)),
                Currency.wrap(address(tokenB))
            );
        }

        tokenA.approve(address(modifyLiquidityRouter), type(uint256).max);
        tokenB.approve(address(modifyLiquidityRouter), type(uint256).max);
        tokenA.approve(address(swapRouter), type(uint256).max);
        tokenB.approve(address(swapRouter), type(uint256).max);

        tokenA.mint(msg.sender, 1000000000000000 * 10 ** 18);
        tokenB.mint(msg.sender, 1000000000000000 * 10 ** 18);

        // Mine for hook address
        vm.stopBroadcast();

        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);

        address CREATE2_DEPLOYER = 0x4e59b44847b379578588920cA78FbF26c0B4956C;
        (address hookAddress, bytes32 salt) = HookMiner.find(
            CREATE2_DEPLOYER,
            flags,
            type(RewardHook).creationCode,
            abi.encode(address(manager))
        );

        vm.startBroadcast();
        RewardHook hook = new RewardHook{salt: salt}(manager);

        console.log("Hook address:", address(hook));

        hook.setRewardToken(address(tokenB), address(tokenA), address(tokenA));


        require(address(hook) == hookAddress, "hook address mismatch");

        key = PoolKey({
            currency0: token0,
            currency1: token1,
            fee: 3000,
            tickSpacing: 120,
            hooks: hook
        });

        // the second argument here is SQRT_PRICE_1_1
        manager.initialize(key, 79228162514264337593543950336);
        vm.stopBroadcast();
    }

    function run() public {
        vm.startBroadcast();
        modifyLiquidityRouter.modifyLiquidity(
            key,
            IPoolManager.ModifyLiquidityParams({
                tickLower: -120,
                tickUpper: 120,
                liquidityDelta: 10000e18,
                salt: 0
            }),
            new bytes(0)
        );
        vm.stopBroadcast();
    }
}