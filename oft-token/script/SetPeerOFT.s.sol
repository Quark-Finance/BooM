// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import { BoomOFT } from "../contracts/BooMOFT.sol";



contract DeployOFT is Script {

    BoomOFT public oft;
    

    function setUp() public {}

    function run() public {

        //uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast();

        address owner = 0x000ef5F21dC574226A06C76AAE7060642A30eB74;

        address oftArb = 0xa56F2Eb760131C39f2ddF4c6D4d245E3d5a1d796;
        address oftOP = 0xbA397eFEF3914aB025F7f5706fADE61f240A9EbC;

        uint32 OPEid = 40232;
        uint32 ArbEid = 40231;
        uint32 WorldEid = 40337;

        oft = BoomOFT(oftOP);

        oft.setPeer(ArbEid, bytes32(uint256(uint160(oftArb))));
        
        vm.stopBroadcast();
        
    }
}