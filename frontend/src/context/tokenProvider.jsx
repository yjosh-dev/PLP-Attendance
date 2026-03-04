import { createContext, useEffect, useState } from "react";

export const TokenContext = createContext()

export default function TokenProvider({children}) {
    const [isTokenInvalid, setTokenValidity] = useState(false)
    return (    
      <TokenContext value={[isTokenInvalid, setTokenValidity]}>
         {children}
      </TokenContext>
    )
}