import { useObserver } from "../../Core/hooks/useObserver"
import { listObserver, quitFromList } from "../store/authStore"

export const Text = () => {
    const list = useObserver(listObserver, (state) => state.list);
   
    return (
        <div>
            <ul>
                {list.map((li, i) => (
                    <li style={{marginTop: 10, display: "flex", justifyContent: "space-between"}} key={i}>
                        {li.title}
                        <button style={{marginLeft: 40}} onClick={() => quitFromList(i)}>Quitar</button>    
                    </li>
                ))}
            </ul>
        </div>
    )
}
