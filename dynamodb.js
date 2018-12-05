exports.saveData = async function (handlerInput , data) {
    handlerInput.attributesManager.setPersistentAttributes(data);
    await handlerInput.attributesManager.savePersistentAttributes();
}

exports.getData = async function (handlerInput) {
    var dynamoAttributes = await handlerInput.attributesManager.getPersistentAttributes();
    return dynamoAttributes
}