'use strict'

import AUTH_FORM from "./pages/auth/layout.js";
import DASHBOARD from "./components/dashboard/dashboard.js";
import PORTAL from "./components/portal/portal.js";
import NOTFOUND from "./pages/notfound.js";
import {getPayloadToken} from "../utils/Token.js";

function App(mainContent) {
    const payload = getPayloadToken();
    if (payload) {
       const role = payload.role;
       switch (role) {
            case "SUPERADMIN":
                DASHBOARD(location.pathname, mainContent)
                break;
            case "ADMIN":
                PORTAL(location.pathname, mainContent)
                break;
            default:
                NOTFOUND(location.pathname, mainContent)
                return;
        }
    } else {
        AUTH_FORM(location.pathname, mainContent)
    }
}

export default App;
