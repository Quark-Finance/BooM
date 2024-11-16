"use client"

import { MiniKit, WalletAuthInput } from '@worldcoin/minikit-js'

    const signInWithWallet = async () => {
        if (!MiniKit.isInstalled()) {
            return
        }
    
        const res = await fetch(`/api/nonce`)
        const { nonce } = await res.json()
        
        const walletAuthForm: WalletAuthInput = 
        {
            nonce: nonce,
            // requestId: '0', // Optional
            expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            statement: 'Ethereum Wallet Login https://worldcoin.com/apps',
        }

        const { commandPayload: generateMessageResult, finalPayload } = await MiniKit.commandsAsync.walletAuth(
            walletAuthForm
        )
    
        if (finalPayload.status === 'error') {
            return
        } else {
            const response = await fetch('/api/complete-siwe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payload: finalPayload,
                    nonce,
                }),
            })
            const walletAddress = MiniKit.walletAddress
            console.log(walletAddress)
        }
    }



export const SignInWithEthereum = () => {
    return(
        <button className='rounded-md p-2 bg-blue-500' onClick={signInWithWallet}> Sign In With Ethereum </ button>
    )
}