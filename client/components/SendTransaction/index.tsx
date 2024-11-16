"use client";

import { ERC20 } from '../../abi/ERC20'
import { MiniKit, Tokens } from '@worldcoin/minikit-js'


// ...
const sendTransaction = async () => {
  if (!MiniKit.isInstalled()) {
    return;
  }

  const deadline = Math.floor((Date.now() + 30 * 60 * 1000) / 1000).toString()

  // Transfers can also be at most 1 hour in the future.
  const permitTransfer = {
    permitted: {
      token: "0x7dEd6Ca64EAa02f8bE75a3726D86F23a3600c6A5",
      amount: '10000',
    },
    nonce: Date.now().toString(),
    deadline,
  }

  const permitTransferArgsForm = [
    [permitTransfer.permitted.token, permitTransfer.permitted.amount],
    permitTransfer.nonce,
    permitTransfer.deadline,
  ]

  const transferDetails = {
    to: '0x126f7998Eb44Dd2d097A8AB2eBcb28dEA1646AC8',
    value: '10000',
  }

  const transferDetailsArgsForm = [transferDetails.to, transferDetails.value]

  const {commandPayload, finalPayload} = await MiniKit.commandsAsync.sendTransaction({
    transaction: [
      {
        address: '0x7dEd6Ca64EAa02f8bE75a3726D86F23a3600c6A',
        abi: ERC20,
        functionName: 'transfer',
        args: [ permitTransferArgsForm, transferDetailsArgsForm ],
      },
    ],
    permit2: [
      {
        ...permitTransfer,
        spender: '0x34afd47fbdcc37344d1eb6a2ed53b253d4392a2f',
      },
    ],
  })
}

export const SendTransaction = () => {
	return(
		<button className="bg-blue-500 p-4 rounded-md" onClick={sendTransaction}>
			Send Transaction
		</button>
	)
}
