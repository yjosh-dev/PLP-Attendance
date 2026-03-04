import { createContext, useState } from "react";

export const EmployeeContext = createContext()

export default function EmployeeProvider({ children }) {
  const [employeeDetails, setEmployeeDetails] = useState(null)

  return (
    <EmployeeContext.Provider value={[employeeDetails, setEmployeeDetails]}>
      {children}
    </EmployeeContext.Provider>
  )
}