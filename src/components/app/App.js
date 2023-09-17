import {lazy, Suspense} from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SinglePage = lazy(() => import('../pages/singlePage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));
const SingleCharPage = lazy(() => import('../pages/SingleCharPage'));


const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                  <Suspense fallback={<span>Loading...</span>}>              
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/char/:id" element={<SinglePage Component={SingleCharPage} dataType={'character'}/>}/>
                        <Route path="/comics" element={<ComicsPage/>}/>
                        <Route path="/comics/:id" element={<SinglePage Component={SingleComicPage} dataType={'comic'}/>}/>
                        <Route path="*" element={<Page404/>}/>
                    </Routes>
                  </Suspense>
               </main>
            </div>
        </Router>
    )
}

export default App;