import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import './korishContent.css';
import ContentNavbar from "../../../../contentNavbar/ContentNavbar";
import { NavLink } from 'react-router-dom';
import Select from 'react-select'
import { axiosInstance, url } from "../../../../../../config";
import { AuthContext } from "../../../../../../context/AuthContext";
import { Alert } from '../../../../../../component/alert/Alert';
import jwtDecode from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Nazorat from "../../../../nazorat/Nazorat";

export default function KorishContent({ stompClient }) {
    const { user: currentUser } = useContext(AuthContext);
    const params = useParams();
    const history = useHistory();
    const [yangiQushish, setYangiQushish] = useState([]);
    const [startDate1, setStartDate1] = useState('');
    const [data, setData] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [selectVisible, setSelectVisible] = useState(false);
    const [xodimlar, setXodimlar] = useState([]);
    const [qaytaIjro, setQaytaIjro] = useState([]);
    const [selectXodim, setSelectXodim] = useState({});
    const [selectQaytaIjro, setSelectQaytaIjro] = useState({});
    const [tezkorRezolutsiya, setTezkorRezolutsiya] = useState([]);
    const [alert, setAlert] = useState({ open: false, color: "", text: "" });
    const [imzo, setImzo] = useState([]);
    const [yunalishlar, setYunalishlar] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [rowLeinExecutorInformationListLength, setRowLeinExecutorInformationListLength] = useState(0);
    const [textareaChange, setTextareaChange] = useState("");
    const [outExecutorInformationList, setOutExecutorInformationList] = useState([]);
    const [results, setResults] = useState([]);
    const [change, setChange] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [nazorat, setNazorat] = useState(false)

    // sanani formatlash
    const dateFormat = (date) => {
        return date?.slice(8, date.length) + '.' + date?.slice(5, 7) + '.' + date?.slice(0, 4)
    }


    useEffect(() => {
        let arr = [];
        data[0]?.outExecutorInformationList?.forEach((f) => {
            arr.push(f.orgId);
        })
        setOutExecutorInformationList(arr);
    }, [data]);

    // barcha yo'nalishlarni o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("organization/getPassive", {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                });
                setYunalishlar(res.data);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser]);

    // tooltipni o'chirish
    useEffect(() => {
        document.querySelector('.tooltip')?.remove();

        let workPlaces = JSON.parse(jwtDecode(currentUser).workPlaces)
        let arr1 = [];
        // let arr = [], arr2 = [];
        workPlaces.forEach((d, i) => {
            // if (JSON.parse(localStorage.getItem('ids')) === d.id) {
            //     d.permissions.forEach((h) => {
            //         arr2.push(h?.name);
            //     })
            // }
            d.userRoles.forEach((f, i) => {
                // arr.push(f?.systemName);
                arr1.push(f?.rank);
            })
        })
        // setWorkPlace(arr);
        setRanks(arr1);
        // setPermission(arr2);
    }, [currentUser]);

    // id ga mos malumotni olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get("document/showInResolutionDoc/" + params.id, {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                setData([res.data]);
                setNazorat(res?.data?.document?.inControl)
                setStartDate1(new Date(res.data.document?.deadline))
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [currentUser, params.id]);

    // xodimlarni o'qib olish
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axiosInstance.get(`executor/inExecutors/${params.id}/${JSON.parse(localStorage.getItem('ids'))}/${params.name ? true : false}`, {
                    headers: {
                        Authorization: "Bearer " + currentUser
                    }
                })
                let arr = [];
                res.data.forEach((dat, i) => {
                    arr.push({ value: dat?.departmentShortName, label: dat?.departmentShortName, isDisabled: "true" });
                    if (dat.users?.length > 0) {
                        dat.users.forEach((d, i) => {
                            let firstname = (d?.firstName && d?.firstName?.length > 1) ? ((((d?.firstName[0].toUpperCase() === "S" || d?.firstName[0].toUpperCase() === "C") && d?.firstName[1].toUpperCase() === "H")) ? d?.firstName?.substring(0, 2) + ". " : d?.firstName?.substring(0, 1) + ". ") : "";
                            arr.push({
                                value: d?.id,
                                label: `${firstname}${d?.lastName}`,
                                isClearable: true,
                                pl: d?.workPlaceId,
                                name: dat?.deparmentName
                            });
                        })
                    }
                })
                setXodimlar(arr);
            } catch (error) {
                console.log(error.response);
            }
        }
        getData();
    }, [params.id, currentUser]);

    const selectXodimFunc = (e) => {
        setSelectXodim(e);
    }


    useEffect(() => {
        setRowLeinExecutorInformationListLength(data[0]?.inExecutorInformationList?.length);
    }, [data]);

    // qayta ijroni olish
    useEffect(() => {
        axiosInstance.get("repeatExecutePeriod", {
            headers: {
                Authorization: "Bearer " + currentUser
            }
        })
            .then(res => {
                let arr = [];
                res.data.forEach((d, i) => {
                    arr.push({ value: d.period, label: d.description, isClearable: true })
                })
                // arr.push({ value: "Boshqa", label: "Boshqa" });
                setQaytaIjro(arr);
            })
            .catch(err => {
                console.log(err.response);
            })
    }, [currentUser]);

    // tezkor rezolutsiyani o'qib olish
    useEffect(() => {
        axiosInstance.get("fastResolution/orgAll", {
            headers: {
                Authorization: "Bearer " + currentUser
            }
        })
            .then(res => {
                setTezkorRezolutsiya(res.data);
            })
            .catch(err => {
                console.log(err.response);
            })
    }, [currentUser]);

    const deleteFun1 = (e) => {
        e.target.remove();
        setRowLeinExecutorInformationListLength(prev => prev - 1);
    }

    const deleteFun = (e) => {
        e.target.remove();
    }

    const newCreateBajaruvchi = () => {
        setYangiQushish(prev => [...prev, '1']);
    }

    const checkedDivNazorat = (e, index) => {
        let div = document.querySelectorAll('.col1');
        if (!e.hasAttribute('style')) {
            let iconCheck = div[index]?.querySelectorAll('.iconCheck');
            iconCheck?.forEach((check) => {
                check.removeAttribute('style');
            })
            div.forEach((d) => {
                d.getElementsByClassName('iconCheck')[0].removeAttribute('style');
            })
            e.style.display = 'flex';
            e.style.backgroundColor = '#0056B8';
            e.style.color = '#fff';
        } else {
            e.removeAttribute('style');
        }
    }

    const checkedDivUmum = (e, index) => {
        let div = document.querySelectorAll('.col1')
        if (!e.hasAttribute('style')) {
            let iconCheck = div[index]?.querySelectorAll('.iconCheck');
            iconCheck?.forEach((check) => {
                check.removeAttribute('style');
            })
            div.forEach((d) => {
                d.getElementsByClassName('iconCheck')[1].removeAttribute('style');
            })
            e.style.display = 'flex';
            e.style.backgroundColor = '#0056B8';
            e.style.color = '#fff';
        } else {
            e.removeAttribute('style');
        }
    }

    const checkedDivM = (e, index) => {
        let div = document.querySelectorAll('.col1')
        if (!e.hasAttribute('style')) {
            // div.forEach((d)=>{
            //     d.getElementsByClassName('iconCheck')[2].removeAttribute('style');
            // })
            let iconCheck = div[index]?.querySelectorAll('.iconCheck');
            iconCheck?.forEach((check) => {
                check.removeAttribute('style');
            })
            e.style.display = 'flex';
            e.style.backgroundColor = '#0056B8';
            e.style.color = '#fff';
        } else {
            e.removeAttribute('style');
        }
    }

    // eimzo
    useEffect(() => {
        let li = document.querySelector('.selectElement')?.querySelector('.key')?.querySelectorAll('li');
        if (li) {
            li.forEach((l, index) => {
                l.addEventListener('click', () => {
                    // console.log(l);
                    let spans = l.querySelectorAll('span');
                    // console.log(spans);
                    let result = [];
                    spans.forEach((k) => {
                        let arr;
                        // console.log(k.textContent.split(':')[k.textContent.split(':').length - 1].trim());
                        arr = {
                            name: k.textContent.split(':')[k.textContent.split(':').length - 1].trim(),
                        }
                        result.push(arr);
                    })
                    setImzo(result);
                    document.querySelector('.selectValue').textContent = l.textContent;
                    document.querySelector('.selectValue').setAttribute("value", `${l.getAttribute("value")}`);
                    document.querySelector('.selectValue').setAttribute("id", `${l.getAttribute("id")}`);
                    document.querySelector('.selectValue').setAttribute("vo", `${l.getAttribute("vo")}`);
                    for (let i = 0; i < li.length; i++) {
                        if (i !== index) {
                            li[i].style.backgroundColor = "";
                        } else {
                            li[i].style.backgroundColor = "rgba(211, 211, 211, 0.379)";
                        }
                    }
                })
            })
        }
    }, [selectVisible]);
    // const cancelEimzo = () => {
    //     let li = document.querySelector('.selectElement').querySelector('.key')?.querySelectorAll('li');
    //     document.querySelector('.selectValue').textContent = "";
    //     document.querySelector('.selectValue').removeAttribute("value");
    //     document.querySelector('.selectValue').removeAttribute("id");
    //     document.querySelector('.selectValue').removeAttribute("vo");
    //     document.querySelector('#keyId').textContent = "";
    //     document.querySelector('.pkcs7').value = "";
    //     for (let i = 0; i < li.length; i++) {
    //         li[i].style.backgroundColor = "";
    //     }
    // }

    const selectQaytaIjroFunc = (e, index) => {
        if (e.label === "Boshqa") {
            document.querySelector('.visibleBoshqa').style.display = "block";
        } else {
            document.querySelector('.visibleBoshqa').style.display = "none";
        }
        setSelectQaytaIjro(e);
    }

    let s = data[0]?.document?.resolutionContent;
    useEffect(() => {
        let rows1 = document.querySelectorAll('.tezkorRezolutsiyaRow');
        if (rows1.length > 0) {
            rows1.forEach((row, index) => {
                row.querySelector('.selectCheckbox').addEventListener('click', () => {
                    if (row.querySelector('.selectCheckbox').checked) {
                        if ((document.querySelector('.rezTezkor').value + row.querySelector('.rezName').textContent).length < 300) {
                            document.querySelector('.rezTezkor').value += row.querySelector('.rezName').textContent + ", "
                        } else {
                            Alert(setAlert, "warning", "Ma`lumot 300 tadan oshib ketdi!")
                        }
                    } else {
                        rows1.forEach((row, index) => {
                            if (!row.querySelector('.selectCheckbox').checked) {
                                document.querySelector('.rezTezkor').value = document.querySelector('.rezTezkor').value.split(row.querySelector(".rezName").textContent + ", ").join("")
                                console.log(document.querySelector('.rezTezkor').value);
                            }
                        })
                    }
                })
            })
        }
    }, [tezkorRezolutsiya]);

    // hamma malumotlarni saqlash
    const saveAllData = () => {
        let hujjatTuri = document.querySelector('.hujjatTuri')?.value;
        let sanaAsosiy = document.querySelector('.sanaAsosiy')?.value;
        let XodimBajaruvchi = document.querySelectorAll('.XodimBajaruvchi');
        let bajaruvchiSana = document.querySelectorAll('.bajaruvchiSana');

        let xodimBool = true;
        let checkedXodim = [];
        XodimBajaruvchi.forEach((xodim, index) => {
            if (!xodim.querySelector('.css-qc6sy-singleValue')?.textContent) {
                xodimBool = false;
            }
        })

        let sanaBool = true;
        bajaruvchiSana.forEach((date, index) => {
            if (!date.value) {
                sanaBool = false;
            }
        })

        if (hujjatTuri) {
            if (sanaAsosiy) {
                if (xodimBool) {
                    // tashqi bajaruvchi va forma ni massiv ichga olish
                    let inExecutorResolution = [];
                    let forms = document.querySelectorAll('.bajaruvchiForm');
                    forms.forEach((form, index) => {
                        let letter = "";
                        let checkBoxCol1 = form.querySelector('.col1').querySelectorAll('.chb');
                        checkBoxCol1.forEach((check, i) => {
                            if (check.querySelector('.iconCheck').hasAttribute('style')) {
                                letter = check.querySelector('.iconCheck').textContent;
                            }
                        })
                        let Xodim = form.querySelector('.XodimBajaruvchi')?.querySelector('.css-qc6sy-singleValue')?.textContent;
                        let izohCol1 = form.querySelector('.izohCol1').value;
                        let deadLine = form.querySelector('.bajaruvchiSana').value;
                        let qaytaIjro1 = form.querySelector('.col1QaytaIjro')?.querySelector('.css-qc6sy-singleValue')?.textContent;


                        let period = [];
                        // qayta ijro bosilganda uning periodini berish
                        if (qaytaIjro1 === "Boshqa") {
                            period.push({ value: parseInt(form.querySelector('.boshqa').value), label: "Boshqa" })
                        } else if (typeof parseInt(qaytaIjro1) > 0) {
                            period.push({ value: parseInt(qaytaIjro1), label: parseInt(qaytaIjro1) })
                        } else {
                            qaytaIjro?.forEach((d, i) => {
                                if (d.label === qaytaIjro1) {
                                    period.push(d);
                                }
                            })
                        }

                        let workPlace = [];
                        // xodimni tanlagan payt workplaceId sini olish
                        for (let i = 0; i < xodimlar.length; i++) {
                            if (xodimlar[i].label === Xodim) {
                                if (!checkedXodim.includes(xodimlar[i].pl)) {
                                    workPlace.push(xodimlar[i]);
                                    checkedXodim.push(xodimlar[i].pl);
                                    break;
                                }
                            }
                        }

                        let obj = {
                            workPlaceId: workPlace[0]?.pl,
                            repeatExecutePeriod: period[0]?.value,
                            deadline: deadLine,
                            description: izohCol1,
                            executorStatusName: letter === "N" ? "Nazorat uchun" : letter === "U" ? "Umumlashtiruvchi" : letter === "M" ? "Ma'lumot uchun" : "Bajarish uchun"
                        }
                        inExecutorResolution.push(obj);
                    })

                    axiosInstance.post(`document/resolution`, {
                        id: params.id,
                        inControl: nazorat,
                        workPlaceId: JSON.parse(localStorage.getItem('ids')),
                        resolutionContent: document.querySelector('.rezTezkor')?.value,
                        inExecutorResolution: inExecutorResolution,
                        outExecutorResolution: results, //outExecutorResolution,
                        deadline: sanaAsosiy.split('.')[2] + "-" + sanaAsosiy.split('.')[1] + "-" + sanaAsosiy.split('.')[0],
                        esignature: {
                            fullName: imzo[2]?.name,
                            orgName: imzo[3]?.name,
                            lavozim: imzo[4]?.name,
                            inn: imzo[1]?.name,
                            validFrom: imzo[5]?.name?.split('-')[0]?.trim(),
                            validTo: imzo[5]?.name?.split('-')[1]?.trim(),
                            serialNumber: imzo[0]?.name
                        }
                    }, {
                        headers: {
                            Authorization: "Bearer " + currentUser
                        }
                    })
                        .then(res => {
                            //barcha yangi qo'shilganlarni o'chirib tashlash
                            let trashes = document.querySelectorAll('.col6');
                            trashes.forEach((tr, i) => {
                                tr.querySelector('button').click();
                            })

                            // barcha tashqi bajaruvchidagi checkbox larni unchecked qilish
                            let row1CheckboxCopies = document.querySelectorAll('.row1Checkbox');
                            row1CheckboxCopies.forEach((checkbox, i) => {
                                if (checkbox.checked) {
                                    checkbox.setAttribute("defaultChecked", "false");
                                }
                            })
                            Alert(setAlert, 'success', "Ma'lumot muvaffaqiyatli saqlandi");
                            stompClient.send('/app/private-message', {}, JSON.stringify(inExecutorResolution))
                            setTimeout(() => {
                                history.push("/kiruvchi/resolution");
                            }, 1500);
                        })
                        .catch(err => {
                            console.log(err.response);
                            Alert(setAlert, 'warning', err?.response?.data);
                        })
                } else {
                    Alert(setAlert, 'warning', "Bajaruvchi bo'limdagi xodim tanlanmagan");
                }
            } else {
                Alert(setAlert, 'warning', "Asosiy bo'limdagi sana tanlanmagan");
            }
        } else {
            Alert(setAlert, 'warning', "Hujjat turi kiritilmagan");
        }
    }


    // umumiy tashqi bajaruvchilar
    // search tashqi bajaruvchilar
    const changeInputChange1 = (value, index) => {
        let tashqiBajUlInline = document.getElementsByClassName('tashqiBajUlInline')[index];
        let inlineContent = tashqiBajUlInline.querySelectorAll('.inlineContent');
        inlineContent.forEach((d) => {
            let v = d.querySelector('div').textContent.toUpperCase();
            if (v.indexOf(value.toUpperCase(), 0) > -1) {
                d.style.display = "flex";
            } else {
                d.style.display = "none";
            }
        })
    }

    // search tashqi bajaruvchilar ichki qismi
    const changeInputChange2 = (value, index) => {
        let tashqiBajUlInline = document.getElementsByClassName('tashqiBajUlInline')[index];
        let inlineContent2 = tashqiBajUlInline?.querySelectorAll('.inlineContent2');
        inlineContent2.forEach((d) => {
            let inlineContent3 = d.querySelectorAll('.inlineContent3');
            inlineContent3.forEach((s) => {
                let v = s.querySelector('div').textContent.toUpperCase();
                if (v.indexOf(value.toUpperCase(), 0) > -1) {
                    s.style.display = "flex";
                } else {
                    s.style.display = "none";
                }
            })
        })
    }

    // tashqi bajaruvchilar uchun
    useEffect(() => {
        let tashqiBaj = document.querySelector('.tashqiBaj');
        let tashqiBajUlInline = document.querySelectorAll('.tashqiBajUlInline');
        let li1 = tashqiBaj?.querySelectorAll('.tashqiBajLi1');
        let inlineContent = tashqiBaj?.querySelectorAll('.inlineContent');

        // bosganda plus minusni taxlash
        li1.forEach((li, i) => {
            li?.addEventListener('click', () => {
                if (tashqiBajUlInline[i].style.display === "block") {
                    tashqiBajUlInline[i].style.display = "none";
                    li.querySelector('.iconMinus').style.display = "none";
                    li.querySelector('.iconPlus').style.display = "block";

                } else {
                    tashqiBajUlInline[i].style.display = "block";
                    li.querySelector('.iconMinus').style.display = "block";
                    li.querySelector('.iconPlus').style.display = "none";

                }
            })
        })

        // barchasini tanlash uchun
        tashqiBajUlInline.forEach((t) => {
            t.querySelector('.allChecked').addEventListener('click', () => {
                if (t.querySelector('.allChecked').textContent === "Barchasini tanlash") {
                    t.querySelectorAll('.inlineContent').forEach((k) => {
                        k.querySelector('input').checked = true;
                    });
                    t.querySelector('.allChecked').textContent = "Barchasini o'chirish";
                    t.querySelector('.allChecked').style.backgroundColor = "crimson";
                } else {
                    t.querySelectorAll('.inlineContent').forEach((k) => {
                        k.querySelector('input').checked = false;
                    });
                    t.querySelector('.allChecked').textContent = "Barchasini tanlash";
                    t.querySelector('.allChecked').style.backgroundColor = "#0056B8";
                }
            })
        })

        // ichki qismi uchun
        inlineContent.forEach((y, ind) => {
            y.querySelector('div').addEventListener('click', () => {
                if (document.getElementsByClassName('inlineContent2')[ind].style.display === "block") {
                    document.getElementsByClassName('inlineContent2')[ind].style.display = "none";
                } else {
                    document.getElementsByClassName('inlineContent2')[ind].style.display = "block";
                }
            })
        })
        tashqiBajUlInline.forEach((t) => {
            t.querySelector('.allChecked1')?.addEventListener('click', () => {
                if (t.querySelector('.allChecked1').textContent === "Barchasini tanlash") {
                    t.querySelectorAll('.inlineContent3').forEach((k) => {
                        k.querySelector('input').checked = true;
                    });
                    t.querySelector('.allChecked1').textContent = "Barchasini o'chirish";
                    t.querySelector('.allChecked1').style.backgroundColor = "crimson";
                } else {
                    t.querySelectorAll('.inlineContent3').forEach((k) => {
                        k.querySelector('input').checked = false;
                    });
                    t.querySelector('.allChecked1').textContent = "Barchasini tanlash";
                    t.querySelector('.allChecked1').style.backgroundColor = "#0056B8";
                }
            })
        })

        // bittasi unchecked bo'lsa button ni o'zgartirish
        tashqiBajUlInline.forEach((d) => {
            let idsDiv1 = d.querySelectorAll('.idsDiv1');
            let inlineContent2 = document.querySelectorAll('.inlineContent2');
            // tashqi qismi uchun
            idsDiv1.forEach((r) => {
                r.addEventListener('click', () => {
                    let bool = true;
                    if (r.checked) {
                        idsDiv1.forEach((t) => {
                            if (!t.checked) {
                                bool = false;
                            }
                        })
                        if (bool) {
                            d.querySelector('.allChecked').textContent = "Barchasini o'chirish";
                            d.querySelector('.allChecked').style.backgroundColor = "crimson";
                        } else {
                            d.querySelector('.allChecked').textContent = "Barchasini tanlash";
                            d.querySelector('.allChecked').style.backgroundColor = "#0056B8";
                        }
                    } else {
                        idsDiv1.forEach((t) => {
                            if (!t.checked) {
                                bool = false;
                            }
                        })
                        if (bool) {
                            d.querySelector('.allChecked').textContent = "Barchasini o'chirish";
                            d.querySelector('.allChecked').style.backgroundColor = "crimson";
                        } else {
                            d.querySelector('.allChecked').textContent = "Barchasini tanlash";
                            d.querySelector('.allChecked').style.backgroundColor = "#0056B8";
                        }
                    }
                })
            })
            // ichki qismi
            inlineContent2.forEach((w, index) => {
                let idsDiv2 = w.querySelectorAll('.idsDiv2');
                idsDiv2.forEach((r) => {
                    r.addEventListener('click', () => {
                        let bool = true;
                        if (r.checked) {
                            idsDiv2.forEach((t) => {
                                if (!t.checked) {
                                    bool = false;
                                }
                            })
                            if (bool) {
                                w.querySelector('.allChecked1').textContent = "Barchasini o'chirish";
                                w.querySelector('.allChecked1').style.backgroundColor = "crimson";
                            } else {
                                w.querySelector('.allChecked1').textContent = "Barchasini tanlash";
                                w.querySelector('.allChecked1').style.backgroundColor = "#0056B8";
                            }
                        } else {
                            idsDiv2.forEach((t) => {
                                if (!t.checked) {
                                    bool = false;
                                }
                            })
                            if (bool) {
                                w.querySelector('.allChecked1').textContent = "Barchasini o'chirish";
                                w.querySelector('.allChecked1').style.backgroundColor = "crimson";
                            } else {
                                w.querySelector('.allChecked1').textContent = "Barchasini tanlash";
                                w.querySelector('.allChecked1').style.backgroundColor = "#0056B8";
                            }
                        }
                    })
                })
            })
        })
    }, [openModal]);

    // tashqi bajaruvchilar oldin tanlangan bo'lsa, checked qilish
    useEffect(() => {
        let tashqiBajUlInline = document.querySelectorAll('.tashqiBajUlInline');
        tashqiBajUlInline.forEach((d) => {
            let idsDiv = d.querySelectorAll('.idsDiv');
            if (results.length === 0) {
                idsDiv.forEach((r) => {
                    if (outExecutorInformationList.includes(parseInt(r.getAttribute('ids')))) {
                        r.checked = true;
                    }
                })
            }
        });
        setChange(!change);
    }, [outExecutorInformationList]);

    console.log(outExecutorInformationList);

    // oldin belgilangan tashqi bajaruvchilarni berilgan mos formatga to'g'rilash
    useEffect(() => {
        let tashqiBajUlInline = document.querySelectorAll('.tashqiBajUlInline');
        let result = [];
        tashqiBajUlInline.forEach((d, index) => {
            let idsDiv1 = d.querySelectorAll('.idsDiv1');
            let bool = true, arr = [];
            idsDiv1.forEach((r) => {
                if (!r.checked) {
                    bool = false;
                }
            })
            if (bool) {
                d.querySelectorAll('.idsDiv').forEach((r) => {
                    if (r.checked) {
                        arr.push(r.getAttribute('ids'));
                    }
                });
                if (arr.length > 0)
                    result.push({ id: index, ids: arr, value: d.querySelector('.inputTashqiTash').value });
            } else {
                d.querySelectorAll('.idsDiv').forEach((r) => {
                    if (r.checked) {
                        arr.push(r.getAttribute('ids'));
                    }
                });
                if (arr.length > 0) {
                    result.push({ id: index, ids: arr, value: null });
                }
            }
            console.log(result);
        });
        setResults(result);
    }, [change]);

    // tashqi bajaruvchilarni saqlash
    const saveAllSelectOrganizations = () => {
        let tashqiBajUlInline = document.querySelectorAll('.tashqiBajUlInline');
        let result = [];
        tashqiBajUlInline.forEach((d, index) => {
            let idsDiv1 = d.querySelectorAll('.idsDiv1');
            let bool = true, arr = [];
            idsDiv1.forEach((r) => {
                if (!r.checked) {
                    bool = false;
                }
            })
            if (bool) {
                d.querySelectorAll('.idsDiv').forEach((r) => {
                    if (r.checked) {
                        arr.push(r.getAttribute('ids'));
                    }
                });
                if (arr.length > 0)
                    result.push({ id: index, ids: arr, value: d.querySelector('.inputTashqiTash').value });
            } else {
                d.querySelectorAll('.idsDiv').forEach((r) => {
                    if (r.checked) {
                        arr.push(r.getAttribute('ids'));
                    }
                });
                if (arr.length > 0) {
                    result.push({ id: index, ids: arr, value: null });
                }
            }
        })
        console.log(result);
        setResults(result);
        setOpenModal(false);
    }

    console.log(results);
    return (
        <div className="content" style={{ marginBottom: "110px" }}>
            <h1 style={{ margin: "10px 0 0 20px", fontWeight: "bold", textTransform: "upperCase" }}>Ko'rish</h1>
            <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-solid nav-tabs-solid-custom bg-primary NavLink"
                    style={{ paddingTop: "2px" }}>
                    <ContentNavbar />
                    <li className="nav-item">
                        <NavLink to={`/kiruvchi_resolution_kurish/${params.id}`} className="nav-link"
                            activeClassName='NavLinkLi'>
                            <i className="icon-eye2 mr-1"></i> Ko'rish
                        </NavLink>
                    </li>
                </ul>

                <div className="card">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="card-body w-100 ccc">
                                <div className="borderPdf">
                                    {data[0]?.document?.files?.length > 0 && data[0]?.document?.files?.map((file, ind) => (
                                        <>
                                            {file?.extention?.split('/')[file?.extention?.split('/').length - 1] === "pdf" && (
                                                <object data={url + "/api/file/view/" + file?.generatedName} type="application/pdf" style={{ width: "100%", height: "1000px" }}>
                                                    <iframe src={url + "/api/file/view/" + file?.generatedName} style={{ width: "100%", height: "1000px" }}></iframe>
                                                </object>
                                            )}
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="card-block mt-3">
                                {/* asosiy */}
                                <div className="card-box">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            <div className="card-header bg-primary text-white header-elements-inline">
                                                <h6 className="card-title" style={{ fontWeight: "bold", textTransform: "upperCase" }}>Asosiy</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="form-group form-group-floating row">
                                                            <div className="col-lg-12">
                                                                <div className="position-relative">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control daterange-single form-control-outline hujjatTuri"
                                                                        placeholder="Placeholder"
                                                                        defaultValue={data[0]?.document?.card?.cardName}
                                                                        disabled
                                                                    />
                                                                    <label className="label-floating">Hujjat turi</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="form-group form-group-floating row">
                                                            <div className="col-lg-12">
                                                                <div className={'changeBox'} style={{ height: '100%', width: '100%', border: '1px solid lightgray', borderRadius: '5px', '&>input': { border: 'none !important', outline: 'none !important' }, '&:hover': { border: 'none !important', outline: 'none !important' } }}>
                                                                    <DatePicker
                                                                        className={'sanaAsosiy'}
                                                                        id={'chiquvchiSana'}
                                                                        selected={startDate1}
                                                                        onChange={(date) => setStartDate1(date)}
                                                                        dateFormat={'dd.MM.yyyy'}
                                                                        isClearable
                                                                        placeholderText="Muddat/sana"
                                                                        showYearDropdown
                                                                        scrollableMonthYearDropdown
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body p-0">
                                                    <table
                                                        className="table table-bordered table-striped table-hover Tab">
                                                        <tbody>
                                                            {data[0]?.files?.length > 0 && data[0]?.files?.map((hujjat, index) => (
                                                                <>
                                                                    {hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "pdf" ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-pdf mr-2 fa-2x pdfIcon" style={{ fontSize: "20px" }} />
                                                                                {/* <a href={url + "/api/file/view/" + hujjat.id} target="_blank" rel="noreferrer noopener">PDF FILE</a> */}
                                                                                {hujjat?.originalName}
                                                                            </th>
                                                                        </tr>
                                                                    ) : (hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "doc" || hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "docx") ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-word mr-2 fa-2x wordIcon" style={{ fontSize: "20px" }} />
                                                                                {hujjat?.originalName}
                                                                            </th>
                                                                        </tr>
                                                                    ) : (hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "xls" || hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "xlsx") ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-excel mr-2 fa-2x excelIcon" style={{ fontSize: "20px" }} />
                                                                                {hujjat?.originalName}
                                                                            </th>
                                                                        </tr>
                                                                    ) : (hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "ppt" || hujjat?.originalName.split('.')[hujjat?.originalName.split('.').length - 1] === "pptx") ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-powerpoint mr-2 fa-2x pptIcon" style={{ fontSize: "20px" }} />
                                                                                {hujjat?.originalName}
                                                                            </th>
                                                                        </tr>
                                                                    ) : (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-archive mr-2 fa-2x rarIcon" style={{ fontSize: "20px" }}></i>
                                                                                {hujjat?.originalName}
                                                                            </th>
                                                                        </tr>
                                                                    )}
                                                                </>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* kiruvchi */}
                                <div className="card-box">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            <div className="card-header bg-primary text-white header-elements-inline">
                                                <h6 className="card-title" style={{
                                                    fontWeight: "bold",
                                                    textTransform: "upperCase"
                                                }}>Kiruvchi</h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="p-0">
                                                    <table
                                                        className="table table-bordered table-striped table-hover Tab">
                                                        <tbody>
                                                            {data[0]?.document?.files?.length > 0 && data[0]?.document?.files?.map((hujjat, index) => (
                                                                <>
                                                                    {hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "pdf" ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-pdf mr-2 fa-2x pdfIcon" style={{ fontSize: "20px" }} />
                                                                                <a href={url + "/api/file/view/" + hujjat?.id} target="_blank" rel="noreferrer noopener">PDF FILE</a>
                                                                            </th>
                                                                        </tr>
                                                                    ) : (hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "doc" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "docx" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "vnd.openxmlformats-officedocument.wordprocessingml.document") ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-word mr-2 fa-2x wordIcon"
                                                                                    style={{ fontSize: "20px" }} />
                                                                                <a href={url + "/api/file/view/" + hujjat?.id} target="_blank" rel="noreferrer noopener">WORD FILE</a>
                                                                            </th>
                                                                        </tr>
                                                                    ) : (hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "xls" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "xlsx" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-excel mr-2 fa-2x excelIcon"
                                                                                    style={{ fontSize: "20px" }} />
                                                                                <a href={url + "/api/file/view/" + hujjat?.id} target="_blank" rel="noreferrer noopener">EXCEL FILE</a>
                                                                            </th>
                                                                        </tr>
                                                                    ) : (hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "ppt" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "pptx" || hujjat?.extention?.split('/')[hujjat?.extention?.split('/').length - 1] === "vnd.openxmlformats-officedocument.presentationml.presentation") ? (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-powerpoint mr-2 fa-2x pptIcon"
                                                                                    style={{ fontSize: "20px" }} />
                                                                                <a href={url + "/api/file/view/" + hujjat?.id} target="_blank" rel="noreferrer noopener">POWERPOINT FILE</a>
                                                                            </th>
                                                                        </tr>
                                                                    ) : (
                                                                        <tr>
                                                                            <th className="d-flex align-items-center cursor-pointer">
                                                                                <i className="far fa-file-archive mr-2 fa-2x rarIcon"
                                                                                    style={{ fontSize: "20px" }}></i>
                                                                                <a href={url + "/api/file/view/" + hujjat?.id} target="_blank" rel="noreferrer noopener">ZIP, RAR FILE</a>
                                                                            </th>
                                                                        </tr>
                                                                    )}
                                                                </>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* rezolutsiya mazmuni */}
                                <div className="card-box">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            <div className="card-header bg-primary text-white header-elements-inline">
                                                <h6 className="card-title" style={{ fontWeight: "bold", textTransform: "upperCase" }}>Rezalutsiya mazmuni</h6>
                                            </div>
                                            <div className="form-group form-group-floating row my-2 mx-2">
                                                <div className="col-lg-12">
                                                    <div className="position-relative">
                                                        <textarea
                                                            className="form-control form-control-outline izoh rezTezkor"
                                                            placeholder="Placeholder "
                                                            style={{ height: "100px" }}
                                                            maxLength="301"
                                                            onChange={(e) => setTextareaChange(e.target.value)}
                                                            defaultValue={data[0]?.document?.resolutionContent}
                                                        >
                                                        </textarea>
                                                        <label className="label-floating">Izoh</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* tezkor rezolutsiya */}
                                <div className="card-box">
                                    <div className="col-lg-12">
                                        <div className="card">
                                            <div className="card-header bg-primary text-white header-elements-inline">
                                                <h6 className="card-title" style={{ fontWeight: "bold", textTransform: "upperCase" }}>Tezkor Rezalutsiya</h6>
                                            </div>
                                            <div className="card-body">
                                                <table
                                                    className="table table-bordered datatable-select-single table-striped table-hover Tab">
                                                    <tbody>
                                                        {tezkorRezolutsiya?.length > 0 && tezkorRezolutsiya?.map((dat, index) => (
                                                            <tr key={index} className="tezkorRezolutsiyaRow">
                                                                <td style={{ width: "5%" }}>
                                                                    <input type="checkbox" style={{ width: "30px", height: "20px" }} className="selectCheckbox" />
                                                                </td>
                                                                <td style={{ width: "95%" }} className="rezName">{dat?.name}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* bajaruvchi */}
                                <div className="card-box">
                                    <div className="col-lg-12">
                                        <div>
                                            <div className="card-header bg-primary text-white header-elements-inline">
                                                <h6 className="card-title" style={{
                                                    fontWeight: "bold",
                                                    textTransform: "upperCase"
                                                }}>Bajaruvchi</h6>
                                            </div>

                                            {data[0]?.inExecutorInformationList?.length > 0 && data[0]?.inExecutorInformationList?.map((dat, index) => (
                                                <div key={index}>
                                                    <form onSubmit={deleteFun1} className="bajaruvchiForm">
                                                        <div className="card-box">
                                                            <div className="card mb-3">
                                                                <div className="card-body" id="bajaruvchi">
                                                                    <div className="" style={{
                                                                        display: "flex",
                                                                        flexWrap: "wrap",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        <div className="d-flex col1 mb-1" style={{ flex: "1" }}>
                                                                            <div className="checkbox chb mr-1"
                                                                                title="Nazorat"
                                                                                onClick={(e) => checkedDivNazorat(e.target, index)}>
                                                                                <strong className="checkedName">N</strong>
                                                                                <strong className="iconCheck text-white"
                                                                                    style={{
                                                                                        display: dat?.executorStatusName === "NAZORAT UCHUN" && "flex",
                                                                                        backgroundColor: dat?.executorStatusName === "NAZORAT UCHUN" && "rgb(0, 86, 184)"
                                                                                    }}>N</strong>
                                                                            </div>
                                                                            <div className="checkbox chb mr-1"
                                                                                title="Umumlashtirish"
                                                                                onClick={(e) => checkedDivUmum(e.target, index)}>
                                                                                <strong className="checkedName">U</strong>
                                                                                <strong className="iconCheck text-white"
                                                                                    style={{
                                                                                        display: dat?.executorStatusName === "UMUMLASHTIRUVCHI" && "flex",
                                                                                        backgroundColor: dat?.executorStatusName === "UMUMLASHTIRUVCHI" && "rgb(0, 86, 184)"
                                                                                    }}>U</strong>
                                                                            </div>
                                                                            <div className="checkbox chb mr-1" title="Ma'lumot uchun"
                                                                                onClick={(e) => checkedDivM(e.target, index)}>
                                                                                <strong className="checkedName">M</strong>
                                                                                <strong className="iconCheck text-white"
                                                                                    style={{
                                                                                        display: dat?.executorStatusName === "MA'LUMOT UCHUN" && "flex",
                                                                                        backgroundColor: dat?.executorStatusName === "MA'LUMOT UCHUN" && "rgb(0, 86, 184)"
                                                                                    }}>M</strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col2 mb-1 mr-1"
                                                                            style={{ flex: "3" }}>
                                                                            <div className="form-group mb-0">
                                                                                <Select
                                                                                    defaultValue={{
                                                                                        value: `${(dat?.firstName && dat?.firstName?.length > 1) ? ((((dat?.firstName[0].toUpperCase() === "S" || dat?.firstName[0].toUpperCase() === "C") && dat?.firstName[1].toUpperCase() === "H")) ? dat?.firstName?.substring(0, 2) + ". " : dat?.firstName?.substring(0, 1) + ". ") : ""}${dat?.lastName}`,
                                                                                        label: `${(dat?.firstName && dat?.firstName?.length > 1) ? ((((dat?.firstName[0].toUpperCase() === "S" || dat?.firstName[0].toUpperCase() === "C") && dat?.firstName[1].toUpperCase() === "H")) ? dat?.firstName?.substring(0, 2) + ". " : dat?.firstName?.substring(0, 1) + ". ") : ""}${dat?.lastName}`
                                                                                    }}
                                                                                    options={xodimlar}
                                                                                    onChange={selectXodimFunc}
                                                                                    placeholder="Xodim"
                                                                                    className="XodimBajaruvchi"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col3 mb-1 mr-1" style={{ flex: "2" }}>
                                                                            <div className="form-group form-group-floating row mb-0">
                                                                                <div className="col-lg-12">
                                                                                    <div className="position-relative">
                                                                                        <textarea
                                                                                            className="form-control form-control-outline izohCol1"
                                                                                            style={{ height: "56px" }}
                                                                                            placeholder="Placeholder"
                                                                                            defaultValue={dat?.description}
                                                                                        >
                                                                                        </textarea>
                                                                                        <label
                                                                                            className="label-floating">Izoh</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col4 mb-1 mr-1"
                                                                            style={{ flex: "2" }}>
                                                                            <div
                                                                                className="form-group form-group-floating row mb-0">
                                                                                <div className="col-lg-12">
                                                                                    <div className="position-relative">
                                                                                        <input
                                                                                            type="date"
                                                                                            className="form-control daterange-single form-control-outline bajaruvchiSana"
                                                                                            id="chiquvchiSana"
                                                                                            placeholder="Placeholder"
                                                                                            defaultValue={dat?.deadline}
                                                                                            style={{ border: "1px solid lightgray" }}
                                                                                        />
                                                                                        <label className="label-floating">Sana</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col5 mb-1 mr-1"
                                                                            style={{ flex: "2" }}>
                                                                            <div className="form-group mb-0">
                                                                                {(dat?.repeatExecutePeriodDto?.name || dat?.repeatExecutePeriodDto?.period) ? (
                                                                                    <Select
                                                                                        defaultValue={{
                                                                                            value: (dat?.repeatExecutePeriodDto?.period),
                                                                                            label: (dat?.repeatExecutePeriodDto?.name ? dat?.repeatExecutePeriodDto?.name : dat?.repeatExecutePeriodDto?.period ? dat?.repeatExecutePeriodDto?.period : null)
                                                                                        }}
                                                                                        options={qaytaIjro}
                                                                                        onChange={(e) => selectQaytaIjroFunc(e, index)}
                                                                                        placeholder="Qayta Ijro"
                                                                                        className="qaytaIjro col1QaytaIjro"
                                                                                    />
                                                                                ) : (
                                                                                    <Select

                                                                                        options={qaytaIjro}
                                                                                        onChange={(e) => selectQaytaIjroFunc(e, index)}
                                                                                        placeholder="Qayta Ijro"
                                                                                        className="qaytaIjro col1QaytaIjro"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col6 mb-1" style={{ flex: "1" }}>
                                                                            <div style={{ height: "56px" }}>
                                                                                <div className="form-group mb-0">
                                                                                    <button type="submit"
                                                                                        className="btn btn-danger"
                                                                                        style={{
                                                                                            padding: "16px",
                                                                                            width: "60px"
                                                                                        }}><i
                                                                                            className="icon-trash"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-1 mr-1 visibleBoshqa" style={{ width: "100%", display: "none" }}>
                                                                        <div className="form-group form-group-floating row mb-0">
                                                                            <div className="col-12">
                                                                                <div className="position-relative">
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control form-control-outline boshqa"
                                                                                        style={{ height: "56px", }}
                                                                                        placeholder="Placeholder"
                                                                                    />
                                                                                    <label
                                                                                        className="label-floating">Boshqa</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            ))}

                                            {yangiQushish.map((yangi, index) => (
                                                <div key={index}>
                                                    <form onSubmit={deleteFun} className="bajaruvchiForm">
                                                        <div className="card-box">
                                                            <div className="card mb-3">
                                                                <div className="card-body" id="bajaruvchi">
                                                                    <div className="" style={{
                                                                        display: "flex",
                                                                        flexWrap: "wrap",
                                                                        alignItems: "center"
                                                                    }}>
                                                                        <div className="d-flex col1 mb-1" style={{ flex: "1" }}>
                                                                            <div className="checkbox chb mr-1" title="Nazorat"
                                                                                onClick={(e) => checkedDivNazorat(e.target, index + rowLeinExecutorInformationListLength)}>
                                                                                <strong className="checkedName">N</strong>
                                                                                <strong className="iconCheck text-white">N</strong>
                                                                            </div>
                                                                            <div className="checkbox chb mr-1"
                                                                                title="Umumlashtirish"
                                                                                onClick={(e) => checkedDivUmum(e.target, index + rowLeinExecutorInformationListLength)}>
                                                                                <strong className="checkedName">U</strong>
                                                                                <strong className="iconCheck text-white">U</strong>
                                                                            </div>
                                                                            <div className="checkbox chb mr-1" title="M"
                                                                                onClick={(e) => checkedDivM(e.target, index + rowLeinExecutorInformationListLength)}>
                                                                                <strong className="checkedName">M</strong>
                                                                                <strong className="iconCheck text-white">M</strong>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col2 mb-1 mr-1"
                                                                            style={{ flex: "3" }}>
                                                                            <div className="form-group mb-0">
                                                                                <Select
                                                                                    // defaultValue={options[1]}
                                                                                    options={xodimlar}
                                                                                    onChange={selectXodimFunc}
                                                                                    placeholder="Xodim"
                                                                                    className="XodimBajaruvchi"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col3 mb-1 mr-1"
                                                                            style={{ flex: "2" }}>
                                                                            <div
                                                                                className="form-group form-group-floating row mb-0">
                                                                                <div className="col-lg-12">
                                                                                    <div className="position-relative">
                                                                                        <textarea
                                                                                            className="form-control form-control-outline izohCol1"
                                                                                            style={{ height: "56px" }}
                                                                                            placeholder="Placeholder"
                                                                                        >
                                                                                        </textarea>
                                                                                        <label
                                                                                            className="label-floating">Izoh</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col4 mb-1 mr-1"
                                                                            style={{ flex: "2" }}>
                                                                            <div className="form-group form-group-floating row mb-0">
                                                                                <div className="col-lg-12">
                                                                                    <div className="position-relative">
                                                                                        <input
                                                                                            type="date"
                                                                                            className="form-control daterange-single form-control-outline bajaruvchiSana"
                                                                                            id="chiquvchiSana"
                                                                                            placeholder="Placeholder"
                                                                                            style={{ border: "1px solid lightgray" }}
                                                                                        />
                                                                                        <label className="label-floating">Sana</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col5 mb-1 mr-1"
                                                                            style={{ flex: "2" }}>
                                                                            <div className="form-group mb-0">
                                                                                <Select
                                                                                    // defaultValue={options[1]}
                                                                                    options={qaytaIjro}
                                                                                    onChange={(e) => selectQaytaIjroFunc(e, index + data[0]?.inExecutorInformationList?.length)}
                                                                                    placeholder="Qayta Ijro"
                                                                                    className="qaytaIjro col1QaytaIjro"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col6 mb-1" style={{ flex: "1" }}>
                                                                            <div style={{ height: "56px" }}>
                                                                                <div className="form-group mb-0">
                                                                                    <button
                                                                                        type="submit"
                                                                                        className="btn btn-danger"
                                                                                        style={{
                                                                                            padding: "16px",
                                                                                            width: "60px"
                                                                                        }}>
                                                                                        <i className="icon-trash"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-1 mr-1 visibleBoshqa" style={{ width: "100%", display: "none" }}>
                                                                        <div className="form-group form-group-floating row mb-0">
                                                                            <div className="col-12">
                                                                                <div className="position-relative">
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control form-control-outline boshqa"
                                                                                        style={{ height: "56px", }}
                                                                                        placeholder="Placeholder"
                                                                                    />
                                                                                    <label className="label-floating">Boshqa</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mr-2 my-2">
                                    <button type="button" className="btn btn-primary" onClick={newCreateBajaruvchi} id="myFormInput">
                                        Yangi qo'shish
                                    </button>
                                </div>
                            </div>

                            {/* <!-- tashqi bajaruvchilar --> */}
                            <div className="card-body px-0">
                                <div className="card-box ">
                                    <div className="col-lg-12">
                                        <button className="btn btn-dark w-100" onClick={() => setOpenModal(true)} ><i className="icon-plus2"></i>
                                            <span style={{ position: "relative" }}>
                                                Tashqi Bajaruvchilar
                                                {(results?.length) && (
                                                    <span className="badge2">{results.length}</span>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className={'adminWindow pt-5'} style={{ display: openModal ? "block" : "none" }}>
                                    <div className="kurishModalBajaruvchi">
                                        <div className="modal-content">
                                            <div className="modal-header bg-primary text-white">
                                                <h5 className="modal-title">Tashqi bajaruvchilar</h5>
                                                <button type="button" className="close" onClick={() => setOpenModal(false)}>&times;</button>
                                            </div>
                                            <div className="modal-body bodyModal">
                                                {/* yangisi */}
                                                <ul className="tashqiBaj">
                                                    {yunalishlar.map((dt, index) => (
                                                        <div className="yunalishlar">
                                                            {/* onClick={() => defaultCheckedCheckbox(index)} */}
                                                            <li className="tashqiBajLi1" ids={dt?.id}  >
                                                                <div className="d-flex align-items-center ">
                                                                    <i className="fas fa-minus mr-2 iconMinus" style={{ display: "none" }}></i>
                                                                    <i className="fas fa-plus mr-2 iconPlus" ></i>
                                                                    <div className="position-relative">
                                                                        {dt?.orgTypeName}
                                                                        <span style={{ display: "none" }}>1</span>
                                                                    </div> <br />
                                                                </div>
                                                            </li>
                                                            <div className="tashqiBajUlInline" style={{ display: "none" }}>
                                                                <span className="allChecked mr-2">Barchasini tanlash</span>
                                                                <input type="text" className="inputTashqiTash" defaultValue={"Tuman shahar hokimliklariga"} />
                                                                <br />
                                                                <input
                                                                    type="text"
                                                                    className="form-control inputChange1"
                                                                    placeholder="Qidiruv..."
                                                                    onChange={(e) => changeInputChange1(e.target.value, index)}
                                                                />
                                                                {dt?.organizations?.map((d, index1) => (
                                                                    <>
                                                                        {/* onClick={() => defaultCheckedCheckboxInline(index1)} */}
                                                                        <div className="inlineContent" >
                                                                            <input
                                                                                type="checkbox"
                                                                                ids={d?.id}
                                                                                className="idsDiv idsDiv1"
                                                                            />
                                                                            <div >{d?.orgName}</div>
                                                                        </div>
                                                                        <div className="inlineContent2" style={{ display: "none" }}>
                                                                            <span className="allChecked1">Barchasini tanlash</span> <br />
                                                                            <input type="text" className="form-control inputChange2" placeholder="Qidiruv..." onChange={(e) => changeInputChange2(e.target.value, index)} />
                                                                            {d?.organizations?.map((d1, index) => (
                                                                                <div className="inlineContent3">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        ids={d1?.id}
                                                                                        className="idsDiv idsDiv2"
                                                                                    />
                                                                                    <div >{d1?.orgName}</div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ul>

                                                <div className="d-flex justify-content-end" >
                                                    <button type="button" className="btn btn-primary" onClick={saveAllSelectOrganizations}>
                                                        <i className="fas fa-save mr-2"></i>Saqlash
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* e imzo */}
                                <div className="">
                                    {/* <div className="row mt-2 d-flex justify-content-end">
                                        {(ranks.includes(1) || ranks.includes(2) || ranks.includes(3)) && (
                                            <div className="col-lg-6">
                                                <div className="card mr-2">
                                                    <div className="form-group text-color d-flex align-items-start p-2">
                                                        <i className="fas fa-key fa-2x" style={{ marginTop: "40px" }}></i>
                                                        <div className="w-100"
                                                            style={{ fontSize: "12px", textTransform: "capitalize" }}>
                                                            <form name="testform" className="testform">
                                                                <div className="testformDiv">
                                                                    <label id="message" style={{ color: "red" }}></label>
                                                                    <span
                                                                        style={{ color: "blue" }}>Elektron kalitni tanlang</span>
                                                                    <br />
                                                                    {/* onChange="cbChanged(this)" */}
                                    {/* <select name="key" className="key"></select> 
                                                                    <div className="selectElement"
                                                                        onClick={() => setSelectVisible(!selectVisible)}>
                                                                        {selectVisible ? (
                                                                            <i className="fas fa-angle-up iconDownUp"></i>
                                                                        ) : (
                                                                            <i className="fas fa-angle-down iconDownUp"></i>
                                                                        )}
                                                                        <span name="spanKey" className="selectValue"></span>
                                                                        <ul name="key" className="key"
                                                                            style={{ display: selectVisible ? "block" : "none" }}></ul>
                                                                    </div>
                                                                    <br />
                                                                    Текст для подписи <br />
                                                            <textarea name="data"></textarea><br />
                                                            <button type="button" className="eimzoClick" onClick={window['sign']}>Подписать</button><br />
                                                            ID ключа <label id="keyId"></label><br />
                                                            Подписанный документ PKCS#7<br />
                                                            <textarea name="pkcs7"></textarea><br />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div> */}

                                </div>
                                <div className="card-box mt-2">
                                    <div className="col-lg-12 w-100 d-flex justify-content-between align-items-center">
                                        {/* {(ranks.includes(1) || ranks.includes(2) || ranks.includes(3)) && (
                                                <button type="button" className="btn btn-danger" onClick={cancelEimzo}>Bekor qilish</button>
                                            )} */}
                                        <div class="form-check d-flex align-items-center" onClick={() => setNazorat(!nazorat)}>
                                            {nazorat ? <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" style={{ width: "30px", height: "20px" }} checked />
                                                : <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" style={{ width: "30px", height: "20px" }} />
                                            }
                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontSize: "20px" }}>
                                                Nazorat uchun
                                            </label>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-primary ml-1"
                                            onClick={saveAllData}
                                        >
                                            Saqlash
                                        </button>
                                    </div>
                                </div>
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