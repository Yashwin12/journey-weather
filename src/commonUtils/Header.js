import React from "react";

const Header = ( {title} ) => {
    return (
        <div>
            <div class="alert alert-info alert-dismissible">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Info!</strong> This site is using free-tier of the Google Maps APIs, so it might not behave as "production-ready" or may not even work. Please read more details about the project over <a target="_blank"
                href="https://github.com/Yashwin12/journey-weather">
                here
              </a>              
            </div>
            <h2 className="mt-3 text-center" id = "headerBar"> { title } </h2>
        </div>
    );
}

export default Header;