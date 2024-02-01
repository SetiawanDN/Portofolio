import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetItemList2() {
  const [loading, setLoading] = useState(true);
  const [itemData2, setItemData2] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(()=>{
      async function getItemData2(){
          setLoading(true);

          const res = await axios(
              `${apiUrl}/api/Category/GetAll`
          )

          const {data, status} = res

          if(status!=200) return
          setLoading(false);
          setItemData2(data)
      }
      getItemData2()
  }, [setItemData2])

  return { loading, itemData2 };
}
