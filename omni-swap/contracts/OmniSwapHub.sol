// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { IOAppComposer } from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppComposer.sol";
import { OFTComposeMsgCodec } from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IOFT, SendParam, OFTReceipt } from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";




contract OmniSwapHub is Ownable {

    using OptionsBuilder for bytes;

    mapping(uint32 => address) public eidToSwappers;

    constructor(address _owner) Ownable(_owner){

    }

    function setSwapper(uint32 _eid, address _swapper) public onlyOwner {
        eidToSwappers[_eid] = _swapper;
    }

    function swapTokenOn(address _inputOFT, address _outputOFT, uint32 _targetEid, uint256 _amount) public payable{
        // IMPORTANT: inputOFT is a token address on hub chain, outputOFT is a token address on target chain\

        require(OFT(_inputOFT).balanceOf(msg.sender) >= _amount, "Insufficient Balance of Input Token");

        OFT(_inputOFT).transferFrom(msg.sender, address(this), _amount);

        bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0).addExecutorLzComposeOption(0, 600000, 0.01 ether);

        bytes memory composeMsg = abi.encode(msg.sender, _outputOFT);

        SendParam memory sendParam = SendParam(
            _targetEid,
            bytes32(uint256(uint160(eidToSwappers[_targetEid]))),
            _amount,
            _amount,
            options,
            composeMsg,
            ""
        );

        IOFT(_inputOFT).send{value: msg.value}(sendParam, MessagingFee(msg.value, 0), msg.sender);

    }

}
