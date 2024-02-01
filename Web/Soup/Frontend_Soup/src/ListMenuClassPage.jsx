import DescMenuComponent from "./DescMenuComponent";
import ImageListMenuClassComponent from "./ImageListMenuClassComponent";

import { useParams } from 'react-router';

const ListMenuClassPage = () => {
    const {type_name} = useParams()

    return(
        <div>
            <DescMenuComponent typeName={type_name}/>
            <ImageListMenuClassComponent typeName={type_name}/>
        </div>
    )
}

export default ListMenuClassPage