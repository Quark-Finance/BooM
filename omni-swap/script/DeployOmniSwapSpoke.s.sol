// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

//import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { IOFT, SendParam, OFTReceipt } from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OmniSwapSpoke } from "../contracts/OmniSwapSpoke.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

interface IOFTMintable {
    function mint(address _to, uint256 _amount) external;
}

contract SendSwap is Script {

    OmniSwapSpoke public omniSwapSpoke;

    

    function setUp() public {}

    function run() public {

        //uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast();

        address OPlzEndpoint = 0x6EDCE65403992e310A62460808c4b910D972f10f;

        address oftOutOP = 0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC;

        omniSwapSpoke = new OmniSwapSpoke(OPlzEndpoint);

        IOFTMintable(oftOutOP).mint(address(omniSwapSpoke), 10000000000000 ether);

        console.log("---- OmniSwapSpoke deployed ----");
        console.log("ChainId: ", block.chainid);
        console.log("OmniSwapSpoke Address: ", address(omniSwapSpoke));
        
        vm.stopBroadcast();
        
    }
}