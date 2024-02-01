import DescDetailComponent from "./DescDetailComponent";
import DescMenuComponent from "./DescMenuComponent";
import ImageListMenuClassComponent from "./ImageListMenuClassComponent";

import { useParams } from 'react-router';

const DetailPage = () => {
    const {type_name, id} = useParams()

    return(
        <div>
            <DescDetailComponent typeName={type_name} id={id}/>
            <ImageListMenuClassComponent typeName={type_name} filterID={id} />
        </div>
    )
}

export default DetailPage