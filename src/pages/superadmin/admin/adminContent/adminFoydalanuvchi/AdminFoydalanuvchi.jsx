import React from "react";
import Navbar from "../../../../../component/navbar/Navbar";
import AdminSidebar from '../../../../../component/superAdminSidebar/adminSidebar/AdminSidebar';
import AdminFoydalanuvchiContent from "./adminFoydalanuvchiContent/AdminFoydalanuvchiContent";

export default function AdminFoydalanuvchi() {
    return (
        <div style={{ height: "100vh" }}>
            <Navbar />

            <div className="page-content" style={{ height: "100%" }}>
                <AdminSidebar />
                <div className="content-wrapper">
                    <div className="content-inner">
                        <AdminFoydalanuvchiContent />
                    </div>
                </div>
            </div >
        </div>
    )
}