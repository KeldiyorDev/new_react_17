import React from "react";
import Navbar from "../../../../component/navbar/Navbar";
// import Sidebar from "../../../../component/sidebar/Sidebar";
import YaqinlashmoqdaContent from "./yaqinlashmoqdaContent/YaqinlashmoqdaContent";
import AllSidebarData from '../../../../component/allSidebarData/AllSidebarData';

export default function Yaqinlashmoqda() {
    return (
        <div style={{ height: "100vh" }}>
            <Navbar />

            <div className="page-content" style={{ height: "100%" }}>
                <AllSidebarData />

                <div className="content-wrapper">
                    <div className="content-inner">
                        <YaqinlashmoqdaContent itemsPerPage={6} />
                    </div>
                </div>
            </div >
        </div>
    )
}