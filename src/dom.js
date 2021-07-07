// 전역 범위로부터 dom.js 코드를 보호하기 위해 고유 범위를 만든다.
// IIFE가 호출될 때, global의 값은 현재 전역 범위(즉 window)로 설정된다.
(function(win){
    var global = win;
    var doc = this.document;

    var dom = function (params, context) {
        return new GetOrMakeDom(params, context)        
    };

    var regXContainsTag = /^\s*<(\w+|!)[^>]*>/;

    var GetOrMakeDom = function(params, context){
        var currentContext = doc;
        if(context){
            if(context.nodeType){ // 문서 노드 혹은 element 노드 중하나
                currentContext = context;
            }else{ // 문자열 선택자인 경우, 노트를 선택하는 데 사용
                currentContext = doc.querySelector(context);
            }
        }

        // params가 없으면 빈 dom() 개체를 반환
        if(!params || params === '' || typeof params === 'string' && params.trim() === ''){
            this.length = 0;
            return this;
        }
        
        // HTML 문자열인 경우, domfragment를 생성하고 개체를 채워 반환
        if(typeof params === 'string' && regXContainsTag.test(params)){
            // html 문자열이 확실함.
            // div와 docfrag를 생성해서 div를 docfrag에 추가한 후, div의 innerHTML을 문자열로 설정한 후 첫 번째 자식을 가져옴.
            var divElm = currentContext.createElement('div');
            divElm.className = 'hippo-doc-frag-wrapper';
            var docFrag = currentContext.createDocumentFragment();
            docFrag.appendChild(divElm);
            var queryDiv = docFrag.querySelector('div');
            queryDiv.innerHTML = params;
            var numberOfChildren = queryDiv.children.length;
            // html 문자열이 자식들과 함께 전달될 수 있으므로 nodelist에서 루프를 돌며 개체를 채움
            for (var z = 0; z < numberOfChildren; z++){
                this[z] = queryDiv.children[z];
            }
            // 개체에 length 값을 부여
            this.length = numberOfChildren;
            // 개체를 반환
            return this; // 예를 들어, {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}를 반환
        }

        // 단일 노드 참조가 전달된 경우, 개체를 채워서 반환
        if(typeof params === 'object' && params.nodeName){
            this.length = 1;
            this[0] = params;
            return this;
        }
        // 개체이지만 노드가 아닌 경우, 노드 리스트나 배열로 가정한다. 그렇지 않은 경우 문자열 선택자이므로 노드 리스트를 만든다.
        var nodes;
        if(typeof params !== 'string'){ // 노드 리스트나 배열
            nodes = params;
        }else{
            nodes = currentContext.querySelectorAll(params.trim());
        }
        // 위에서 생성된 배열이나 노드 리스트에 대해 루프를 돌면서 개체를 채움
        var nodeLength = nodes.length;
        for(var i = 0; i < nodeLength; i++){
            this[i] = nodes[i];
        }
        // 개체에 length 값을 부여
        this.length = nodeLength;
        // 개체를 반환
        return this; // 예를 들어, {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}를 반환
    };

    // dom을 전역 범위로 노출
    global.dom = dom;

    // prototype에 대한 단축경로
    dom.fn = GetOrMakeDom.prototype;

    dom.fn.each = function(callback) {
        var len = this.length; // dom() 호출 시 getOrMakeDom에서 생성되어 반환되는 특정 인스턴스

        for(var i = 0; i < len; i++) {
            // this값을 element 노드로 설정한 후 매개변수로 전달해서 콜백 함수 호출
            callback.call(this[i], i, this[i]);
        }

        return this; // 예를 들어, {0:ELEMENT_NODE,1:ELEMENT_NODE,length:1}를 반환하여 체인화가 가능하게 한다.
    };

    dom.fn.html = function(htmlString){
        if(htmlString){
            return this.each(function(){ // 매개변수를 가지고 전달된 경우 체인화가 가능 하도록 this를 반환
                this.innerHTML = htmlString;
            });
        }else{
            return this[0].innerHTML;
        }
    };

    dom.fn.text = function(textString){
        if(textString){
            return this.each(function(){ // 매개변수를 가지고 전달된 경우 체인화가 가능 하도록 this를 반환
                this.innerHTML = textString;
            });
        }else{
            return this[0].textContent.trim();
        }
    };
    
    dom.fn.append = function(stringOrObject){
        return this.each(function(){
            if(typeof stringOrObject === 'string'){
                this.insertAdjacentHTML('beforeend', stringOrObject);
            }else{
                var that = this;
                dom(stringOrObject).each(function(name, value){
                    that.insertAdjacentHTML('beforeend',value.outerHTML);
                });
            }
        })
    };

})(window);


