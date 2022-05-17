import React from 'react';
import './sozlamalar.css';
import Navbar from '../../component/navbar/Navbar';
import Sidebar from '../../component/sidebar/Sidebar';
import SozlamalarContent from './sozlamalarContent/SozlamalarContent';
import AllSidebarData from '../../component/allSidebarData/AllSidebarData';

export default function Sozlamalar() {
    return (
        <div style={{ height: "100vh" }}>
            <Navbar />

            <div className="page-content" style={{ height: "100%" }}>
                {/* <Sidebar /> */}
                <AllSidebarData />

                <div className="content-wrapper">
                    <div className="content-inner">
                        <SozlamalarContent />
                    </div>
                </div>
            </div >
        </div>
    )
}
