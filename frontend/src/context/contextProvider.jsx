import TokenProvider from "./tokenProvider";
import EmployeeProvider from "./employeeProvider";
import NavbarProvider from "./navbarProvider";
import ShowInfoProvider from "./showInfoProvider";

export default function ContextProvider({ children }) {
  return (
    <TokenProvider>
      <EmployeeProvider>
        <NavbarProvider>
          <ShowInfoProvider>
            {children}
          </ShowInfoProvider>
        </NavbarProvider>
      </EmployeeProvider>
    </TokenProvider>
  );
}
