function getAttributeFromNode(node, attribute) {
    let result = []
    for (let attrib of attribute) {
        result.push(node.getAttribute(attrib));
    }
    return result;
}


function setAttributeToNode(node, pair) {
    for (let [attribute, value] of pair) {
        node.setAttribute(attribute, value);
    }
}

export { getAttributeFromNode, setAttributeToNode };
