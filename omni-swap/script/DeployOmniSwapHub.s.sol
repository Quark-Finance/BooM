// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";
import { IOFT, SendParam, OFTReceipt } from "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";
import { OptionsBuilder } from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import { MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { OmniSwapHub } from "../contracts/OmniSwapHub.sol";




contract SendSwap is Script {

    OmniSwapHub public omniSwapHub;

    

    function setUp() public {}

    function run() public {

        //uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast();

        address owner = 0x000ef5F21dC574226A06C76AAE7060642A30eB74;

        address omniSwapSpokeOP = 0xe8fA696FC058826f001c9B35627b548D94F85BbA;
        uint32  OPEid = 40232;
        uint32 ArbEid = 40231;

        omniSwapHub = new OmniSwapHub(owner);

        omniSwapHub.setSwapper(ArbEid, omniSwapSpokeOP);

        address oftInArb = 0xa56F2Eb760131C39f2ddF4c6D4d245E3d5a1d796; // USDC 
        address oftInUni = 0x64e8C6db52bC99c39d7c2DEB0F9CD52848a5772b;
        address oftOutOP = 0x15906379703940bc51a5881Ad1a5fc481Ebc8bB1; // USDC

        uint256 amount = 0.0001 ether;

        OFT(oftOutOP).approve(address(omniSwapHub), amount);

        omniSwapHub.swapTokenOn{value: 0.02 ether}(oftOutOP, oftInArb, ArbEid, amount);

        console.log("---- OmniSwapHub deployed ----");
        console.log("ChainId: ", block.chainid);
        console.log("OmniSwapHub Address: ", address(omniSwapHub));
        
        vm.stopBroadcast();
        
    }
}