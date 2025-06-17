import React from "react";
import { MenuItemList } from "../Components/Page/Home";
import Banner from "../Components/Page/Common/Banner";

function Home(){
    return(
        <div>
            <Banner></Banner>
            <div className="container p-2">
            <MenuItemList></MenuItemList>
            </div>
        </div>
    )
}
export default Home