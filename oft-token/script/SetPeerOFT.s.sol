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

        address oftArb = 0x6fD36fd6D6f1D8a5E43B33b1881fd4EF167b6588;
        address oftOP = 0x15906379703940bc51a5881Ad1a5fc481Ebc8bB1;

        uint32 OPEid = 40232;
        uint32 ArbEid = 40231;

        oft = BoomOFT(oftOP);

        oft.setPeer(ArbEid, bytes32(uint256(uint160(oftArb))));
        
        vm.stopBroadcast();
        
    }
}