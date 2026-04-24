import NOTFOUND from "./pages/notfound.js";
import {AuthRouterDom} from "./routers/auth.js";
import {AdminRouterDom} from "./routers/admin.js";
import {SuperRouterDom} from "./routers/super_admin.js";
import reloadCaptcha from "../utils/captcha.js";

/**
 *  <h1 style="color: white">Handling RouterDOMs</h1>
 *  <hr />
 *  <p style="color: white; font-family: 'roboto'">
 *      Trong Module <strong style="color: #EEEE; font-weight:900">router.js</strong>, đây là phần Core để xử lý các Router cho các DOM tương ứng khi điều hướng bằng thao tác click
 *      hoặc truy vấn trực tiếp trên URL của trình duyệt. Module <strong style="color: #EEEE; font-weight:900">router.js</strong> có các phương thức xử lý chính:
 *      <ul style="padding: 10px">
 *          <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">initRoutes(mainContent)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Phương thức này được khởi tạo ngay lần đầu tiên khi DOM được render với ROLE tương ứng.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Chức năng của <strong>initRoutes()</strong> phục vụ cho tác vụ navigate. Khi truy vấn trực tiếp bằng URL, 404 sẽ được render thay vì layout Super-admin mặc định
 *                       với route <strong><i>/admin/dashboard</i></strong>.
 *                   </li>
 *                   <li style="color:white">
 *                       <strong>Ví dụ:</strong> ROLE là Super-admin, Layout chính của Super-admin được render, đồng thời initRoutes thiết lập hệ thống router DOM nội bộ cho layout.
 *                  </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *              <strong style="color:#0af">routes</strong>:
 *              <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Là collections chứa các route tương ứng cho từng ROLE cụ thể. Trong đó:
 *                       <ol style="padding-left: 10px">
 *                           <li><strong>auth:</strong> tập hợp các route liên quan đến Authentication</li>
 *                           <li><strong>portal:</strong> tập hợp các route của ROLE Admin</li>
 *                           <li><strong>dashboard:</strong> tập hợp các route của ROLE Super-admin</li>
 *                       </ol>
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *              <strong style="color:#0af">navigate(path, mainContent)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Gọi khi initRoutes được khởi tạo. Function này thực hiện chuyển đổi UI khi click vào link hoặc button.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Lưu <strong style="color:green">path</strong> vào History API của trình duyệt bằng method <i style="color:orange">history.pushState()</i> mà không reload trang.
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">internalRouter(path, mainContent)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Xử lý truy vấn URL trực tiếp trên trình duyệt. Nếu không có, sẽ render 404 thay vì layout Super-admin.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       <strong>Luồng thực thi:</strong>
 *                       <ol style="padding-left:20px">
 *                           <li>Xác định tiền tố của path (/admin, /account, /auth) để chọn đúng group routes cho ROLE tương ứng.</li>
 *                           <li>Gọi <strong style="color:#0af">pathParams(path, group)</strong> để kiểm tra route có tham số hay không.</li>
 *                           <li>Nếu không tìm thấy handler, gọi 404 page.</li>
 *                       </ol>
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">pathParams(path, routes)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Xử lý route chứa tham số khi navigate hoặc truy vấn trực tiếp.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Ví dụ URL: <code>/admin/users/88</code>, route được định nghĩa là <code>/admin/users/:id</code>.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                      <strong>Logic:</strong>
 *                       <ol style="padding-left:20px">
 *                           <li>Lấy tất cả keys của routes và lặp qua.</li>
 *                           <li>Kiểm tra key có chứa <code>:</code> (tức là có parameter).</li>
 *                           <li>Chuyển route key sang Regex:
 *                               <code>/admin/users/:id → ^/admin/users/(\w+)$</code>
 *                               <ul>
 *                                   <li>Dấu ^: bắt đầu của string</li>
 *                                   <li>Dấu $: kết thúc của string</li>
 *                                   <li>\w+: match 1 hoặc nhiều ký tự (a-z, A-Z, 0-9, _)</li>
 *                               </ul>
 *                           </li>
 *                           <li>Thực hiện <code>path.match(regex)</code> để kiểm tra URL có match với route không.</li>
 *                           <li>Nếu match thành công, lấy tên param từ route (ví dụ <code>id</code>) và value từ URL (ví dụ <code>88</code>).</li>
 *                           <li>Trả về object:
 *                               <code>{ path: "/admin/users/:id", handler: routes["/admin/users/:id"], params: { id: "88" } }</code>
 *                           </li>
 *                       </ol>
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Nếu route không có tham số, trả về object handler và params rỗng.
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">normalize(path)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Làm sạch URL trước khi xử lý: xóa query string và dấu <code>/</code> cuối cùng.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Ví dụ: <code>/admin/users/88/?foo=bar → /admin/users/88</code>
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Code:
 *                       <code>return path.split("?")[0].replace(/\/$/, "");</code>
 *                   </li>
 *               </ul>
 *          </li>
 *      </ul>
 *  </p>
 *
 * **/
