import React, { useState } from "react";
import './shaharTumanContent.css';
import HududNavbar from "../../hududNavbar/HududNavbar";

let d = [
    { id: 1, nomlanishi: "Buxoro shahar", viloyat: "Buxoro viloyat" },
    { id: 2, nomlanishi: "Buxoro tuman", viloyat: "Buxoro viloyat" },
    { id: 3, nomlanishi: "Olot tuman", viloyat: "Buxoro viloyat" }
];

export default function ShahartumanContent() {
    const [updateModal, setUpdateModal] = useState({ open: false, obj: {} });
    const [deleteModal, setDeleteModal] = useState({ delete: false, obj: {} });
    const [data, setData] = useState(d);

    const clickEnter = (e, index) => {
        console.log(index);
        console.log(e);
        if (e.code === "Enter") {
            data[index].id = parseInt((e.target.value));
            let arr = data.sort((a, b) => {
                return a.id - b.id;
            });
            console.log(arr);
            setData(arr);
        }
    }

    // update data
    const updatedData = (id) => {
        let nom = document.querySelector('.inputNom').value;
        let vil = document.querySelector('.inputVil').value;

        let arr = data.map((d, index) => {
            if (d.id === id) {
                d.nomlanishi = nom;
                d.viloyat = vil;
            }
            return d;
        }).sort((a, b) => {
            return a - b;
        })
        setData(arr);
        setUpdateModal({ open: false, obj: {} });
    }

    // delete data
    const deletedData = (id) => {
        let arr = data.filter((d, index) => {
            return d.id !== id;
        }).sort((a, b) => {
            return a - b;
        })
        console.log(arr);
        setData(arr);
        setDeleteModal({ delete: false, obj: {} });
    }

    return (
        <div className="content mb-5">

            <h3 style={{ margin: "10px 0 0 20px", fontWeight: "bold", textTransform: "upperCase" }}>Shahar va tumanlar</h3>
            <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-solid-custom bg-primary NavLink" style={{ borderTopRightRadius: "5px",borderTopLeftRadius: "5px"}}>
                    <HududNavbar />
                </ul>
                <div className="tab-content">
                    <div className="tab-pane fade show active" id="colored-tab1">
                        <div className="card">
                            <div className="card-body" style={{ padding: "30px" }}>
                                {/* <!-- form --> */}
                                <form className="mt-3">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <div className="form-group">
                                                <select data-placeholder="Viloyat" className="form-control select-search  form-control-outline select" >
                                                    <option></option>
                                                    <optgroup label="Viloyat">
                                                        <option value="AZ">Buxoro viloyat</option>
                                                        <option value="CO">Navoiy Viloyat</option>
                                                        <option value="CO">Samarqand Viloyat</option>
                                                    </optgroup>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group form-group-floating row">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <input type="text" className="form-control form-control-outline" placeholder="Placeholder" />
                                                        <label className="label-floating">Nomlanishi</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <button type="submit" style={{ width: "150px", height: "55px" }} className="btn btn-primary"><i className="icon-floppy-disk"></i> Saqlash</button>
                                        </div>
                                        {/* <div className="col-lg-2">
                                            <button type="submit" style={{ width: "150px", height: "55px" }} className="btn btn-primary"><i className="icon-sort"></i> Sort</button>
                                        </div> */}
                                    </div>
                                </form>
                                {/* <!-- end form --> */}

                                <table className="table mt-2 table-bordered datatable-select-single table-striped table-hover Tab" >
                                    <thead>
                                        <tr className="bg-dark text-white NavLink text-center">
                                            <th style={{ width: "5%" }}>№</th>
                                            <th style={{ width: "40%" }}>Nomlanishi</th>
                                            <td style={{ width: "40%" }}>Viloyat</td>
                                            <th style={{ width: "15%" }}>Harakatlar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((dat, index) => (
                                            <tr key={index} className="text-center">
                                                <td>
                                                    <input
                                                        type="number"
                                                        style={{ border: "none", backgroundColor: "transparent", outline: "none", width: "60%" }}
                                                        defaultValue={dat.id}
                                                        onKeyDown={(e) => clickEnter(e, index)}
                                                    />
                                                </td>
                                                <td>{dat.nomlanishi}</td>
                                                <td>{dat.viloyat}</td>
                                                <td >
                                                    <div className="icon d-flex justify-content-center align-items-center">
                                                        <a href="#1" className="infoBtn bg-dark" data-popup="tooltip" title="O'zgartirish"><i className="icon-pencil5" ></i> </a>
                                                        <a href="#1" className="infoBtn bg-dark" title="O'chirish" data-popup="tooltip" data-toggle="modal" data-target="#modal_theme_primary1"><i className="icon-trash"></i> </a>
                                                    </div>
                                                    {/* <i className="icon-pencil5 btn btn-dark mr-1 cursor-pointer" title="O'zgartirish"/> */}
                                                    {/* <i className="icon-trash btn btn-dark ml-1 cursor-pointer" title="O'chirish" /> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div id="modal_theme_primary1" class="modal fade show" tabIndex="-1" style={{ display: "none" }} aria-modal="true" role="dialog">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header bg-primary text-white">
                                                <h6 className="modal-title">Primary header</h6>
                                                <button type="button" className="close" data-dismiss="modal">×</button>
                                            </div>

                                            <div className="modal-body">
                                                <h4>Ma'lumotni o'chirishni xoxlaysizmi?</h4>
                                            </div>

                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-link" data-dismiss="modal">Bekor qilish</button>
                                                <button type="button" className="btn btn-primary">O'chirish</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* update */}
                                {/* {updateModal.open && (
                                    <div className="updateDataWindow">
                                        <div className="updateDataWindowWrapper">
                                            <form >
                                                <div className="updateDataWindowTop">
                                                    <h3>O'zgartirish oynasi</h3>
                                                    <span onClick={() => setUpdateModal({ open: false, obj: {} })}>&times;</span>
                                                </div>
                                                <div className="updateDataWindowCenter">
                                                    <input
                                                        type="text"
                                                        className="form-control inputNom"
                                                        defaultValue={updateModal.obj.nomlanishi}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control inputVil"
                                                        defaultValue={updateModal.obj.viloyat}
                                                    />
                                                </div>
                                                <hr />
                                                <div className="updateDataWindowBottom">
                                                    <button className="btn btn-danger" onClick={() => setUpdateModal({ open: false, obj: {} })}>Bekor qilish</button>
                                                    <button className="btn btn-primary" onClick={() => updatedData(updateModal.obj.id)}>O'zgartirish</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )} */}
                                {/* delete */}
                                {/* {deleteModal.delete && (
                                    <div className="deleteDataWindow">
                                        <div className="deleteDataWindowWrapper">
                                            <div className="form">
                                                <div className="deleteDataWindowTop">
                                                    <h3>O'chirish oynasi</h3>
                                                    <span onClick={() => setDeleteModal({ delete: false, obj: {} })}>&times;</span>
                                                </div>
                                                <div className="deleteDataWindowCenter">
                                                    <h2>Haqiqatdan ham o'chirib tashlamoqchimisiz?</h2>
                                                </div>
                                                <div className="updateDataWindowBottom">
                                                    <button className="btn btn-danger" onClick={() => setDeleteModal({ open: false, obj: {} })}>Bekor qilish</button>
                                                    <button className="btn btn-primary" onClick={() => deletedData(deleteModal.obj.id)}>O'chirish</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}