'use client'

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

interface TickerProps {
  items: TickerItem[];
}

export function Ticker({ items }: TickerProps) {
  return (
    <div className="bg-wild-black text-white border-y border-black overflow-hidden">
      <div className="animate-ticker inline-block whitespace-nowrap">
        {/* Duplicate the items to create a seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="inline-flex items-center px-4 py-2">
            <span className="font-bold">{item.symbol}</span>
            <span className="mx-2">{item.price}</span>
            <span className={`${item.change >= 0 ? 'text-wild-green' : 'text-wild-orange'}`}>
              {item.change >= 0 ? '+' : ''}{item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 