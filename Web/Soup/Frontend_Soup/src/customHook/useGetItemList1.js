import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetItemList1() {
  const [loading, setLoading] = useState(true);
  const [itemData1, setItemData1] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
      async function getItemData1(){
        setLoading(true);

        const res = await axios(
          `${apiUrl}/api/Product/GetLimitRandom`
        );

        const { data, status } = res;

        if (status != 200) return;
        setLoading(false);
        setItemData1(data);
      }

      getItemData1();
  }, [setItemData1]);

  return { loading, itemData1 };
}
