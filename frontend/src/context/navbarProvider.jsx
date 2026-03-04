import { createContext, useState } from "react";

export const NavbarContext = createContext();

export default function NavbarProvider({ children }) {
  const [navbar, setNavbar] = useState("Dashboard");
  return (
    <NavbarContext.Provider value={[navbar, setNavbar]}>
      {children}
    </NavbarContext.Provider>
  );
}
