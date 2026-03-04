import TokenProvider from "./tokenProvider";
import EmployeeProvider from "./employeeProvider";
import NavbarProvider from "./navbarProvider";
export default function ContextProvider({ children }) {
  return (
    <TokenProvider>
      <EmployeeProvider>
        <NavbarProvider>
          {children}
        </NavbarProvider>
      </EmployeeProvider>
    </TokenProvider>
  );
}
