import { IncomingHttpHeaders } from "http"

type JSONValue = string | number | boolean | JSONObject | JSONArray | IncomingHttpHeaders

type JSONArray = Array<JSONValue>

export interface JSONObject {
    [key: string]: JSONValue
}