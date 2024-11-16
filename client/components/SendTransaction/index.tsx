export type SendTransactionInput = {
	transaction: Transaction[]
	permit2?: Permit2[] // Optional
}

export type Permit2 = {
	permitted: {
		token: string
		amount: string | unknown
	}
	spender: string
	nonce: string | unknown
	deadline: string | unknown
}

export type Transaction = {
	address: string // Contract address
	abi: Abi | readonly unknown[] // Only include the abi for the function you're calling
	functionName: ContractFunctionName<Abi | readonly unknown[], 'payable' | 'nonpayable'>
	args: ContractFunctionArgs<
		// Wrap all your arguments in strings to avoid overflow errors
		Abi | readonly unknown[],
		'payable' | 'nonpayable',
		ContractFunctionName<Abi | readonly unknown[], 'payable' | 'nonpayable'>
	>
}
