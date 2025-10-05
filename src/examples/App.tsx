import { Form } from './components/Form'
import { Text } from './components/Text'
import "./App.css"




function App() {
  const d = async() =>  {
    console.log(navigator)
  }
  d()
  return (
    <>
      <Text />
      <Form />
    </>
  )
}

export default App
