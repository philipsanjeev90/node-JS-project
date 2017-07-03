'use strict';

import ResponseTemplate from 'app/global/templates/response';
import Util from 'app/global/api';
/** @Middleware
 * This function is being used to check for API calls to vaidate Location entered
 * @param {req,res,next}
 * @accepted if its string
 * @returns {error,next()}  return response or forward api call to next Middleware
 */
  /* istanbul ignore next */
let validateLocation = (req, res, next) => {

    if (req.method === 'GET') {

        let location = req.params.location;
        if (!location || !Util.checkforString(location)) {

            res.json(ResponseTemplate.errorContent());

        } else {
            next()

        }
    } else {
        next();
    }

}

export default validateLocation;
