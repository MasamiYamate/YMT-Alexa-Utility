const Alexa = require('ask-sdk-core')
const device = require('./device')

module.exports.bodyType = {
    //Tokenをセットします
    setToken: function (token) {
        this.token = token
    },
    //戻るボタン
    setBackBtnIsVisible: function (isVisible) {
        this.backButton = isVisible
    },
    //Titleの設定
    setTitle: function (title) {
        this.titleTxt = title
    },
    //背景画像パス、のセット
    setBackgroundImgSrc: function (src) {
        this.backgroundImageSrc = src
    },
    //テンプレート内で表示する画像パスのセット
    setImgSrc: function (src) {
        this.imageSrc = src
    },

    //テンプレート内で表示する文字列をセット
    setText: function (primaryText , secondaryText , tertiaryText) {
        this.primaryText    = primaryText
        this.secondaryText  = secondaryText
        this.tertiaryText   = tertiaryText
    },

    //ヒント文をセットします ※Bodytemplate3のみ有効
    setHintMsg: function (msg) {
        this.hint = msg
    },

    //テンプレートを生成する
    create: function (handlerInput , typeName) {
        var setData = {}
        if (this.token) {
            setData['token'] = this.token
        }
        if (this.isVisible) {
            setData['backButton'] = this.isVisible
        }
        if (this.titleTxt) {
            setData['title'] = this.titleTxt
        }
        if (this.backgroundImageSrc) {
            setData['backgroundImage'] = this.backgroundImageSrc
        }
        if (this.imageSrc) {
            setData['image'] = this.imageSrc
        }
        var setTextData = {'primaryText': '' , 'secondaryText': '', 'tertiaryText':''}
        if (this.primaryText) {
            setTextData['primaryText'] = this.primaryText
        }
        if (this.secondaryText) {
            setTextData['secondaryText'] = this.secondaryText
        }
        if (this.tertiaryText) {
            setTextData['tertiaryText'] = this.tertiaryText
        }
        setData['textContent'] = setTextData

        let addTemplate = createBodyTemplate(typeName , setData)
        //付与対象のテンプレートがある場合は、付与します
        if (device.isDisplay(handlerInput)) {
            if (addTemplate) {
                handlerInput.responseBuilder.addRenderTemplateDirective(addTemplate)
                if (typeName == 'BodyTemplate3' && this.hint) {
                    handlerInput.responseBuilder.addHintDirective(this.hint)
                }
            }
        }
    }
}

module.exports.listType = {
    //Tokenをセットします
    setToken: function (token) {
        this.token = token
    },
    //戻るボタン
    setBackBtnIsVisible: function (isVisible) {
        this.backButton = isVisible
    },
    //Titleの設定
    setTitle: function (title) {
        this.titleTxt = title
    },
    //背景画像パス、のセット
    setBackgroundImgSrc: function (src) {
        this.backgroundImageSrc = src
    },
    //ListItemを追加します
    addListItem: function (tokenId , imgSrc , primaryText , secondaryText , tertiaryText) {
        var listItem = []
        if (this.listItem) {
            listItem = this.listItem
        }
        var addItem = {'token':''}
        if (tokenId) {
            addItem['token'] = tokenId
        }
        if (imgSrc) {
            addItem['src'] = imgSrc
        }
        var setTextData = {'primaryText': '' , 'secondaryText': '', 'tertiaryText':''}
        if (this.primaryText) {
            setTextData['primaryText'] = this.primaryText
        }
        if (this.secondaryText) {
            setTextData['secondaryText'] = this.secondaryText
        }
        if (this.tertiaryText) {
            setTextData['tertiaryText'] = this.tertiaryText
        }
        addItem['textContent'] = setTextData
        listItem.push(addItem)
        this.listItem = listItem
    },
    //テンプレートを生成します
    create : function (handlerInput , typeName) {
        var setData = {}
        if (this.token) {
            setData['token'] = this.token
        }
        if (this.isVisible) {
            setData['backButton'] = this.isVisible
        }
        if (this.titleTxt) {
            setData['title'] = this.titleTxt
        }
        if (this.backgroundImageSrc) {
            setData['backgroundImage'] = this.backgroundImageSrc
        }
        if (this.listItem) {
            setData['listItems'] = this.listItem
        }
        let addTemplate = createListTemplate(handlerInput , setData)
        if (device.isDisplay(handlerInput)) {
            if (addTemplate) {
                handlerInput.responseBuilder.addRenderTemplateDirective(addTemplate)
            }
        }
    }
}

function createBodyTemplate (typeName , setData) {
    var responseData = {type:typeName}
    //Tokenの付与
    if (setData['token']) {
        responseData['token'] = setData['token']
    }else{
        responseData['token'] = 'unknownToken'
    }
    //BackButtonの表示非表示
    if (setData['backButton']) {
        responseData['backButton'] = setData['backButton']
    }else{
        responseData['backButton'] = 'VISIBLE'
    }
    //Titleの付与
    if (setData['title']) {
        responseData['title'] = setData['title']
    }else{
        responseData['title'] = ''
    }
    //背景画像の付与
    if (setData['backgroundImage']) {
        responseData['backgroundImage'] = createImageContent(setData['backgroundImage']) 
    }
    //テンプレート内表示用画像の付与
    if (setData['image']) {
        responseData['image'] = createImageContent(setData['image'])
    }
    //テキストデータの付与
    var textContentDic = null
    if (setData['textContent']) {
        textContentDic = setData['TextContent']
    }
    responseData['textContent'] = createTextContent(textContentDic)

    return responseData
}

function createListTemplate (typeName , setData) {
    var responseData = {type:typeName}
    //Tokenの付与
    if (setData['token']) {
        responseData['token'] = setData['token']
    }else{
        responseData['token'] = 'unknownToken'
    }
    //BackButtonの表示非表示
    if (setData['backButton']) {
        responseData['backButton'] = setData['backButton']
    }else{
        responseData['backButton'] = 'VISIBLE'
    }
    //Titleの付与
    if (setData['title']) {
        responseData['title'] = setData['title']
    }else{
        responseData['title'] = ''
    }
    //背景画像の付与
    if (setData['backgroundImage']) {
        responseData['backgroundImage'] = createImageContent(setData['backgroundImage']) 
    }
    //リストアイテムの付与
    var setItems = []
    if (setData['listItems']) {
        setItems = createListItems(setData['listItems'])
    }
    responseData['listItems'] = setItems
    return responseData
}

function createListItems (items) {
    var responseData = []
    for (var i in items) {
        let item = items[i]
        if (item['token'] && item['textContent']) {
            var setItem = {'token':item['token']}
            if (item['src']) {
                setItem['image'] = createImageContent(item['src'])
            }
            setItem['textContent'] = createTextContent(item['textContent'])
            responseData.push(setItem)
        }
    }
    return responseData
}

function createImageContent(src) {
    return new Alexa.ImageHelper().addImageInstance(src).getImage()
}

function createTextContent(textData) {
  var primaryTxt    = '';
  var secondaryTxt  = '';
  var tertiaryTxt   = '';
  if (textData) {
    if (textData.primaryText) {
        primaryTxt = textData['primaryText']
    }
    if (textData.secondaryText) {
        secondaryTxt = textData['secondaryText']
    }
    if (textData.tertiaryText) {
        tertiaryTxt = textData['tertiaryText']
    }
  }
  return new Alexa.RichTextContentHelper()
    .withPrimaryText(primaryTxt)
    .withSecondaryText(secondaryTxt)
    .withTertiaryText(tertiaryTxt)
    .getTextContent
}
