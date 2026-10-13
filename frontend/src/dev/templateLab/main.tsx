import { createRoot } from "react-dom/client";

import "../../index.css";
import TemplateLab from "./TemplateLab";

// Templates are rendered outside of React's tree (like for the PDF download), where hot updates can't reach them:
// reload instead, the settings are kept in the URL
if (import.meta.hot) {
    import.meta.hot.on("vite:beforeUpdate", () => window.location.reload());
}

createRoot(document.getElementById("root") as HTMLElement).render(<TemplateLab />);
