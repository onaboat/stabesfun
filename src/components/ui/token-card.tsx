import { ellipsify } from "./ui-layout";

interface TokenCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  mintAddress: string;
  description: string;
  currency: string;
  symbol: string;
}

export function TokenCard({ imageSrc, altText, title, mintAddress, description, currency, symbol }: TokenCardProps) {
  return (
    <div className="card rounded-none !bg-wild-cream shadow-xl hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] transition-all ">
      <figure className="h-48 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={altText} 
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
      <div className="flex flex-row gap-4">
            <div className="badge badge-primary rounded-none">{symbol}</div>
            <div className="badge badge-outline rounded-none">{currency}</div>
        </div>
        <h2 className="card-title text-xl">{title}</h2>
        <div className="text-xs opacity-75 mb-1">mint: {ellipsify(mintAddress, 8)}</div>
        <p className="text-sm">{description}</p>
        <div className="card-actions flex flex-wrap gap-2 mt-2">
         
        </div>
      </div>
    </div>
  );
} 