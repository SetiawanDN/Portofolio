import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetDescMenuComponent(typeName) {
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL
  
  useEffect(() => {
    async function GetType(){
        setLoading(true)
        const res = await axios(
            `${apiUrl}/api/Category/GetById/${typeName}`
        )
        const {data, status} = res
        if(status!=200) return
        setLoading(false)
        setDesc(data)
    }
    GetType();
}, [setDesc])

  return { loading, desc };
}
