import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "../Pages/MainPage"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter