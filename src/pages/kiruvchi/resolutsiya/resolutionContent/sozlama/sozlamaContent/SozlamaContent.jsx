import React, { useContext, useEffect, useState } from "react";
import './sozlamaContent.css';
import { Link, NavLink, useParams, useHistory } from "react-router-dom";
import Select from 'react-select'
import ContentNavbar from "../../../../contentNavbar/ContentNavbar";
import { axiosInstance } from "../../../../../../config";
import { AuthContext } from "../../../../../../context/AuthContext";
// import { url } from '../../../../../../config';
import { Alert } from '../../../../../../component/alert/Alert';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SozlamaContent() {
    const [file, setFile] = useState(null);
    const { user: currentUser } = useContext(AuthContext);
    const params = useParams();
    const history = useHistory();
    const [notParentsCard, setNotParentsCard] = useState([]);
    const [cardsName, setCardsName] = useState([]);
    const [card, setCard] = useState([]);
    const [jurnallar, setJurnallar] = useState([]);
    const [taqdimForma, setTaqdimForma] = useState([]);
    const [tasdiqlovchi, setTasdiqlovchi] = useState([]);
    const [korrespondent, setKorrespondent] = useState([]);
    const [data, setData] = useState({});
    const [deleteModal, setDeleteModal] = useState({ open: false, obj: {} });
    const [alert, setAlert] = useState({ open: false, color: "", text: "" });
    const [startDate1, setStartDate1] = useState('');
    const [startDate2, setStartDate2] = useState('');



    // sanani formatlash
    const dateFormat =(date)=>{
        return  date?.slice(8,date.length)+'.'+date?.slice(5,7)+'.'+date?.slice(0,4)
    }

    // id ga mos documentni olish
    useEffect(() => {
        // tooltip ni o'chirish
        document.querySelector('.tooltip')?.remove();

        const getData = async () => {
            try {
                const res = await axiosInstance.get("document/" + params.id, {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                document.querySelector('.jurnali').querySelector('.css-qc6sy-singleValue').textContent = res.data?.journal?.uzName;
                document.querySelector('.num').value = res.data?.journal?.beginNumber;
                document.querySelector('.cardTypeId').querySelector('.css-qc6sy-singleValue').textContent = res.data?.card?.cardType?.parentCardType?.cardName;
                document.querySelector('.cardName').querySelector('.css-qc6sy-singleValue').textContent = res.data?.card?.cardName;
                document.querySelector('.taqdimForma').querySelector('.css-qc6sy-singleValue').textContent = res.data?.submissionForm?.name;
                document.querySelector('.tasdiqlovchi').querySelector('.css-qc6sy-singleValue').textContent = (res.data?.confirmer?.firstName ? res.data?.confirmer?.firstName.substring(0, 1) + "." : "") + res.data?.confirmer?.lastName;
                document.querySelector('.korrespondent').querySelector('.css-qc6sy-singleValue').textContent = res.data?.correspondent?.orgName;
                document.querySelector('.chiquvchiRaqam').value = res.data?.outNumber;
                document.querySelector('.ruyxatSana').value = res.data?.registrationAt;
                document.querySelector('.sahifalarSoni').value = res.data?.pageCount;
                document.querySelector('.qisqachaMalumot').value = res.data?.shortDescription;
                setStartDate1(new Date(res.data?.outDate))
                setStartDate2(new Date(res.data?.registrationAt))
                setData(res.data);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser, params.id]);

    // barcha cardlar ni o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("organization/showCardTypeByOrg", {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                let arr = [];
                res.data.forEach((c, i) => {
                    arr.push({ value: c.id, label: c.cardName });
                })
                setNotParentsCard(arr);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser]);

    // barcha card (jurnallarni) larni o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("journal/getOrgAll", {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                let arr = [];
                res.data.forEach((d, i) => {
                    arr.push({ value: d.id, label: d.uzName, clearableValue: true })
                });
                setJurnallar(res.data);
                setCard(arr);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser]);

    // card ni tanlamasdan cardname ni ro'yxatini chiqarish
    useEffect(() => {
        if (notParentsCard.length > 0) {
            let cardTypeName = document.querySelector('.cardTypeId')?.querySelector('.css-qc6sy-singleValue')?.textContent;
            let ctn = notParentsCard.filter((d, i) => {
                return d.label === cardTypeName;
            })

            const getData = async () => {
                try {
                    const res = await axiosInstance.get("card/cardType/" + ctn[0]?.value, {
                        headers: {
                            Authorization: "Bearer " + currentUser
                        }
                    })
                    let arr = [];
                    res.data.forEach((d, i) => {
                        arr.push({ value: d.id, label: d.cardName });
                    })
                    setCardsName(arr);
                } catch (error) {
                    console.log(error.response);
                }
            }
            getData();
        }
    }, [notParentsCard, data, currentUser]);

    const notParentsCardClick = async (e) => {
        document.querySelector('.cardName').querySelector('.css-qc6sy-singleValue').textContent = "";

        try {
            const res = await axiosInstance.get("card/cardType/" + e.value, {
                headers: {
                    Authorization: "Bearer " + currentUser
                }
            })
            let arr = [];
            res.data.forEach((d, i) => {
                arr.push({ value: d.id, label: d.cardName });
            })
            setCardsName(arr);
        } catch (error) {
            console.log(error.response);
        }
    }

    // jurnalni tanlagan payt id sini olish
    const clickCard = (e) => {
        console.log(e);
    }

    // barcha taqdim etish formasini o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("submissionForm/orgAll", {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                let arr = [];
                res.data.forEach((d, i) => {
                    arr.push({ value: d.id, label: d.name })
                });
                setTaqdimForma(arr);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser]);

    // barcha tasdiqlovchilarni o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("user/confirmers", {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                let arr = [];
                res.data.forEach((d, i) => {
                    let firstname = (d?.firstName && d?.firstName?.length > 1) ? ((((d?.firstName[0].toUpperCase() === "S" || d?.firstName[0].toUpperCase() === "C") && d?.firstName[1].toUpperCase() === "H")) ? d?.firstName?.substring(0, 2) + "." : d?.firstName?.substring(0, 1) + ".") : "";
                    arr.push({
                        value: d?.workPlaceId,
                        label: `${firstname}${d.lastName}`
                    })
                });
                setTasdiqlovchi(arr);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser]);

    // barcha korrespondentlarni o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("organization/orgCorrespondent", {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                let arr = [];
                res.data.forEach((d, i) => {
                    arr.push({ value: d.id, label: d.orgName })
                });
                setKorrespondent(arr);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser]);

    const newFormFunction = async (e) => {
        e.preventDefault();
        let jurnali = document.querySelector('.jurnali')?.querySelector('.css-qc6sy-singleValue')?.textContent;
        let num = document.querySelector('.num').value;
        let cardTypeId = document.querySelector('.cardTypeId')?.querySelector('.css-qc6sy-singleValue')?.textContent;
        let cardName = document.querySelector('.cardName')?.querySelector('.css-qc6sy-singleValue')?.textContent;
        let taqdimEtishForma = document.querySelector('.taqdimForma')?.querySelector('.css-qc6sy-singleValue')?.textContent;
        let tasdiqlovchi1 = document.querySelector('.tasdiqlovchi')?.querySelector('.css-qc6sy-singleValue')?.textContent;
        let korrespondent1 = document.querySelector('.korrespondent')?.querySelector('.css-qc6sy-singleValue')?.textContent;
        let chiquvchiRaqam = document.querySelector('.chiquvchiRaqam').value;
        let chiquvchiSana = document.querySelector('.chiquvchiSana').value;
        let ruyxatSana = document.querySelector('.ruyxatSana').value;
        let sahifalarSoni = document.querySelector('.sahifalarSoni').value;
        let qisqachaMalumot = document.querySelector('.qisqachaMalumot').value;

        chiquvchiSana=chiquvchiSana.slice(6,chiquvchiSana.length)+'-'+chiquvchiSana.slice(3,5)+'-'+chiquvchiSana.slice(0,2)
        ruyxatSana=ruyxatSana.slice(6,ruyxatSana.length)+'-'+ruyxatSana.slice(3,5)+'-'+ruyxatSana.slice(0,2)
        // jurnal tanlangan bulsa id sini olish
        let journalId = card?.filter((c, i) => {
            if (c.label === jurnali) {
                return c;
            }
        })

        // card nomi tanlangan bulsa id sini olish
        let cardId = cardsName?.filter((c, i) => {
            if (c.label === cardName) {
                return c;
            }
        })

        // taqdim etish formasi tanlangan bulsa id sini olish
        let submissionFormId = taqdimForma?.filter((c, i) => {
            if (c.label === taqdimEtishForma) {
                return c;
            }
        })

        // korrespondent tanlangan bulsa id sini olish
        let correspondentId = korrespondent?.filter((c, i) => {
            if (c.label === korrespondent1) {
                return c;
            }
        })

        // tasdiqlovchi tanlangan bulsa id sini olish
        let confirmerId = tasdiqlovchi?.filter((c, i) => {
            if (c.label === tasdiqlovchi1) {
                return c;
            }
        })

        // oldingi fayl id larini olish
        let beforeFileId = []
        data.files?.forEach((c, i) => {
            beforeFileId.push(c.id);
        })

        let fileId = [];
        if (file) {
            for (let i = 0; i < file?.length; i++) {
                const formData = new FormData();
                let fileType = (file[i]?.type === "application/zip" || file[i]?.type === "application/gzip" || file[i]?.type === "application/msword" || file[i]?.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || file[i]?.type === "application/vnd.ms-powerpoint" || file[i]?.type === "application/vnd.ms-excel.sheet.macroEnabled.12" || file[i]?.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file[i]?.type === "application/vnd.ms-excel" || file[i]?.type === "application/x-rar-compressed" || file[i]?.type === "application/pdf" || file[i]?.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file[i]?.type === "application/vnd.ms-excel");

                // agar fayl berilgan kengaytmada bo'lsa, so'rov yuborish
                if (fileType) {
                    formData.append("file", file[i]);
                    let res = await axiosInstance.post("document/saveDuplicateFile", formData, {
                        headers: {
                            Authorization: "Bearer " + currentUser,
                            "Content-Type": "multipart/form-data",
                        }
                    })
                    fileId.push(res.data);
                }
            }
        }

        if (data.files?.length > 0 || fileId?.length > 0) {
            if (jurnali) {
                if (num) {
                    if (cardTypeId) {
                        if (cardName) {
                            if (taqdimEtishForma) {
                                if (tasdiqlovchi1) {
                                    if (korrespondent1) {
                                        if (chiquvchiRaqam) {
                                            if (chiquvchiSana) {
                                                if (chiquvchiSana) {
                                                    if (ruyxatSana) {
                                                        if (sahifalarSoni) {
                                                            // to do server
                                                            try {
                                                                const res = await axiosInstance.patch("document/updateDocument", {
                                                                    id: params.id,
                                                                    cardId: cardId[0]?.value,
                                                                    submissionFormId: submissionFormId[0]?.value,
                                                                    journalId: journalId[0]?.value,
                                                                    correspondentId: correspondentId[0]?.value,
                                                                    confirmerId: confirmerId[0]?.value,
                                                                    outNumber: chiquvchiRaqam,
                                                                    outDate: chiquvchiSana,
                                                                    registrationAt: ruyxatSana,
                                                                    pageCount: parseInt(sahifalarSoni),
                                                                    shortDescription: qisqachaMalumot,
                                                                    fileId: beforeFileId.concat(fileId)
                                                                }, {
                                                                    headers: {
                                                                        Authorization: "Bearer " + currentUser
                                                                    }
                                                                })
                                                                console.log({
                                                                    id: params.id,
                                                                    cardId: cardId[0]?.value,
                                                                    submissionFormId: submissionFormId[0]?.value,
                                                                    journalId: journalId[0]?.value,
                                                                    correspondentId: correspondentId[0]?.value,
                                                                    confirmerId: confirmerId[0]?.value,
                                                                    outNumber: chiquvchiRaqam,
                                                                    outDate: chiquvchiSana,
                                                                    registrationAt: ruyxatSana,
                                                                    pageCount: parseInt(sahifalarSoni),
                                                                    shortDescription: qisqachaMalumot,
                                                                    fileId: beforeFileId.concat(fileId)
                                                                })
                                                                Alert(setAlert, "success", "Muvaffaqiyatli o'zgartirildi");
                                                                setTimeout(() => {
                                                                    params.name === "resolution" ? history.push("/kiruvchi/resolution") : history.push("/kiruvchi/yangi")
                                                                }, 1500);
                                                            } catch (error) {
                                                                console.log(error.response);
                                                                Alert(setAlert, "warning", error.response?.data);
                                                            }
                                                        } else {
                                                            Alert(setAlert, "warning", "ahifalar soni kiritilmagan")
                                                        }
                                                    } else {
                                                        Alert(setAlert, "warning", "Ro'yxatdan o'tish sanasi tanlanmagan")
                                                    }
                                                } else {
                                                    Alert(setAlert, "warning", "Chiquvchi sana tanlanmagan")
                                                }
                                            } else {
                                                Alert(setAlert, "warning", "Chiquvchi sana kiritilmagan")
                                            }
                                        } else {
                                            Alert(setAlert, "warning", "Chiquvchi raqam kiritilmagan")
                                        }
                                    } else {
                                        Alert(setAlert, "warning", "Korrespondent tanlanmagan")
                                    }
                                } else {
                                    Alert(setAlert, "warning", "Tasdiqlovchi tanlanmagan")
                                }
                            } else {
                                Alert(setAlert, "warning", "Taqdim etish formasi tanlanmagan")
                            }
                        } else {
                            Alert(setAlert, "warning", "Card nomi tanlanmagan")
                        }
                    } else {
                        Alert(setAlert, "warning", "Card tanlanmagan")
                    }
                } else {
                    Alert(setAlert, "warning", "Jurnal nomeri kiritilmagan")
                }
            } else {
                Alert(setAlert, "warning", "Jurnal tanlanmagan")
            }
        } else {
            Alert(setAlert, "warning", "Fayl tanlanmagan")
        }
    }

    // faylni o'chirish
    const Uchirish = async (dat) => {
        try {
            const res = await axiosInstance.delete(`document/deleteFile/${dat.id}/${params.id}`, {
                headers: {
                    Authorization: "Bearer " + currentUser
                }
            })
            let arr = data?.files?.filter((d, i) => {
                return d.id !== res.data;
            })
            Alert(setAlert, "success", "Muvaffaqiyatli o'chirildi");
            setDeleteModal({ open: false, obj: {} });
            setData({ data, files: arr });
        } catch (error) {
            console.log(error.response);
            setDeleteModal({ open: false, obj: {} });
            Alert(setAlert, "warning", "Fayl topilmadi");
        }
    }

    return (
        <div className="content mb-5 ">
            <h3 style={{ margin: "10px 0 0 20px", fontWeight: "bold", textTransform: "upperCase" }}>Sozlash</h3>
            <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-solid-custom bg-primary NavLink"
                    style={{ paddingTop: "2px" }}>
                    <ContentNavbar />

                    <li className="nav-item">
                        <NavLink to={`/kiruvchi/sozlash/${params.id}/${params.name}`} className="nav-link"
                            activeClassName='NavLinkLi'>
                            <i className="fab fa-whmcs mr-1"></i>Sozlash
                        </NavLink>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane fade show active" id="colored-tab1">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={newFormFunction}>
                                    <div className="row ">
                                        <div className="col-lg-4">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <Select
                                                        defaultValue={{ value: "", label: "" }}
                                                        options={card}
                                                        onChange={clickCard}
                                                        placeholder="Jurnali"
                                                        className='jurnali'
                                                        isClearable={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-outline num"
                                                            id="number" placeholder="Placeholder"
                                                            disabled
                                                            required
                                                        />
                                                        <label className="label-floating">№</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group form-group-floating row">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <Select
                                                            defaultValue={{ value: "", label: "" }}
                                                            options={notParentsCard}
                                                            onChange={notParentsCardClick}
                                                            placeholder="Card turi"
                                                            className="cardTypeId"
                                                            isClearable={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group form-group-floating row">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <Select
                                                            defaultValue={{ value: "", label: "" }}
                                                            options={cardsName}
                                                            // onChange={clickCardname}
                                                            placeholder="Card nomi"
                                                            className="cardName"
                                                            isClearable={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-4">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <Select
                                                        defaultValue={{ value: "", label: "" }}
                                                        options={taqdimForma}
                                                        // onChange={logChange}
                                                        placeholder="Taqdim etish formasi"
                                                        className='taqdimForma'
                                                        isClearable={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <Select
                                                        defaultValue={{ value: "", label: "" }}
                                                        options={tasdiqlovchi}
                                                        // onChange={logChange}
                                                        placeholder="Tasdiqlovchi"
                                                        className='tasdiqlovchi'
                                                        isClearable={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <Select
                                                        defaultValue={{ value: "", label: "" }}
                                                        options={korrespondent}
                                                        // onChange={logChange}
                                                        placeholder="Korrespondent"
                                                        className='korrespondent'
                                                        isClearable={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-lg-3">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-outline chiquvchiRaqam"
                                                            id="chiquvchiRaqam"
                                                            placeholder="Placeholder"
                                                        // defaultValue={kiruvchiRezMalumot?.chiquvchiDateRaqam}
                                                        />
                                                        <label className="label-floating">Chiquvchi raqami</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <div className='changeBox' style={{
                                                            width: '100%',
                                                            border: "1px solid lightgray",
                                                            position: "inherit",
                                                            zIndex: "9"
                                                        }}>
                                                            <DatePicker
                                                                className={'chiquvchiSana'}
                                                                id={'chiquvchiSana'}
                                                                selected={startDate1}
                                                                onChange={(date) => setStartDate1(date)}
                                                                dateFormat={'dd.MM.yyyy'}
                                                                isClearable
                                                                showYearDropdown
                                                                scrollableMonthYearDropdown
                                                                placeholderText="Chiquvchi № /sana"
                                                                // showTimeSelect
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <div className='changeBox' style={{
                                                            width: '100%',
                                                            border: "1px solid lightgray",
                                                            position: "inherit",
                                                            zIndex: "9"
                                                        }}>
                                                            <DatePicker
                                                                // width="100"
                                                                className={'ruyxatSana'}
                                                                id={'royxatdanOtishSana'}
                                                                selected={startDate2}
                                                                onChange={(date) => setStartDate2(date)}
                                                                dateFormat={'dd.MM.yyyy'}
                                                                isClearable
                                                                showYearDropdown
                                                                scrollableMonthYearDropdown
                                                                placeholderText="Ro'yxatdan o'tish sanasi"
                                                                // showTimeSelect
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group form-group-floating row mb-0">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-outline sahifalarSoni"
                                                            id="sahifalarSoni"
                                                            placeholder="Placeholder"
                                                        />
                                                        <label className="label-floating">Sahifalar soni</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-lg-12">
                                            <div className="form-group form-group-floating row">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <textarea cols="30"
                                                            rows="5"
                                                            id="malumot"
                                                            maxLength="301"
                                                            className="form-control form-control-outline qisqachaMalumot"
                                                            placeholder="Placeholder"
                                                        // defaultValue={kiruvchiRezMalumot?.malumot}
                                                        />
                                                        <label className="label-floating">Qisqacha ma'lumot</label>
                                                        <span className="mt-5 text-muted">Qisqacha ma'lumot 300 ta so'zdan oshmaydi</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group form-group-float">
                                                <span className="text-muted"
                                                    style={{ fontSize: "12px" }}>{data?.files?.length > 0 ? `${data?.files?.length} ta fayl oldin tanlangan` : ""}</span>
                                                <div className="custom-file">
                                                    <input
                                                        type="file"
                                                        className="custom-file-input"
                                                        id="custom-file-visible"
                                                        accept='.doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar'
                                                        onClick={(e) => e.target.value = null}
                                                        onChange={(e) => setFile(e.target.files)}
                                                        multiple="multiple"
                                                        style={{ zIndex: "-1" }}
                                                    />
                                                    <label className="custom-file-label text-muted"
                                                        htmlFor="custom-file-visible">
                                                        {file?.length > 0 ? `${file?.length} ta fayl tanlandi` : "Faylni tanlash"}
                                                    </label>
                                                </div>
                                                <label className="d-block text-muted mb-0">Ruxsat etilgan formatlar:
                                                    doc, docx, xls,xlsx, ppt, pptx, pdf, .zip, .rar</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* fayllarni ko'rsatish */}
                                    {data?.files?.length > 0 && (
                                        <>
                                            {data?.files?.map((hujjat, index) => (
                                                <>
                                                    {hujjat?.originalName?.split('.')[hujjat?.originalName?.split('.').length - 1] === "pdf" ? (
                                                        <div key={index}
                                                            className="d-flex align-items-center justify-content-between mb-3 shadowBox py-2">
                                                            {/* file rasmi */}
                                                            <div className="d-flex align-items-center">
                                                                <i className="far fa-file-pdf mr-3 fa-2x pdfIcon"
                                                                    style={{ fontSize: "50px", paddingLeft: "16px" }} />
                                                                <span style={{ fontSize: "18px" }}>PDF FILE</span>
                                                            </div>
                                                            {/* fileni o'chirish ikonkasi */}
                                                            <i className="fas fa-trash-alt mr-3 fa-2x trashTag"
                                                                onClick={() => setDeleteModal({
                                                                    open: true,
                                                                    obj: hujjat
                                                                })} />
                                                        </div>
                                                    ) : (
                                                        hujjat?.originalName?.split('.')[hujjat?.originalName?.split('.').length - 1] === "doc" || hujjat?.originalName?.split('.')[hujjat?.originalName?.split('.').length - 1] === "docx") ? (
                                                        <div key={index}
                                                            className="d-flex align-items-center justify-content-between mb-3 shadowBox">
                                                            {/* file rasmi */}
                                                            <div className="d-flex align-items-center">
                                                                <i className="far fa-file-word mr-3 fa-2x wordIcon"
                                                                    style={{ fontSize: "50px", paddingLeft: "16px" }} />
                                                                <span style={{ fontSize: "18px" }}>WORD FILE</span>
                                                            </div>
                                                            {/* fileni o'chirish ikonkasi */}
                                                            <i className="fas fa-trash-alt mr-3 fa-2x trashTag"
                                                                onClick={() => setDeleteModal({
                                                                    open: true,
                                                                    obj: hujjat
                                                                })} />
                                                        </div>
                                                    ) : (hujjat?.originalName?.split('.')[hujjat?.originalName?.split('.').length - 1] === "xls" || hujjat?.originalName?.split('.')[hujjat?.originalName?.split('.').length - 1] === "xlsx") ? (
                                                        <div key={index}
                                                            className="d-flex align-items-center justify-content-between mb-3 shadowBox">
                                                            {/* file rasmi */}
                                                            <div className="d-flex align-items-center">
                                                                <i className="far fa-file-excel mr-3 fa-2x excelIcon"
                                                                    style={{ fontSize: "50px", paddingLeft: "16px" }} />
                                                                <span style={{ fontSize: "18px" }}>EXCEL FILE</span>
                                                            </div>
                                                            {/* fileni o'chirish ikonkasi */}
                                                            <i className="fas fa-trash-alt mr-3 fa-2x trashTag"
                                                                onClick={() => setDeleteModal({
                                                                    open: true,
                                                                    obj: hujjat
                                                                })} />
                                                        </div>
                                                    ) : (hujjat?.extention.split('/')[hujjat?.extention?.split('/').length - 1] === "ppt" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "pptx" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "vnd.openxmlformats-officedocument.presentationml.presentation") ? (
                                                        <div key={index}
                                                            className="d-flex align-items-center justify-content-between mb-3 shadowBox">
                                                            {/* file rasmi */}
                                                            <div className="d-flex align-items-center">
                                                                <i className="far fa-file-powerpoint mr-3 fa-2x pptIcon"
                                                                    style={{ fontSize: "50px", paddingLeft: "16px" }} />
                                                                <span style={{ fontSize: "18px" }}>POWERPOINT FILE</span>
                                                            </div>
                                                            {/* fileni o'chirish ikonkasi */}
                                                            <i className="fas fa-trash-alt mr-3 fa-2x trashTag"
                                                                onClick={() => setDeleteModal({
                                                                    open: true,
                                                                    obj: hujjat
                                                                })} />
                                                        </div>
                                                    ) : (
                                                        <div key={index}
                                                            className="d-flex align-items-center justify-content-between mb-3 shadowBox">
                                                            {/* file rasmi */}
                                                            <div className="d-flex align-items-center">
                                                                <i className="far fa-file-archive mr-3 fa-2x rarIcon"
                                                                    style={{ fontSize: "50px", paddingLeft: "16px" }} />
                                                                <span style={{ fontSize: "18px" }}>ZIP,RAR FILE</span>
                                                            </div>
                                                            {/* fileni o'chirish ikonkasi */}
                                                            <i className="fas fa-trash-alt mr-3 fa-2x trashTag"
                                                                onClick={() => setDeleteModal({
                                                                    open: true,
                                                                    obj: hujjat
                                                                })} />
                                                        </div>
                                                    )}
                                                </>
                                            ))}
                                        </>
                                    )}
                                    <div className="row mt-4 d-flex align-items-center justify-content-between">
                                        <div className="ml-2">
                                            <button type="submit" className="btn btn-primary mr-2"><i
                                                className="fa fa-edit mr-2"></i>O'zgartirish
                                            </button>
                                            <Link
                                                to={`${params.name === "resolution" ? "/kiruvchi/resolution" : "kiruvchi/yangi"}`}>
                                                <button type="button" className="btn btn-primary"><i
                                                    className="fa fa-arrow-left mr-2"></i>Orqaga qaytish
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                                {/* modal delete */}
                                {deleteModal.open && (
                                    <div className="adminWindow">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header bg-primary text-white">
                                                    <h6 className="modal-title">O'chirish oynasi</h6>
                                                    <button type="button" className="close close1"
                                                        onClick={() => setDeleteModal({ open: false, obj: {} })}>×
                                                    </button>
                                                </div>
                                                <div className="modal-body text-center">
                                                    <h3 style={{ textTransform: "upperCase", fontWeight: "bold" }}
                                                        className="text-danger">Ogoh bo'ling!</h3>
                                                    <h5>Ushbu ma'lumotni o'chirmoqchimisiz?</h5>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-link bekorQilish"
                                                        onClick={() => setDeleteModal({ open: false, obj: {} })}>Bekor
                                                        qilish
                                                    </button>
                                                    <button type="button" className="btn btn-primary"
                                                        onClick={() => Uchirish(deleteModal.obj)}>O'chirish
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* alert */}
                        {alert.open && (
                            <div className={`alert alert-${alert.color} alertNotice alert-styled-left alert-dismissible`}>
                                <span className="font-weight-semibold">{alert.text}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}