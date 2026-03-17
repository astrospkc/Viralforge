import { Link } from "react-router-dom";

function PageNotFound() {
    return (
        <div className="flex flex-row w-full h-full justify-center items-center">
            <h1 className="text-red-700 text-5xl">Page not found</h1>
            <Link to={"/signin"} >SignIn</Link>
        </div>
    )
}

export default PageNotFound