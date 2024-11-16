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

        address omniSwapSpokeOP = 0x9586FA0a7B039531411ceAD42616c7751Ceec296;
        uint32  OPEid = 40232;

        omniSwapHub = new OmniSwapHub(owner);

        omniSwapHub.setSwapper(OPEid, omniSwapSpokeOP);

        address oftInArb = 0x6fD36fd6D6f1D8a5E43B33b1881fd4EF167b6588; // USDC 
        address oftOutOP = 0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC;

        uint256 amount = 0.001 ether;

        OFT(oftInArb).approve(address(omniSwapHub), amount);

        console.log("token: ", OFT(oftInArb).token());

        omniSwapHub.swapTokenOn{value: 0.01 ether}(oftInArb, oftOutOP, OPEid, amount);

        console.log("---- OmniSwapHub deployed ----");
        console.log("ChainId: ", block.chainid);
        console.log("OmniSwapHub Address: ", address(omniSwapHub));
        
        vm.stopBroadcast();
        
    }
}