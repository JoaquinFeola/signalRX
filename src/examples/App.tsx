
import { useSignal } from "@/Core/Hooks/useSignal"
import "./App.css"
import { authSignal } from "./store/authStore"


function App() {
  const data = useSignal(authSignal, (data) => data);
  return (
    <>
    <span>{data}</span>
      <label style={{display: "flex", flexDirection: "column", gap: 10}} htmlFor="token">
        <span>Token</span>
        <input value={data} type="text" onChange={e => authSignal.setValue(e.target.value)} placeholder="token" />
      </label>
    </>
  )
}


export default App
