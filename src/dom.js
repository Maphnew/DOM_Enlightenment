// 전역 범위로부터 dom.js 코드를 보호하기 위해 고유 범위를 만든다.
// IIFE가 호출될 때, global의 값은 현재 전역 범위(즉 window)로 설정된다.
(function(win){
    var global = win;
    var doc = this.document;

    var dom = function (params, context) {
        return new GetOrMakeDom(params, context)        
    };

    var regXContainsTag = /^\s*<(\w+|!)[^>]*>/;

    var GetOrMakeDom = function(parmas, context){
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
        }
    };

    // dom을 전역 범위로 노출
    global.dom = dom;

    // prototype에 대한 단축경로
    dom.fn = GetOrMakeDom.prototype;

})(window);


