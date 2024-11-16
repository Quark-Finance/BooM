import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const tokens = [
  { name: 'Solana', symbol: 'SOL', price: '$20.45' },
  { name: 'Base', symbol: 'BASE', price: '$0.75' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,145.67' },
]

export default function Marketplace() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-2 gap-4">
        {tokens.map((token) => (
          <Card key={token.symbol} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{token.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{token.symbol}</p>
              <p className="text-lg font-semibold">{token.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}