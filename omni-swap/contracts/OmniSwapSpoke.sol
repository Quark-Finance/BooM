// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { IOAppComposer } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppComposer.sol";
import { OFTComposeMsgCodec } from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IOFT, SendParam, OFTReceipt } from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

//import { OAppSender } from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
//import { OApp,MessagingFee, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";


contract OmniSwapSpoke is IOAppComposer {

    using OptionsBuilder for bytes;

    

    address public lzEndpoint;

    event ComposeSwap(address indexed oapp, address indexed swapper, address indexed outputOFT, uint256 amountIn);



    constructor(address _lzEndpoint)    {
        lzEndpoint = _lzEndpoint;
    }


    

    function lzCompose(
        address _OApp, // should be the address of the OFT? 
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata /*_extraData*/
    ) external payable {

        require(msg.sender == lzEndpoint, "Only LZ endpoint can compose");

        uint256 amountIn = OFTComposeMsgCodec.amountLD(_message);

        (address _swapper, address _outputOFT) = abi.decode(OFTComposeMsgCodec.composeMsg(_message), (address, address));

        // Swap Logic Here

        uint256 amountOut = amountIn/2;

        bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0).addExecutorLzComposeOption(0, 500000, 0);


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

        emit ComposeSwap(_OApp, _swapper, _outputOFT, amountIn);
        
    }
}
