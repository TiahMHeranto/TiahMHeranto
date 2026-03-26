import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainPage from "../Pages/MainPage"
import AboutPage from "../Pages/AboutPage"
import ContactPage from "../Pages/ContactPage"

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}></Route>
                <Route path="about" element={<AboutPage />}></Route>
                <Route path="contact" element={<ContactPage />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter