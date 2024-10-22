import CheckMark from "../CheckMark/CheckMark";

interface IPricingCardProps {
    name: string;
    title: string;
    price: number;
    featuresList: string[];
    link: string;
    footNote?: string;
}

const PricingCard = ({ name, title, price, featuresList, link, footNote }: IPricingCardProps) => {
    return (
        <div className="rounded-2xl shadow-xl border-2 
         hover:border-blue-500/40 transition-all duration-300">
            <div className="p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                        <p className="mt-2 text-gray-500">{title}</p>
                    </div>
                </div>
                <div className="mt-8">
                    <p className="flex items-baseline">
                        <span className="text-5xl font-bold tracking-tight text-gray-900">${price}</span>
                        <span className="ml-2 text-gray-500">/year {footNote ? "*" : null}</span>
                    </p>
                </div>

                <ul className="mt-8 space-y-4">
                    {featuresList.map((feature) => (
                        <li key={feature} className="flex items-center space-x-3">
                            <CheckMark />
                            <span className="text-gray-600">{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-8">
                    <a href={link}
                        className="mx-auto text-center block w-5/6 bg-blue-500 hover:bg-blue-600 text-white py-2 text-lg font-semibold
                     rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        Get started
                    </a>
                </div>
                <p aria-hidden={!footNote} className={`mt-4 text-sm text-center text-gray-500 ${footNote ? "opacity-100" : "opacity-0"}`}>
                    * {footNote}
                </p>
            </div>
        </div>
    );
};

export default PricingCard;