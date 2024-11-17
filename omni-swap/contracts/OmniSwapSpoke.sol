// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { IOAppComposer } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppComposer.sol";
import { OFTComposeMsgCodec } from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IOFT, SendParam, OFTReceipt } from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Currency} from "v4-core/src/types/Currency.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";

contract OmniSwapSpoke is IOAppComposer, Ownable {

    using OptionsBuilder for bytes;

    PoolSwapTest public swapRouter;
    IHooks public hook;

    uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    

    address public lzEndpoint;

    event ComposeSwap(address indexed oapp, address indexed swapper, address indexed outputOFT, uint256 amountIn);



    constructor(address _lzEndpoint)   Ownable(msg.sender) {
        lzEndpoint = _lzEndpoint;
    }

    function configurePool(address _swapRouter, address _hook) public onlyOwner {
        swapRouter = PoolSwapTest(_swapRouter);
        hook = IHooks(_hook);
    }


    

    function lzCompose(
        address _inputOFT, // should be the address of the OFT? 
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata /*_extraData*/
    ) external payable {

        require(msg.sender == lzEndpoint, "Only LZ endpoint can compose");

        uint256 amountIn = OFTComposeMsgCodec.amountLD(_message);

        (address _swapper, address _outputOFT) = abi.decode(OFTComposeMsgCodec.composeMsg(_message), (address, address));

        // Swap Logic Here

        Currency token0;
        Currency token1;

        if (address(_outputOFT) > address(_inputOFT)) {
            (token0, token1) = (
                Currency.wrap(address(_inputOFT)),
                Currency.wrap(address(_outputOFT))
            );
        } else {
            (token0, token1) = (
                Currency.wrap(address(_outputOFT)),
                Currency.wrap(address(_inputOFT))
            );
        }

        // OFT(_inputOFT).approve(address(swapRouter), amountIn);

        PoolKey memory key = PoolKey({
            currency0: token0,
            currency1: token1,
            fee: 3000,
            tickSpacing: 120,
            hooks: hook
        });

        // swapRouter.swap(key, IPoolManager.SwapParams({
        //     zeroForOne: true,
        //     amountSpecified: int256(amountIn),
        //     sqrtPriceLimitX96: MIN_PRICE_LIMIT 
        // }), PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false}), new bytes(0));


        uint256 amountOut = amountIn/2;




        bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);


        SendParam memory sendParam = SendParam(
            OFTComposeMsgCodec.srcEid(_message),
            bytes32(uint256(uint160(_swapper))),
            amountOut,
            amountOut,
            options,
            "",
            ""
        );
        
        
        OFT(_outputOFT).send{value: msg.value}(sendParam, MessagingFee(msg.value, 0), _swapper);

        emit ComposeSwap(Currency.unwrap(token0), _swapper,  Currency.unwrap(token1), amountIn);
        
    }
}