/**
 *  <h1 style="color: white">Handling RouterDOMs</h1>
 *  <hr />
 *  <p style="color: white; font-family: 'roboto'">
 *      In the <strong style="color: #EEEE; font-weight:900">router.js</strong> module, this is the core part for handling DOM Routers when navigating via click
 *      actions or direct URL access in the browser. The <strong style="color: #EEEE; font-weight:900">router.js</strong> module has the main methods:
 *      <ul style="padding: 10px">
 *          <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">initRoutes(mainContent)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                       This method is initialized the first time the DOM is rendered for the corresponding ROLE.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       The purpose of <strong>initRoutes()</strong> is for navigation. When accessing a URL directly, 404 will be rendered instead of the Super-admin default layout
 *                       at <strong><i>/admin/dashboard</i></strong>.
 *                   </li>
 *                   <li style="color:white">
 *                       <strong>Example:</strong> If ROLE is Super-admin, the main layout is rendered and initRoutes sets up the internal RouterDOM system for the layout.
 *                  </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *              <strong style="color:#0af">routes</strong>:
 *              <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Collections of routes for each specific ROLE. Inside:
 *                       <ol style="padding-left: 10px">
 *                           <li><strong>auth:</strong> collection of routes related to Authentication</li>
 *                           <li><strong>portal:</strong> collection of routes for Admin ROLE</li>
 *                           <li><strong>dashboard:</strong> collection of routes for Super-admin ROLE</li>
 *                       </ol>
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *              <strong style="color:#0af">navigate(path, mainContent)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Called when initRoutes is initialized. This function handles UI switching when clicking links or buttons.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Saves the <strong style="color:green">path</strong> in the browser History API using <i style="color:orange">history.pushState()</i> without reloading the page.
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">internalRouter(path, mainContent)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Handles direct URL access in the browser. If not implemented, direct access would break the SPA and render 404 instead of Super-admin layout.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       <strong>Execution flow:</strong>
 *                       <ol style="padding-left:20px">
 *                           <li>Determine the path prefix (/admin, /account, /auth) to select the correct route group for the ROLE.</li>
 *                           <li>Call <strong style="color:#0af">pathParams(path, group)</strong> to check if the route has parameters.</li>
 *                           <li>If no handler is found, render 404 page.</li>
 *                       </ol>
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">pathParams(path, routes)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Handles routes containing parameters during navigation or direct URL access.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Example URL: <code>/admin/users/88</code>, with route defined as <code>/admin/users/:id</code>.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                      <strong>Logic:</strong>
 *                       <ol style="padding-left:20px">
 *                           <li>Get all route keys and loop through them.</li>
 *                           <li>Check if the key contains <code>:</code> (indicating a parameter).</li>
 *                           <li>Convert route key to Regex:
 *                               <code>/admin/users/:id → ^/admin/users/(\w+)$</code>
 *                               <ul>
 *                                   <li> `^` : start of string</li>
 *                                   <li> `$` : end of string</li>
 *                                   <li> `\w+` : matches 1 or more word characters (a-z, A-Z, 0-9, _)</li>
 *                               </ul>
 *                           </li>
 *                           <li>Use <code>path.match(regex)</code> to check if URL matches the route.</li>
 *                           <li>If matched, extract param name from route (e.g., <code>id</code>) and value from URL (e.g., <code>88</code>).</li>
 *                           <li>Return object:
 *                               <code>{ path: "/admin/users/:id", handler: routes["/admin/users/:id"], params: { id: "88" } }</code>
 *                           </li>
 *                       </ol>
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                      If the route has no parameters, return the handler and empty params object.
 *                   </li>
 *               </ul>
 *          </li>
 *           <li style="font-family: 'roboto'; color: #eeee">
 *               <strong style="color:#0af">normalize(path)</strong>:
 *               <ul style="padding-left: 20px">
 *                   <li style="font-family: 'roboto'; color:white">
 *                      Cleans the URL before processing: removes query string and trailing slash.
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Example: <code>/admin/users/88/?foo=bar → /admin/users/88</code>
 *                   </li>
 *                   <li style="font-family: 'roboto'; color:white">
 *                       Code:
 *                       <code>return path.split("?")[0].replace(/\/$/, "");</code>
 *                   </li>
 *               </ul>
 *          </li>
 *      </ul>
 *  </p>
 *
 * **/

