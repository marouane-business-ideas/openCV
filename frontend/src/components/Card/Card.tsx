
import type { JSX } from "react";

const Card = ({ children }: { children: JSX.Element[] | JSX.Element }) => (
    <div className="w-full flex flex-col shadow-lg p-5">{children}</div>
);

export default Card;