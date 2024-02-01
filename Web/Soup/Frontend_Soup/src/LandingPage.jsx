import '@fontsource-variable/montserrat';
import ItemList from "./Komponen/List/ItemList";
import Banner1 from "./Komponen/Banner/Banner1"
import Feature from "./Komponen/Feature/Feature"
import Banner2 from './Komponen/Banner/Banner2';
import ItemList2 from "./Komponen/List/ItemList2";

const LandingPage = () => {
    return(
        <>
          <Banner1/>
          <Feature/>
          <ItemList/>
          <Banner2/>
          <ItemList2/>
        </>
    )
}

export default LandingPage