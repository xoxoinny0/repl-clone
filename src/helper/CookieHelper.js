class CookieHelper {
    /** 
     * Singleton 
     * 
     * @returns CookieHelper 타입 객체
     */
    static #current = null;

    static getInstance() {
        if (CookieHelper.#current === null) {
            CookieHelper.#current = new CookieHelper();
        }

        return CookieHelper.#current;
    }

    /**
     * 쿠키 저장
     * 
     * @param   {string}    name    - 저장할 쿠키 이름
     * @param   {string}    value   - 저장할 쿠키 값
     * @param   {json}      options - 유효시간, 유효경로, 도메인 등 옵션
     */
    setCookie(name, value, options = {}) {
        // path 없다면 전역으로 초기화
        if (options.path == undefined) {
            options.path = "/";
        }

        // expire가 있다면 만료일 UTC 표준 문자열로 변환
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        // 초기 쿠키 문자열 생성
        let updateCookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        // options의 정보 추가
        for (const optionKey in options) {
            updateCookie += `;${optionKey}`;
            const optionValue = options[optionKey];
            if (optionValue !== true) {
                updateCookie += `=${optionValue}`;
            }
        }

        // cookie 저장
        document.cookie = updateCookie;
    }

    /**
     * 쿠키 삭제
     * 
     * @param   {string}    name    - 삭제할 쿠키 이름
     */
    deleteCookie(name) {
        // 시간을 0으로 변경 -> 삭제
        this.setCookie(name, "", {"max-age": 0});
    }

    /**
     * 쿠키 조회
     * 
     * @param   {string}    name    - 조회할 쿠키 이름
     * 
     * @returns string
     */
    getCookie(name) {
        // 일치 시 해당 문자열 반환, 없으면 null
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        // 반환할 값이 있으면 디코딩 후 반환, 없으면 undefined
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
}

export default CookieHelper.getInstance();