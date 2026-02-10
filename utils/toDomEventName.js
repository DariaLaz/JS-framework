const toDomEventName = (propKey) => propKey.replace(/^on/, "").toLowerCase();

export const TEXT_TAG = "__TEXT__";
export default toDomEventName;
