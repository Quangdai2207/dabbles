"use strict"

import App from "./App.js";
import {htmlPath} from "../pagesPath/paths.js";

/**
 * <p style="color: white">
 *     Function <strong style="color: #eeee; font-style: italic">index()</strong>
 *         loads the whole main layout web-apps
 * </p>
 * **/
export default function index() {
    const root = $("#root");
    const layout = htmlPath.layouts.layout;

    $.get(layout).done(html => {
        //** Render main layout for the whole Single Page Application
        root.empty().append(html);
        const mainContent = $("#main-content")
        if (!mainContent) return;

        App(mainContent);
    })
        .fail((html) => {
            console.error("Occurred error while loading html ", html);
            root.empty().append("<div><p>Has an error occurred while loading page</p><div>")
        })
}