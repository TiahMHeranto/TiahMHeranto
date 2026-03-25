import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "../Pages/MainPage"
import AboutPage from "../Pages/AboutPage"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}></Route>
                <Route path="about" element={<AboutPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter