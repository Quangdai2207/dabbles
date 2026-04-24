import { useState } from "react";
import Turnstile from "react-turnstile";
const App = () => {
   const [captchaToken, setCaptchaToken] = useState("");

   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
         }}
      >
         <h1>Captcha Test</h1>
         <Turnstile
            sitekey="0x4AAAAAABHQ6Ou0TPewsB45"
            onVerify={(token) => {
               setCaptchaToken(token);
            }}
         />

         {captchaToken && (
            <>
               <p>{captchaToken}</p>
               <button
                  onClick={() => {
                     navigator.clipboard.writeText(captchaToken);
                  }}
                  style={{
                     marginLeft: "1rem",
                  }}
               >
                  Copy
               </button>
            </>
         )}
      </div>
   );
};

export default App;
