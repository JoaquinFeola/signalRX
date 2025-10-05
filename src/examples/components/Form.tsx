import { useState } from "react"
import { addToList, listObserver } from "../store/authStore"

export const Form = () => {
    const [data, setData] = useState("");

    const createLi = () => {
        addToList({ title: data })
        setData("");
    }
    return (
        <>
            <label style={{ display: "flex", flexDirection: "column", gap: 10 }} htmlFor="">
                <span>Titulo</span>
                <input onChange={(e) => setData(e.target.value)} value={data} type="text" />

            </label>
            <button onClick={createLi} style={{ marginTop: 10, width: 400 }}>Crear</button>
        </>
    )
}
