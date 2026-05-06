import { createContext, useState } from "react";

export const ShowInfoContext = createContext();

export default function ShowInfoProvider({children}){
   const [isModalOpen, setIsModalOpen] = useState(false)
   return (
      <ShowInfoContext.Provider value={[isModalOpen, setIsModalOpen]}>
        {children}
      </ShowInfoContext.Provider>
   )
}