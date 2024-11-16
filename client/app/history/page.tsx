const transactions = [
  { id: 1, type: 'Buy', token: 'SOL', amount: '10', price: '$204.50', date: '2023-11-15' },
  { id: 2, type: 'Sell', token: 'ETH', amount: '0.5', price: '$1,072.83', date: '2023-11-14' },
  { id: 3, type: 'Buy', token: 'BASE', amount: '100', price: '$75.00', date: '2023-11-13' },
]

export default function TransactionHistory() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li key={tx.id} className="bg-card rounded-lg p-4 shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{tx.type} {tx.token}</p>
                <p className="text-sm text-muted-foreground">{tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{tx.amount} {tx.token}</p>
                <p className="text-sm text-muted-foreground">{tx.price}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}