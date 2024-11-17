// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

import {IBitcoinPod} from "@bitdsm/interfaces/IBitcoinPod.sol";
import {IBitcoinPodManager} from "@bitdsm/interfaces/IBitcoinPodManager.sol";
import {IAppRegistry} from "@bitdsm/interfaces/IAppRegistry.sol";

contract BitLST is OFT {

    IBitcoinPodManager public bitcoinPodManager;
    IAppRegistry public appRegistry;
    


    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        address _bitcoinPodManager,
        address _appRegistry
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) Ownable(_delegate) {
        require(_bitcoinPodManager != address(0), "Invalid BitcoinPodManager");
        bitcoinPodManager = IBitcoinPodManager(_bitcoinPodManager);
        appRegistry = IAppRegistry(_appRegistry);
    }
}