export default function initRoutes(mainContent) {
    $(document).on("click", "[data-link]", function (e) {
        e.preventDefault();

        const path = $(this).attr("href");
        navigate(path, mainContent);
    });

    window.onpopstate = () => {
        internalRouter(location.pathname, mainContent);
    };
}

//** Defines RouterDOMs here with ROLE prefix
const routes = {
    auth: AuthRouterDom,
    admin: SuperRouterDom,
    account: AdminRouterDom
};

/* ------------------ CORE NAVIGATION ------------------ */
function navigate(path, mainContent) {
    path = normalize(path);
    history.pushState(null, "", path);
    internalRouter(path, mainContent);
}

/* ------------------ MAIN ROUTER ------------------ */
export function internalRouter(path, mainContent) {
    const prefix = path.split("/")[1];
    const group = routes[prefix];

    if (!group) {
        return NOTFOUND(path, mainContent);
    }

    const match = pathParams(path, group);
    // console.log("match route => ", match);

    if (!match) {
        return NOTFOUND(path, mainContent);
    }

    if (Object.keys(match.params).length > 0) {
        match.handler(path, mainContent, match.params);
    } else {
        match.handler(path, mainContent);
    }
}

//** Handling URL params like path params, path variable, queryString:
//** http://localhost:8668/dashboard/users/1
function pathParams(path, routes) {
    // console.log("Origin path => ", path);
    //** Get key object is routes had defines before => {route : Fn()}
    const routeKeys = Object.keys(routes);

    //** Loop route of routeKeys array
    for (let route of routeKeys) {
        //** Check internal route has any contains symbol ":"
        if (route.includes(":")) {
            // console.log("Route key => ", route); //** /auth/reset-password/:slug

            //** Convert route to routeRegex like this => /admin/users/:id -> /admin/users/(\\w+) with ([\w-]+) the same pattern [a-zA-Z0-9_]+
            const routeRegex = route.replace(/:\w+/g, "([\\w-]+)");
            // console.log("Trans routeRegex => ", routeRegex);  //** /admin/users/(\w+)

            //** Init Regex Object with symbol "^" start and "$" ending.
            /** This mean with route when we query on URL or navigate must be the same with route pattern defined that is "/admin/users/:id",
             * so when we query URL or navigate with actual id that is /admin/users/1 not :id
             * =>> So, regex Object required route pattern must be correctly absolute with ^ start with and $ to ending by.
             **/
            const regex = new RegExp("^" + routeRegex  + "$");
            // console.log("Regex => ", regex); //** /^\/admin\/users\/([\w-]+)$/

            //** match returns an array, if path is /admin/users/1 matching pattern /^\/admin\/users\/([\w-]+)$/,
            const match = path.match(regex);
            // console.log("Match route within pathParam function => ", match);

            if (match) {
                // console.log("Match route within pathParam function IF scope => ", match);
                const paramName = route.match(/:([\w-]+)/)[1]; //** Get params at index 1 in the match array
                // console.log("Param name => ", paramName);
                // console.log("Param name => ", route.match(/:([\w-]+)/));

                const paramValue = match[1];
                // console.log("Param value => ", paramValue);

                //** If path has param, return the object including params in the path
                return {
                    path: route,
                    handler: routes[route],
                    params: {[paramName]: paramValue}
                };
            }
        }
    }

    //** static,
    //* IF path without params return the object with params is empty object
    if (routes[path]) {
        // console.log("Roues path => ", routes[path]);
        return {
            path,
            handler: routes[path],
            params: {}
        };
    }
    return null;
}

//** CLEAN THE URL
//** Remove characters with type query-string on router browser like
//** http://localhost:8668/dashboard/users?id=1
function normalize(path) {
    return path.split("?")[0].replace(/\/$/, "");
}
