const express = require("express");
const router = express.Router();

const baseRouter = require("./BaseRouter");

function Router({ mediator }) {
    router.get("/*", getError);

    const BaseRouter = new baseRouter();

    function getError(request, response) {
        response.json(BaseRouter.error(9000));
    }


    return router;
}


module.exports = Router;
