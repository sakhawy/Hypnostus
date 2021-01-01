import axios from "axios"

const API_CALLED = "API_CALLED"
const API_CALL_SUCCEEDED = "API_CALL_SUCCEEDED"
const API_CALL_FAILED = "API_CALL_FAILED"

export const callApi = (call={method: null, endpoint: null, data: null, params: null}) => async (dispatch, getState) => {
    dispatch({
        type: API_CALLED
    })
    const token = getState().user.token ? `token ${getState().user.token}` : "" 
    try {
        const res = await axios({
            method: call.method,
            url: `http://127.0.0.1:8000/api/${call.endpoint}`,
            headers: {
                "Authorization": token,
            },
            data : call.data,
            params: call.params
        })
        dispatch({
            type: API_CALL_SUCCEEDED
        })
        return res.data
    }
    catch (error) {
        dispatch({
            type: API_CALL_FAILED
        })
        return false
    }
}